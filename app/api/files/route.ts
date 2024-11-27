import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

// スキーマ定義
const fileCreateSchema = z.object({
  name: z
    .string()
    .min(1, "ファイル名を入力してください")
    .max(255, "ファイル名は255文字以内で入力してください"),
  folderId: z
    .number()
    .int("フォルダIDは整数である必要があります")
    .positive("有効なフォルダIDを入力してください"),
});

export async function POST(req: NextRequest) {
  try {
    // 認証セッションを取得
    const session = await getServerSession(authOptions);

    // console.log("1");

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { user } = session;

    // console.log("2");

    const json = await req.json();

    // console.log("3");

    // リクエストボディの検証
    const body = fileCreateSchema.parse(json);

    // console.log("4");

    const { name, folderId } = body;

    // console.log("A");

    // フォルダの存在を確認
    const folderExists = await db.folder.findUnique({
      where: { id: folderId },
    });

    // console.log("B");

    if (!folderExists) {
      return NextResponse.json(
        { message: "指定されたフォルダIDが存在しません" },
        { status: 404 }
      );
    }

    // console.log("C");

    // ファイルを作成
    const filer = await db.file.create({
      data: {
        name,
        folderId,
        authorId: user.id,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json(filer);
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(err.issues, { status: 422 });
    }

    if (err instanceof Error) {
      console.error("Unexpected Error:", err.message);
      return NextResponse.json(
        { message: "ファイル作成中に予期しないエラーが発生しました" },
        { status: 500 }
      );
    }

    console.error("Unknown Error:", err);
    return NextResponse.json(
      { message: "予期しないエラーが発生しました" },
      { status: 500 }
    );
  }
}
