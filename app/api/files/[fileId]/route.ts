import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const routeContextSchema = z.object({
  params: z.object({
    fileId: z.string(),
  }),
});

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ fileId: string }> }
) {
  try {
    const resolvedParams = await context.params;
    const { params } = routeContextSchema.parse({ params: resolvedParams });

    const fileId = parseInt(params.fileId, 10); // fileId を数値型に変換

    // 現在のユーザーがこのファイルにアクセス権を持っているか確認
    if (!(await verifyCurrentUserHasAccessToFile(fileId))) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // ファイル内のすべてのクイズを取得
    const quizzes = await db.quiz.findMany({
      where: { fileId }, // fileId に関連付けられたクイズを取得
      include: {
        questions: {
          include: {
            options: true, // 各質問に関連付けられた選択肢も取得
            feedback: true,
          },
        },
      },
    });

    return NextResponse.json(quizzes, { status: 200 });
  } catch (error) {
    console.error("Error fetching quizzes:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ fileId: string }> }
) {
  try {
    // const { params } = routeContextSchema.parse(context);
    // context.paramsをawaitで解決してからパースする

    // console.log("A");
    const resolvedParams = await context.params;

    // console.log("B");
    const { params } = routeContextSchema.parse({ params: resolvedParams });

    // console.log("C", params);

    const fileId = parseInt(params.fileId, 10); // 数値型に変換

    // console.log("D");

    // console.log("fileId", fileId);

    if (!(await verifyCurrentUserHasAccessToPost(fileId))) {
      return NextResponse.json(null, { status: 403 });
    }

    // console.log("E");

    await db.file.delete({
      where: {
        id: fileId,
      },
    });

    // console.log("F");

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 });
    }

    return NextResponse.json(null, { status: 500 });
  }
}

async function verifyCurrentUserHasAccessToPost(fileId: number) {
  const session = await getServerSession(authOptions);
  const count = await db.file.count({
    where: {
      id: fileId,
      authorId: session?.user.id,
    },
  });

  return count > 0;
}

// 現在のユーザーが特定のファイルにアクセス権を持っているか確認
async function verifyCurrentUserHasAccessToFile(fileId: number) {
  const session = await getServerSession(authOptions);

  // ファイルが現在のユーザーのものであるかを確認
  const count = await db.file.count({
    where: {
      id: fileId,
      authorId: session?.user.id,
    },
  });

  return count > 0;
}
