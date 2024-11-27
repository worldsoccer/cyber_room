import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const folderCreateSchema = z.object({
  name: z.string(),
  // content: z.string().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const folders = await db.folder.findMany({
    where: {
      authorId: session.user.id,
    },
    include: {
      files: {
        include: {
          quizzes: true, // ファイル内のクイズ情報を取得
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(folders);
}

//api/posts

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json("Unauthorized", { status: 403 });
    }

    const { user } = session;
    // console.log("user", user);

    const json = await req.json();
    // console.log("Request JSON:", json);

    const body = folderCreateSchema.parse(json);
    const { name } = body;

    // console.log("body", body);

    const folder = await db.folder.create({
      data: {
        name,
        authorId: user.id,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json(folder);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(err.issues, { status: 422 });
    }

    if (err) {
      return NextResponse.json("Requires Pro Plan", { status: 402 });
    }

    console.error("Unexpected Error:", err);
    return NextResponse.json(null, { status: 500 });
  }
}
