"use client";

import { useQuizContext } from "@/context/quiz_context";
import { Quiz } from "@/types/quiz";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import battleConfig from "@/config/battle"; // 設定ファイルをインポート

interface Folder {
  id: number;
  name: string;
  files: {
    id: number;
    name: string;
    quizzes: Quiz[];
  }[];
}

interface BattleTowerSelectionProps {
  userExperience: number;
  userLevel: number;
  folders: Folder[];
}

export default function BattleTowerSelection({
  userExperience,
  userLevel,
  folders,
}: BattleTowerSelectionProps) {
  const {
    selectedFloorLevel,
    setSelectedFloorLevel,
    setDifficulty,
    setSelectedBattleQuizzes,
  } = useQuizContext(); // QuizContext を利用
  const [selectedQuizzes, setSelectedQuizzes] = useState<Quiz[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [selectedFileIds, setSelectedFileIds] = useState<number[]>([]); // 複数ファイルを選択
  // const [selectedFloorLevel, setSelectedFloorLevel] = useState<number | null>(
  //   null
  // );
  const router = useRouter();

  const nextLevelExp = userLevel * battleConfig.levelUpMultiplier;
  const remainingExp = nextLevelExp - userExperience;

  // 階層を1～ユーザーのレベル以下まで動的に生成
  const floorLevels = Array.from({ length: userLevel }, (_, i) => i + 1);

  // 階層に基づいて難易度を計算
  const calculateDifficulty = (floorLevel: number) => {
    return Math.ceil(floorLevel / battleConfig.difficultyIncrementFloor); // 10階ごとに難易度が1ずつ増加
  };

  // フォルダ選択処理
  const handleFolderChange = (folderId: number) => {
    setSelectedFolderId(folderId);
    setSelectedFileIds([]); // フォルダ変更時にファイル選択をリセット
  };

  // ファイル選択処理（複数選択対応）
  const handleFileToggle = (fileId: number) => {
    setSelectedFileIds((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  // クイズ全選択処理
  const handleSelectAllQuizzes = () => {
    const quizzesToSelect = folders
      .flatMap((folder) => folder.files)
      .filter((file) => selectedFileIds.includes(file.id))
      .flatMap((file) => file.quizzes);

    setSelectedQuizzes((prev) =>
      [...prev, ...quizzesToSelect].filter(
        (quiz, index, self) => self.findIndex((q) => q.id === quiz.id) === index // 重複を防ぐ
      )
    );
  };

  // クイズ選択解除処理
  const handleClearQuizzes = () => {
    setSelectedQuizzes([]);
  };

  // ファイル選択解除処理
  const handleClearFiles = () => {
    setSelectedFileIds([]);
    setSelectedQuizzes([]); // ファイルをクリアするとクイズもリセット
  };

  // 階層選択処理
  const handleFloorChange = (floorLevel: number) => {
    setSelectedFloorLevel(floorLevel);
  };

  // クイズ選択処理
  const handleQuizToggle = (quiz: Quiz) => {
    setSelectedQuizzes((prev) =>
      prev.some((q) => q.id === quiz.id)
        ? prev.filter((q) => q.id !== quiz.id) // 既に選択されている場合は解除
        : [...prev, quiz]
    );
  };

  //
  const handleStartBattle = () => {
    if (selectedQuizzes.length === 0 || selectedFloorLevel === null) {
      alert("階層とクイズを選択してください！");
      return;
    }

    const difficulty = calculateDifficulty(selectedFloorLevel); // 階層レベルをそのまま難易度に設定
    setDifficulty(difficulty);
    setSelectedBattleQuizzes(selectedQuizzes);

    // console.log("バトル開始:");
    // console.log("選択された階層:", selectedFloorLevel);
    // console.log("選択された難易度:", difficulty);
    // console.log("選択されたクイズ:", selectedQuizzes);

    // バトル画面への遷移処理をここに追加
    // 遷移時にクイズ情報と階層を渡す
    router.push(`/dashboard/battletower/level-${difficulty}`);
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">バトルタワー</h1>
      <p className="text-lg text-center">
        クイズを選択し、タワーに挑戦して経験値を稼ぎましょう！
      </p>

      <div className="p-4 border rounded shadow-sm bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">現在のステータス</h2>

        {/* レベル表示 */}
        <div className="mb-2">
          <p className="text-gray-700">
            <strong>現在のレベル:</strong> {userLevel}
          </p>
        </div>

        {/* 経験値バー */}
        <div className="mb-2">
          <p className="text-gray-700">
            <strong>現在の経験値:</strong> {userExperience} / {nextLevelExp}
          </p>
          <div className="relative w-full h-4 bg-gray-300 rounded">
            <div
              className="absolute top-0 left-0 h-4 bg-blue-500 rounded"
              style={{ width: `${(userExperience / nextLevelExp) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* 次のレベルまでの経験値 */}
        <div>
          <p className="text-gray-700">
            <strong>次のレベルまでの経験値:</strong> {remainingExp}
          </p>
        </div>
      </div>

      {/* 階層選択 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">階層を選択</h2>
        <select
          className="w-full p-2 border rounded"
          value={selectedFloorLevel || ""}
          onChange={(e) => handleFloorChange(Number(e.target.value))}
        >
          <option value="" disabled>
            階層を選択してください
          </option>
          {floorLevels.map((level) => (
            <option key={level} value={level}>
              {level}階（難易度: {calculateDifficulty(level)}）
            </option>
          ))}
        </select>
      </div>

      {/* クイズ選択 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">クイズを選択</h2>

        {/* フォルダ選択 */}
        <select
          className="w-full p-2 border rounded"
          value={selectedFolderId || ""}
          onChange={(e) => handleFolderChange(Number(e.target.value))}
        >
          <option value="" disabled>
            フォルダを選択してください
          </option>
          {folders.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          ))}
        </select>

        {/* ファイル選択（複数選択可能） */}
        {selectedFolderId && (
          <div className="space-y-2">
            <h3 className="font-semibold">ファイルを選択</h3>
            <ul className="list-none">
              {folders
                .find((folder) => folder.id === selectedFolderId)
                ?.files.map((file) => (
                  <li key={file.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedFileIds.includes(file.id)}
                      onChange={() => handleFileToggle(file.id)}
                    />
                    <label>{file.name}</label>
                  </li>
                ))}
            </ul>
            <button
              onClick={handleClearFiles}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              ファイル選択解除
            </button>
          </div>
        )}

        {/* クイズリスト */}
        {selectedFileIds.length > 0 && (
          <div className="space-y-2">
            <button
              onClick={handleSelectAllQuizzes}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              全選択
            </button>
            <button
              onClick={handleClearQuizzes}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              クイズ選択解除
            </button>
            <ul className="list-disc ml-5">
              {folders
                .flatMap((folder) => folder.files)
                .filter((file) => selectedFileIds.includes(file.id))
                .flatMap((file) => file.quizzes)
                .map((quiz) => (
                  <li key={quiz.id}>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedQuizzes.some((q) => q.id === quiz.id)}
                        onChange={() => handleQuizToggle(quiz)}
                      />
                      <span>{quiz.title}</span>
                    </label>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>

      {/* バトル開始ボタン */}
      <div className="text-center">
        <button
          onClick={handleStartBattle}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          バトル開始
        </button>
      </div>
    </div>
  );
}
