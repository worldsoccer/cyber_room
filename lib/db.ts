import { PrismaClient } from "@prisma/client";

interface GlobalCache {
  prisma?: PrismaClient;
}

// グローバルオブジェクトに型を安全に追加
const globalForPrisma = global as typeof globalThis & GlobalCache;

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  // 本番環境では新しい PrismaClient インスタンスを作成
  prisma = new PrismaClient();
} else {
  // 開発環境ではキャッシュを利用
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  prisma = globalForPrisma.prisma;
}

export const db = prisma;

// import { PrismaClient } from "@prisma/client";

// declare global {
//   var cachePrisma: PrismaClient;
// }

// let prisma: PrismaClient;

// if (process.env.NODE_ENV === "production") {
//   prisma = new PrismaClient();
// } else {
//   if (!global.cachePrisma) {
//     global.cachePrisma = new PrismaClient();
//   }
//   prisma = global.cachePrisma;
// }

// export const db = prisma;
