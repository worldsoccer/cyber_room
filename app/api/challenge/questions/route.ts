import { db } from "@/lib/db";
import { NextResponse } from "next/server";

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const folderId = parseInt(searchParams.get("folderId") || "0");
    const limit = parseInt(searchParams.get("limit") || "0");

    if (!folderId || folderId <= 0) {
      return NextResponse.json(
        { error: "フォルダ ID が無効です。" },
        { status: 400 }
      );
    }

    if (!limit || limit <= 0) {
      return NextResponse.json(
        { error: "問題数が無効です。" },
        { status: 400 }
      );
    }

    // 質問をSupabaseから取得
    const questions = await db.question.findMany({
      where: { quiz: { file: { folderId } } },
      include: {
        quiz: { select: { imagePath: true } },
        options: true,
        feedback: true,
      },
    });

    if (questions.length === 0) {
      return NextResponse.json(
        { error: "指定されたフォルダに質問が存在しません。" },
        { status: 404 }
      );
    }

    // 配列をシャッフルして、指定された数だけ切り取る
    const shuffledQuestions = shuffleArray(questions).slice(0, limit);

    const formattedQuestions = shuffledQuestions.map((question) => ({
      id: question.id,
      text: question.text,
      options: question.options,
      feedback: question.feedback,
      imagePath: question.quiz.imagePath,
    }));

    return NextResponse.json(formattedQuestions);
  } catch (error) {
    console.error("質問データの取得中にエラーが発生しました:", error);
    return NextResponse.json(
      { error: "質問データの取得中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}

// import { db } from "@/lib/db";
// import { NextResponse } from "next/server";

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const folderId = parseInt(searchParams.get("folderId") || "0");
//     const limit = parseInt(searchParams.get("limit") || "0");

//     if (!folderId || folderId <= 0) {
//       return NextResponse.json(
//         { error: "フォルダ ID が無効です。" },
//         { status: 400 }
//       );
//     }

//     if (!limit || limit <= 0) {
//       return NextResponse.json(
//         { error: "問題数が無効です。" },
//         { status: 400 }
//       );
//     }

//     // 質問と関連する Quiz から画像を取得
//     const questions = await db.question.findMany({
//       where: { quiz: { file: { folderId } } },
//       take: limit,
//       include: {
//         quiz: { select: { imagePath: true } }, // Quiz から画像を取得
//         options: true,
//         feedback: true,
//       },
//     });

//     if (questions.length === 0) {
//       return NextResponse.json(
//         { error: "指定されたフォルダに質問が存在しません。" },
//         { status: 404 }
//       );
//     }

//     // Quiz の imagePath を質問ごとに追加
//     const formattedQuestions = questions.map((question) => ({
//       id: question.id,
//       text: question.text,
//       options: question.options,
//       feedback: question.feedback,
//       imagePath: question.quiz.imagePath, // Quiz の画像パスを追加
//     }));

//     return NextResponse.json(formattedQuestions);
//   } catch (error) {
//     console.error("質問データの取得中にエラーが発生しました:", error);
//     return NextResponse.json(
//       { error: "質問データの取得中にエラーが発生しました。" },
//       { status: 500 }
//     );
//   }
// }
