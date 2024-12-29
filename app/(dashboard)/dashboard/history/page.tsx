"use client";

import { useEffect, useState } from "react";

// 履歴データの型定義
interface HistoryItem {
  folderId: number;
  folderName: string;
  totalQuestions: number;
  clearCount: number;
  lastClearedAt: string;
  mode: string;
}

export default function ChallengeHistory() {
  const [groupedHistory, setGroupedHistory] = useState<
    Record<string, HistoryItem[]>
  >({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("/api/challenge/history");

        if (!response.ok) {
          throw new Error(`Failed to fetch history: ${response.status}`);
        }

        const data: HistoryItem[] = await response.json();

        // フォルダごとにデータをグループ化し、モード順にソート
        const grouped: Record<string, HistoryItem[]> = {};
        data.forEach((item) => {
          if (!grouped[item.folderName]) {
            grouped[item.folderName] = [];
          }
          grouped[item.folderName].push(item);
        });

        // 各フォルダ内をモード順にソート
        Object.keys(grouped).forEach((folderName) => {
          grouped[folderName].sort((a, b) => a.mode.localeCompare(b.mode));
        });

        setGroupedHistory(grouped);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      }
    };

    fetchHistory();
  }, []);

  if (error) {
    return <p className="text-red-500">エラー: {error}</p>;
  }

  if (!Object.keys(groupedHistory).length) {
    return <p>履歴がありません。</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">クリア履歴</h1>
      {Object.entries(groupedHistory).map(([folderName, items]) => (
        <div key={folderName} className="mb-6">
          <h2 className="text-xl font-bold mb-2">{folderName}</h2>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">モード</th>
                <th className="border border-gray-300 px-4 py-2">クリア回数</th>
                <th className="border border-gray-300 px-4 py-2">
                  最終クリア日
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={`${item.folderId}-${item.mode}`}>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.mode}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.clearCount}回
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(item.lastClearedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
