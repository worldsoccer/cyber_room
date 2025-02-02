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
  const { setSelectedUserLevel, setDifficulty, setSelectedBattleQuizzes } =
    useQuizContext(); // QuizContext を利用
  const [selectedQuizzes, setSelectedQuizzes] = useState<Quiz[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [selectedFileIds, setSelectedFileIds] = useState<number[]>([]); // 複数ファイルを選択
  // const [selectedFloorLevel, setSelectedFloorLevel] = useState<number | null>(
  //   null
  // );
  const router = useRouter();

  const nextLevelExp = userLevel * battleConfig.levelUpMultiplier;
  const remainingExp = nextLevelExp - userExperience;

  // 階層に基づいて難易度を計算
  const calculateDifficulty = (floorLevel: number): number => {
    const { difficultyIncrementFloor } = battleConfig;
    return Math.ceil(floorLevel / difficultyIncrementFloor);
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
    if (selectedQuizzes.length === 0) {
      alert("クイズを選択してください！");
      return;
    }

    const difficulty = calculateDifficulty(userLevel); // 階層レベルをそのまま難易度に設定
    setDifficulty(difficulty);
    setSelectedBattleQuizzes(selectedQuizzes);
    setSelectedUserLevel(userLevel);

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
      <div className="flex items-center justify-between p-4 bg-gray-100 rounded shadow-sm">
        <div>
          <p className="text-gray-700 font-semibold">
            階層: <span className="text-blue-600">{userLevel}階</span>
          </p>
        </div>
        <div>
          <p className="text-gray-700 font-semibold">
            難易度:{" "}
            <span className="text-blue-600">
              {calculateDifficulty(userLevel)}
            </span>
          </p>
        </div>
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
            <ul className="list-none space-y-2">
              {folders
                .find((folder) => folder.id === selectedFolderId)
                ?.files.map((file) => (
                  <li key={file.id} className="flex items-center space-x-2">
                    <label
                      className="flex items-center space-x-2 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        handleFileToggle(file.id);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedFileIds.includes(file.id)}
                        onChange={() => handleFileToggle(file.id)}
                        className="cursor-pointer"
                      />
                      <span className="cursor-pointer">{file.name}</span>
                    </label>
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
            <ul className="list-none ml-5 space-y-2">
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
