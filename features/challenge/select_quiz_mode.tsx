"use client";

import { challengeConfig, GameMode } from "@/config/challenge";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Folder {
  id: number;
  name: string;
  questionCount: number; // 質問数
}

interface SelectQuizProps {
  folders: Folder[];
}

export default function SelectQuiz({ folders }: SelectQuizProps) {
  const router = useRouter();
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode | null>(
    null
  );

  // 選択したフォルダに応じて問題数を制限
  const availableGameModes: GameMode[] = selectedFolder
    ? challengeConfig.filter(
        (mode) => mode.questions <= selectedFolder.questionCount
      )
    : [];

  // クイズ画面へ遷移
  const startChallenge = () => {
    if (selectedFolder && selectedGameMode) {
      router.push(
        `/dashboard/challenge/start?folderId=${selectedFolder.id}&questions=${selectedGameMode.questions}&mode=${selectedGameMode.name}`
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
            setSelectedGameMode(null);
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

      {/* ゲームモード選択 */}
      <div style={{ marginBottom: "20px" }}>
        <label>ゲームモードを選択:</label>
        <select
          onChange={(e) => {
            const mode = availableGameModes.find(
              (mode) => mode.questions === Number(e.target.value)
            );
            setSelectedGameMode(mode || null);
          }}
          value={selectedGameMode?.questions ?? ""}
          disabled={!availableGameModes.length}
        >
          <option value="" disabled>
            ゲームモードを選んでください
          </option>
          {availableGameModes.map((mode) => (
            <option key={mode.questions} value={mode.questions}>
              {mode.name}（{mode.questions}問）
            </option>
          ))}
        </select>
      </div>

      {/* 開始ボタン */}
      <button
        onClick={startChallenge}
        disabled={!selectedFolder || !selectedGameMode}
      >
        チャレンジ開始
      </button>
    </div>
  );
}
