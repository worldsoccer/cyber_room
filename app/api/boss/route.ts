import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Supabaseクライアント
const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_KEY || ""
);

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }
    const formData = await req.formData();

    // ボス情報を取得
    const name = formData.get("name") as string | null;
    const description = formData.get("description") as string | null;
    const maxHp = parseInt(formData.get("maxHp") as string, 10);
    const attackPower = parseInt(formData.get("attackPower") as string, 10);
    const attackTurn = parseInt(formData.get("attackTurn") as string, 10);
    const difficulty = parseInt(formData.get("difficulty") as string, 10);
    // ユーザーIDを取得 (例: 認証から)
    const authorId = session.user.id; // ここで適切にユーザーIDを取得してください

    if (
      !name ||
      !description ||
      isNaN(maxHp) ||
      isNaN(attackPower) ||
      isNaN(attackTurn) ||
      isNaN(difficulty)
    ) {
      console.error("Invalid request data:", {
        name,
        description,
        maxHp,
        attackPower,
        attackTurn,
        difficulty,
      });
      return NextResponse.json(
        { error: "すべてのフィールドを正しく入力してください。" },
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

    // ボスデータをPrismaで保存
    const createdBoss = await db.boss.create({
      data: {
        name,
        description,
        maxHp,
        hp: maxHp, // hpをmaxHpと同じ値に設定
        attackPower,
        attackTurn,
        difficulty,
        imageUrl,
        authorId,
      },
    });

    // 作成後のリダイレクト先のURLを返す
    return NextResponse.json({ bossId: createdBoss.id });
  } catch (error: unknown) {
    console.error(
      "ボス登録エラー:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "ボス登録中にエラーが発生しました。",
      },
      { status: 500 }
    );
  }
}
