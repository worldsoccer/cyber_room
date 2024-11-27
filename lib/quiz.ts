import { db } from "./db";

export async function getFoldersWithQuizzes(userId: string) {
  const folderWithQuizzes = await db.folder.findMany({
    where: { authorId: userId },
    include: {
      files: {
        include: {
          quizzes: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return folderWithQuizzes.map((folder) => ({
    id: folder.id,
    name: folder.name,
  }));
}
