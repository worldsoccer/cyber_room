// Prisma 型を拡張して `folderWithQuizzes` を型安全に
export type FolderWithQuizzes = Prisma.FolderGetPayload<{
  include: {
    files: {
      include: {
        quizzes: true;
      };
    };
  };
}>;

// quizzes 型を取得
export type Quiz = FolderWithQuizzes["files"][0]["quizzes"][0];
export type FileWithQuizzes = FolderWithQuizzes["files"][0];
