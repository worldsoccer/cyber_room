import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  // リクエスト URL からクエリパラメータを取得
  const { searchParams } = new URL(req.url);
  const quizIdParam = searchParams.get("quizId");

  // クエリパラメータを数値に変換
  const quizId = parseInt(quizIdParam || "", 10);

  if (isNaN(quizId)) {
    return NextResponse.json(
      { error: "クイズIDが無効です。" },
      { status: 400 }
    );
  }

  try {
    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            options: true,
            feedback: true,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json(
        { error: "クイズが見つかりませんでした。" },
        { status: 404 }
      );
    }

    return NextResponse.json(quiz);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("エラー:", error.message);
      return NextResponse.json(
        { error: "クイズデータの取得中にエラーが発生しました。" },
        { status: 500 }
      );
    } else {
      console.error("Unknown error:", error);
      return NextResponse.json(
        { error: "予期しないエラーが発生しました。" },
        { status: 500 }
      );
    }
  }
}

// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";

// export async function GET(
//   req: Request,
//   { params }: { params: { quizId: string } }
// ) {
//   // console.log("A");
//   // console.log("params.quizId", params); // デバッグ用

//   // `params` を非同期に解決
//   const resolvedParams = await params;
//   const quizId = parseInt(resolvedParams.quizId, 10);

//   if (isNaN(quizId)) {
//     return NextResponse.json(
//       { error: "クイズIDが無効です。" },
//       { status: 400 }
//     );
//   }

//   try {
//     // console.log("B");
//     const quiz = await db.quiz.findUnique({
//       where: { id: quizId },
//       include: {
//         questions: {
//           include: {
//             options: true,
//             feedback: true,
//           },
//         },
//       },
//     });

//     // console.log("quiz", quiz);

//     if (!quiz) {
//       return NextResponse.json(
//         { error: "クイズが見つかりませんでした。" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(quiz);
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       console.error("エラー:", error.message);
//       return NextResponse.json(
//         { error: "クイズデータの取得中にエラーが発生しました。" },
//         { status: 500 }
//       );
//     } else {
//       console.error("Unknown error:", error);
//       return NextResponse.json(
//         { error: "予期しないエラーが発生しました。" },
//         { status: 500 }
//       );
//     }
//   }
// }
