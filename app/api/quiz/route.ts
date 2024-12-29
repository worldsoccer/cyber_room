import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createClient } from "@supabase/supabase-js";

// Supabaseクライアント
const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_KEY || ""
);

// クイズの質問データの型
interface QuestionData {
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty?: number;
  explanation?: string;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // fileId を取得
    const fileId = parseInt(formData.get("fileId") as string, 10);
    if (isNaN(fileId)) {
      return NextResponse.json(
        { error: "有効な fileId が提供されていません。" },
        { status: 400 }
      );
    }

    // タイトルと説明を取得
    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;

    if (!title || !description) {
      return NextResponse.json(
        { error: "クイズのタイトルまたは説明が提供されていません。" },
        { status: 400 }
      );
    }

    // クイズの質問データを取得
    const questions = formData.get("questions") as string | null;
    if (!questions) {
      return NextResponse.json(
        { error: "クイズデータが提供されていません。" },
        { status: 400 }
      );
    }

    let parsedQuestions: QuestionData[];
    try {
      parsedQuestions = JSON.parse(questions);
      if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
        throw new Error("質問データが無効です。");
      }
    } catch (error) {
      return NextResponse.json(
        { error: "質問データの解析中にエラーが発生しました。" },
        { status: 400 }
      );
    }

    // 画像データ (オプション)
    const file = formData.get("image") as File | null;
    let imageUrl: string | null = null;

    if (file) {
      try {
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9_.-]/g, ""); // 不正文字を削除
        const filePath = `uploads/${Date.now()}_${sanitizedFileName}`;

        const { data, error } = await supabase.storage
          .from("public-img-bucket")
          .upload(filePath, await file.arrayBuffer(), {
            contentType: file.type,
          });

        if (error) {
          console.error("画像アップロードエラー:", error.message);
          throw new Error(`画像アップロードに失敗しました: ${error.message}`);
        }

        imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/public-img-bucket/${data.path}`;
      } catch (uploadError) {
        if (uploadError instanceof Error) {
          return NextResponse.json(
            {
              error: `画像のアップロード中にエラーが発生しました: ${uploadError.message}`,
            },
            { status: 500 }
          );
        } else {
          return NextResponse.json(
            { error: "画像のアップロード中に予期しないエラーが発生しました。" },
            { status: 500 }
          );
        }
      }
    }

    // クイズデータをPrismaで保存
    const createdQuiz = await db.quiz.create({
      data: {
        title,
        description,
        imagePath: imageUrl,
        generatedByAI: true,
        fileId,
        questions: {
          create: parsedQuestions.map((q: QuestionData, index: number) => {
            // 質問データの検証
            if (
              !q.question ||
              !Array.isArray(q.options) ||
              q.options.length < 4 || // 必須選択肢の数を確認
              typeof q.correctAnswer !== "number" ||
              q.correctAnswer < 1 || // 1ベースの正解インデックスを確認
              q.correctAnswer > q.options.length
            ) {
              throw new Error(
                `質問データが無効です (質問 ${index + 1}): ${JSON.stringify(q)}`
              );
            }

            return {
              text: q.question,
              difficulty: q.difficulty || 1, // 難易度 (デフォルト値: 1)
              options: {
                create: q.options.map((opt: string, optIndex: number) => ({
                  text: opt,
                  isCorrect: optIndex + 1 === q.correctAnswer, // 正解判定 (1ベース)
                })),
              },
              feedback: {
                create: {
                  text: q.explanation || "解説はありません。", // 解説を登録
                },
              },
            };
          }),
        },
      },
    });

    return NextResponse.json({ quizId: createdQuiz.id });
  } catch (error: unknown) {
    console.error(
      "クイズ登録エラー:",
      error instanceof Error ? error.message : error
    );
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "JSON 形式が無効です。" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "クイズ登録中にエラーが発生しました。",
      },
      { status: 500 }
    );
  }
}
