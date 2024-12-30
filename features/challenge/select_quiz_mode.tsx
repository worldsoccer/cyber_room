"use client";

import { challengeConfig, GameMode } from "@/config/challenge";
import { useRouter } from "next/navigation";
import { useQuizContext } from "@/context/quiz_context";

interface ExtendedFolder {
  id: number;
  name: string;
  questionCount: number; // データベース Folder に追加したカスタムプロパティ
}

export default function SelectQuizMode({
  folders,
}: {
  folders: ExtendedFolder[];
}) {
  const {
    selectedFolder,
    setSelectedFolder,
    selectedQuestions,
    setSelectedQuestions,
    setSelectedMode,
  } = useQuizContext();
  const router = useRouter();

  const availableGameModes: GameMode[] = selectedFolder
    ? challengeConfig.filter(
        (mode) => mode.questions <= selectedFolder.questionCount
      )
    : [];

  const startChallenge = () => {
    if (selectedFolder && selectedQuestions) {
      router.push(
        `/dashboard/challenge/start?folderId=${selectedFolder.id}&questions=${selectedQuestions}`
      );
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
      <h2>クイズに挑戦</h2>

      {/* フォルダ選択 */}
      <div style={{ marginBottom: "20px" }}>
        <label>フォルダを選択:</label>
        <select
          onChange={(e) => {
            const folder = folders.find((f) => f.id === Number(e.target.value));
            setSelectedFolder(folder || null);
            setSelectedQuestions(null); // 質問数をリセット
          }}
          value={selectedFolder?.id ?? ""}
        >
          <option value="" disabled>
            フォルダを選んでください
          </option>
          {folders.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.name}（{folder.questionCount}問）
            </option>
          ))}
        </select>
      </div>

      {/* 質問数選択 */}
      <div style={{ marginBottom: "20px" }}>
        <label>質問数を選択:</label>
        <select
          onChange={(e) => {
            const selectedMode = availableGameModes.find(
              (mode) => mode.questions === Number(e.target.value)
            );
            setSelectedQuestions(Number(e.target.value));
            setSelectedMode(selectedMode?.name || null); // mode.name を setSelectedMode に設定
          }}
          value={selectedQuestions ?? ""}
          disabled={!availableGameModes.length}
        >
          <option value="" disabled>
            質問数を選んでください
          </option>
          {availableGameModes.map((mode) => (
            <option key={mode.questions} value={mode.questions}>
              {mode.name}（{mode.questions}問）
            </option>
          ))}
        </select>
      </div>

      {/* チャレンジ開始ボタン */}
      <button
        onClick={startChallenge}
        disabled={!selectedFolder || !selectedQuestions}
      >
        チャレンジ開始
      </button>
    </div>
  );
}

// "use client";

// import { challengeConfig, GameMode } from "@/config/challenge";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// interface Folder {
//   id: number;
//   name: string;
//   questionCount: number; // 質問数
// }

// interface SelectQuizProps {
//   folders: Folder[];
// }

// export default function SelectQuiz({ folders }: SelectQuizProps) {
//   const router = useRouter();
//   const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
//   const [selectedQuestions, setSelectedQuestions] = useState<number | null>(
//     null
//   );

//   // 選択したフォルダに応じて問題数を制限
//   const availableGameModes: GameMode[] = selectedFolder
//     ? challengeConfig.filter(
//         (mode) => mode.questions <= selectedFolder.questionCount
//       )
//     : [];

//   // クイズ画面へ遷移
//   const startChallenge = () => {
//     if (selectedFolder && selectedQuestions) {
//       router.push(
//         `/dashboard/challenge/start?folderId=${selectedFolder.id}&questions=${selectedQuestions}`
//       );
//     }
//   };

//   return (
//     <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
//       <h2>クイズに挑戦</h2>

//       {/* フォルダ選択 */}
//       <div style={{ marginBottom: "20px" }}>
//         <label>フォルダを選択:</label>
//         <select
//           onChange={(e) => {
//             const folder = folders.find((f) => f.id === Number(e.target.value));
//             setSelectedFolder(folder || null);
//             setSelectedQuestions(null);
//           }}
//           value={selectedFolder?.id ?? ""}
//         >
//           <option value="" disabled>
//             フォルダを選んでください
//           </option>
//           {folders.map((folder) => (
//             <option key={folder.id} value={folder.id}>
//               {folder.name}（{folder.questionCount}問）
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* 問題数選択 */}
//       <div style={{ marginBottom: "20px" }}>
//         <label>問題数を選択:</label>
//         <select
//           onChange={(e) => setSelectedQuestions(Number(e.target.value))}
//           value={selectedQuestions ?? ""}
//           disabled={!availableGameModes.length}
//         >
//           <option value="" disabled>
//             問題数を選んでください
//           </option>
//           {availableGameModes.map((mode) => (
//             <option key={mode.questions} value={mode.questions}>
//               {mode.name}（{mode.questions}問）
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* 開始ボタン */}
//       <button
//         onClick={startChallenge}
//         disabled={!selectedFolder || !selectedQuestions}
//       >
//         チャレンジ開始
//       </button>
//     </div>
//   );
// }
