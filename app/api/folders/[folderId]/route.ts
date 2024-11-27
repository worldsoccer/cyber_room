import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { folderPatchSchema } from "@/lib/validations/folder";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const routeContextSchema = z.object({
  params: z.object({
    folderId: z.string(),
  }),
});

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ folderId: string }> }
) {
  try {
    // context.params を await で解決してからパースする
    const resolvedParams = await context.params;
    const { params } = routeContextSchema.parse({ params: resolvedParams });

    // console.log("params", params);

    // folderIdを数値型に変換
    const folderId = parseInt(params.folderId, 10);

    if (!(await verifyCurrentUserHasAccessToPost(folderId))) {
      return NextResponse.json(null, { status: 403 });
    }

    const json = await req.json();
    // console.log("Request payload:", json);
    const body = folderPatchSchema.parse(json);

    //todo: sanitization for content
    await db.folder.update({
      where: {
        id: folderId,
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

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ folderId: string }> }
) {
  try {
    // const { params } = routeContextSchema.parse(context);
    // context.paramsをawaitで解決してからパースする
    const resolvedParams = await context.params;
    const { params } = routeContextSchema.parse({ params: resolvedParams });

    const folderId = parseInt(params.folderId, 10); // 数値型に変換

    if (!(await verifyCurrentUserHasAccessToPost(folderId))) {
      return NextResponse.json(null, { status: 403 });
    }

    await db.folder.delete({
      where: {
        id: folderId,
      },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 });
    }

    return NextResponse.json(null, { status: 500 });
  }
}

async function verifyCurrentUserHasAccessToPost(folderId: number) {
  const session = await getServerSession(authOptions);
  const count = await db.folder.count({
    where: {
      id: folderId,
      authorId: session?.user.id,
    },
  });

  return count > 0;
}
