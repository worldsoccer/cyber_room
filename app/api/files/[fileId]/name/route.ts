import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { filePatchSchema } from "@/lib/validations/file";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const routeContextSchema = z.object({
  params: z.object({
    fileId: z.string(),
  }),
});

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ fileId: string }> }
) {
  try {
    // context.params を await で解決してからパースする
    const resolvedParams = await context.params;
    const { params } = routeContextSchema.parse({ params: resolvedParams });

    // console.log("params", params);

    // folderIdを数値型に変換
    const fileId = parseInt(params.fileId, 10);

    if (!(await verifyCurrentUserHasAccessToPost(fileId))) {
      return NextResponse.json(null, { status: 403 });
    }

    const json = await req.json();
    // console.log("Request payload:", json);
    const body = filePatchSchema.parse(json);

    //todo: sanitization for content
    await db.file.update({
      where: {
        id: fileId,
      },
      data: {
        name: body.name,
      },
    });

    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // console.error("Validation error details:", error.issues);
      return NextResponse.json(error.issues, { status: 422 });
    }
    // return NextResponse.json(
    //   { message: "Internal Server Error" },
    //   { status: 500 }
    // );
  }
}

async function verifyCurrentUserHasAccessToPost(fileId: number) {
  const session = await getServerSession(authOptions);

  // console.log("session?.user.id,", session?.user.id);
  const count = await db.file.count({
    where: {
      id: fileId,
      authorId: session?.user.id,
    },
  });

  // console.log("count", count);

  return count > 0;
}
