// GameMode 型の定義
export interface GameMode {
  name: string; // ゲームモード名
  questions: number; // 問題数
}

export const challengeConfig: GameMode[] = [
  { name: "テスト", questions: 1 },
  { name: "テスト2", questions: 2 },
  { name: "チャレンジ10", questions: 10 },
  { name: "チャレンジ20", questions: 20 },
  { name: "チャレンジ30", questions: 30 },
  { name: "チャレンジ40", questions: 40 },
  { name: "ライトチャレンジ", questions: 50 },
  { name: "スタンダードモード", questions: 100 },
  { name: "ハーフマラソン", questions: 200 },
  { name: "マラソンモード", questions: 300 },
  { name: "エキスパート", questions: 400 },
  { name: "ウルトラマラソン", questions: 500 },
  { name: "チャレンジ600", questions: 600 },
  { name: "セブンハンドレッド", questions: 700 },
  { name: "マスターズモード", questions: 800 },
  { name: "グランドマスター", questions: 900 },
  { name: "アルティメットチャレンジ", questions: 1000 },
];
