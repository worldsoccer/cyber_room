"use client";

import { useState, useEffect } from "react";
import { useQuizContext } from "@/context/quiz_context";
import Image from "next/image";
import { useRouter } from "next/navigation";
import battleConfig from "@/config/battle"; // 設定ファイルをインポート

interface Option {
  id: number;
  text: string;
  isCorrect: boolean;
}

interface Feedback {
  id: number;
  text: string;
}

interface Question {
  id: number;
  text: string;
  options: Option[];
  feedback?: Feedback;
  mode?: "attack" | "heal"; // 攻撃 or 回復のモード
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  imagePath: string | null; // 追加: Quiz全体の画像パス
  questions: Question[];
}

interface Boss {
  id: number;
  name: string;
  hp: number;
  attackPower: number;
  attackTurn: number;
  imageUrl: string;
}

interface BattleData {
  bosses: Boss[]; // 複数のボスに対応
  quizzes: Quiz[];
  user: {
    hp: number;
    maxHp: number;
    experience: number;
    level: number;
    attackPower: number;
    healingPower: number;
  };
}

export default function BattleTower() {
  const router = useRouter();
  const { selectedBattleQuizzes, difficulty, selectedFloorLevel } =
    useQuizContext();

  const [battleData, setBattleData] = useState<BattleData | null>(null);
  const [currentBossIndex, setCurrentBossIndex] = useState(0); // 現在のボスのインデックス
  const [boss, setBoss] = useState<Boss | null>(null);
  const [bossHp, setBossHp] = useState<number>(100);
  const [userHp, setUserHp] = useState(100);
  const [maxHp, setMaxHp] = useState<number | null>(null);
  // const [, setUserLevel] = useState<number | null>(null);
  // const [, setExperience] = useState<number | null>(null);
  const [attackPower, setAttackPower] = useState<number | null>(null);
  const [healingPower, setHealingPower] = useState<number | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [turnCount, setTurnCount] = useState(1);
  const [gameOver, setGameOver] = useState<"win" | "lose" | null>(null);
  const [remainingBossTurns, setRemainingBossTurns] = useState(0);
  const [lastFeedback, setLastFeedback] = useState<string | null>(null); // 最後の解説を表示
  const [lastAnsweredQuestion, setLastAnsweredQuestion] =
    useState<Question | null>(null);
  // const [floorLevel, setFloorLevel] = useState<number>(
  //   Number(selectedFloorLevel)
  // );

  // バトルデータを取得
  useEffect(() => {
    const fetchBattleData = async () => {
      try {
        // console.log({
        //   quizIds: selectedBattleQuizzes.map((quiz) => quiz.id),
        //   difficulty,
        //   selectedFloorLevel,
        // });

        const response = await fetch("/api/boss/battle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quizIds: selectedBattleQuizzes.map((quiz) => quiz.id),
            difficulty,
            selectedFloorLevel,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch battle data");
        }

        const data: BattleData = await response.json();
        // console.log("data", data);
        setBattleData(data);
        // 初期ボス情報設定
        setBoss(data.bosses[0]);
        setBossHp(data.bosses[0].hp);
        setUserHp(data.user.hp);
        setMaxHp(data.user.maxHp);
        // setUserLevel(data.user.level);
        // setExperience(data.user.experience);
        setAttackPower(data.user.attackPower);
        setHealingPower(data.user.healingPower);
        setRemainingBossTurns(data.bosses[0].attackTurn); // 初期の攻撃ターン数を設定
      } catch (error) {
        console.error("Failed to fetch battle data:", error);
      }
    };

    fetchBattleData();
  }, [selectedBattleQuizzes, difficulty, selectedFloorLevel]);

  useEffect(() => {
    if (bossHp === 0 && battleData) {
      if (currentBossIndex < battleData.bosses.length - 1) {
        // 次のボスへ進む
        const nextBossIndex = currentBossIndex + 1;
        setCurrentBossIndex(nextBossIndex);
        setBoss(battleData.bosses[nextBossIndex]);
        setBossHp(battleData.bosses[nextBossIndex].hp);
        setRemainingBossTurns(battleData.bosses[nextBossIndex].attackTurn); // 初期の攻撃ターン数を設定
        setTurnCount(1);
      } else {
        // 全てのボスに勝利
        setGameOver("win");
      }
    }
  }, [bossHp, battleData, currentBossIndex]);

  // ボスの攻撃処理
  // ボスの攻撃処理
  useEffect(() => {
    if (gameOver || !boss || remainingBossTurns > 0) return;

    const bossAttack = setTimeout(() => {
      // クリティカルヒットの判定
      const isCriticalHit = Math.random() < battleConfig.bossCriticalHitChance;
      const damage = isCriticalHit
        ? boss.attackPower * battleConfig.bossCriticalHitMultiplier
        : boss.attackPower;

      // ユーザーのHPを更新
      setUserHp((prev) => Math.max(0, prev - damage));

      // 結果をアラート表示
      alert(
        `ボスの攻撃！ あなたに${damage}ダメージを与えました！${
          isCriticalHit ? " クリティカルヒット！" : ""
        }`
      );

      // 次の攻撃ターン数をリセット
      setRemainingBossTurns(boss.attackTurn);

      // ターン数を更新
      setTurnCount((prev) => prev + 1);
    }, 1000);

    return () => clearTimeout(bossAttack); // クリーンアップ処理
  }, [gameOver, boss, remainingBossTurns]);

  // HPが0以下になったときの敗北処理
  useEffect(() => {
    if (userHp <= 0) {
      setGameOver("lose"); // 敗北状態に設定
    }
  }, [userHp]);

  // プレイヤーの行動
  const handleAction = (mode: "attack" | "heal") => {
    if (gameOver || isAnswering || remainingBossTurns === 0) return;

    if (battleData && battleData.quizzes.length > 0) {
      const randomQuiz =
        battleData.quizzes[
          Math.floor(Math.random() * battleData.quizzes.length)
        ];
      const randomQuestion =
        randomQuiz.questions[
          Math.floor(Math.random() * randomQuiz.questions.length)
        ];
      setCurrentQuiz(randomQuiz); // 現在のQuizをセット
      setCurrentQuestion({ ...randomQuestion, mode });
      setIsAnswering(true);
      setLastFeedback(null);
    } else {
      console.error("No quizzes available or battleData is null.");
    }
  };

  // クイズ選択した時の処理
  const handleAnswer = (isCorrect: boolean) => {
    if (currentQuestion && attackPower && healingPower) {
      let newBossHp = bossHp;
      let newUserHp = userHp;

      if (isCorrect) {
        if (currentQuestion.mode === "attack") {
          // クリティカルヒットの判定
          const isCriticalHit =
            Math.random() < battleConfig.playerCriticalHitChance;
          const damage = isCriticalHit
            ? attackPower * battleConfig.playerCriticalHitMultiplier
            : attackPower;

          newBossHp = Math.max(0, bossHp - damage); // ボスにダメージ
          // console.log(
          //   `正解: 攻撃モード | クリティカルヒット: ${isCriticalHit}, ダメージ: ${damage}`
          // );

          alert(
            `正解！ボスに${damage}のダメージを与えました！${
              isCriticalHit ? " クリティカルヒット！" : ""
            }`
          );
        } else if (currentQuestion.mode === "heal") {
          // 特別回復効果の判定
          const isSpecialHeal =
            Math.random() < battleConfig.playerSpecialHealChance;
          const healAmount = isSpecialHeal
            ? healingPower * battleConfig.playerSpecialHealMultiplier
            : healingPower;

          newUserHp = Math.min(maxHp!, userHp + healAmount); // HPを回復
          // console.log(`正解: 回復モード | 特別回復: ${isSpecialHeal}, 回復量: ${healAmount}`);

          alert(
            `正解！HPが${healAmount}回復しました！${
              isSpecialHeal ? " 特別回復効果！" : ""
            }`
          );
        }
      } else {
        if (currentQuestion.mode === "attack") {
          // 不正解時のペナルティダメージ
          const damage = Math.floor(attackPower / battleConfig.damageDivisor);
          newUserHp = Math.max(0, userHp - damage);

          alert(
            `不正解... あなたは失敗し、自分に${damage}のダメージを与えました。\n正解: ${
              currentQuestion.options.find((o) => o.isCorrect)?.text
            }`
          );
        } else {
          alert(
            `不正解... 効果はありませんでした。\n正解: ${
              currentQuestion.options.find((o) => o.isCorrect)?.text
            }`
          );
        }
      }

      // 状態をまとめて更新
      setBossHp(newBossHp);
      setUserHp(newUserHp);
      setLastFeedback(currentQuestion.feedback?.text || null);
      setLastAnsweredQuestion(currentQuestion);
      setShowImage(false);
      setCurrentQuestion(null);
      setIsAnswering(false);
      setTurnCount((prev) => prev + 1);
      setRemainingBossTurns((prev) => prev - 1);
    }
  };

  // const resetGame = () => {
  //   setBossHp(boss?.hp || 100);
  //   setUserHp(maxHp!);
  //   setTurnCount(1);
  //   setRemainingBossTurns(boss?.attackTurn || 0);
  //   setGameOver(null);
  // };

  // 勝利・敗北時の処理
  useEffect(() => {
    if (gameOver === "win") {
      const handleWin = async () => {
        try {
          const response = await fetch("/api/user/updateExperience", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              experienceGained:
                difficulty! * selectedFloorLevel! * battleConfig.levelup, // 勝利時に獲得する経験値
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to update user experience");
          }

          // const data = await response.json();
          alert(
            `勝利！ 経験値 +${
              difficulty! * selectedFloorLevel! * battleConfig.levelup
            }`
          );
          router.push("/dashboard/battletower"); // 勝利後、ダッシュボードに戻る
        } catch (error) {
          console.error("Failed to handle win:", error);
        }
      };

      handleWin();
    }

    if (gameOver === "lose") {
      const handleLoss = async () => {
        try {
          const response = await fetch("/api/user/updateExperience", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              experienceGained: -(
                difficulty! *
                selectedFloorLevel! *
                battleConfig.leveldown
              ), // 敗北時に失う経験値（負の値）
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to update user experience");
          }

          alert(
            `敗北しました... 経験値 -${
              difficulty! * selectedFloorLevel! * battleConfig.leveldown
            }`
          );
          setUserHp(battleData?.user.maxHp || 100); // HPをリセット
          setTurnCount(1); // ターン数リセット
          setGameOver(null); // 再挑戦可能に
        } catch (error) {
          console.error("Failed to handle loss:", error);
        }
      };

      handleLoss();
    }
  }, [gameOver, router, battleData, , difficulty, selectedFloorLevel]);

  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  return (
    <div className="flex flex-col h-screen overflow-y-scroll">
      <div className="flex-shrink-0 p-4 text-center bg-gray-200">
        <h2 className="text-xl font-semibold">フロア: {selectedFloorLevel}</h2>
        <p>
          ボス {currentBossIndex + 1} / {battleData?.bosses.length}
        </p>
      </div>
      {/* 上画面: ユーザー */}
      <div className="flex-grow p-4 bg-blue-100  text-center">
        <h1 className="text-2xl font-bold">あなた</h1>
        <p>HP: {userHp}</p>

        {/* 自分のターン */}
        {!isAnswering && !gameOver && remainingBossTurns > 0 && (
          <div className="flex justify-center space-x-4">
            <button
              className="px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => handleAction("attack")}
            >
              攻撃
            </button>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded"
              onClick={() => handleAction("heal")}
            >
              回復
            </button>
          </div>
        )}

        {/* クイズ表示 */}
        {currentQuestion && currentQuiz && (
          <div className="mt-4 flex flex-col gap-4">
            {/* 画像表示オプション */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showImage}
                onChange={(e) => setShowImage(e.target.checked)}
              />
              画像を表示する
            </label>

            {/* クイズ内容表示 */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* クイズ画像 */}
              {showImage && currentQuiz.imagePath && (
                <div className="flex-shrink-0 md:w-1/2 overflow-auto">
                  <Image
                    src={currentQuiz.imagePath}
                    alt="クイズ画像"
                    width={500}
                    height={300}
                    className="rounded object-contain max-w-full h-auto"
                  />
                </div>
              )}

              {/* クイズの質問と選択肢 */}
              <div
                className={`w-full ${
                  showImage ? "md:w-1/2" : "md:w-full"
                } max-h-[300px] overflow-y-auto p-4 bg-white rounded shadow`}
              >
                {/* クイズの質問 */}
                <p className="text-lg font-bold mb-4">{currentQuestion.text}</p>

                {/* 選択肢 */}
                <div className="space-y-2">
                  {shuffleArray(currentQuestion.options).map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(option.isCorrect)}
                      className="block w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 正解と解説を表示 */}
        {lastFeedback && lastAnsweredQuestion && (
          <div className="mt-4 p-4 bg-gray-100 rounded shadow">
            <h3 className="font-bold mb-2">正解と解説</h3>
            {/* 正解の内容 */}
            <p className="text-green-600 font-semibold">
              <strong>正解:</strong>{" "}
              {lastAnsweredQuestion?.options.find((o) => o.isCorrect)?.text ||
                "不明"}
            </p>
            {/* 解説の内容 */}
            <p className="mt-2">{lastFeedback}</p>
            {/* クイズ画像 */}
            {currentQuiz?.imagePath && (
              <div className="flex-shrink-0 md:w-1/2 overflow-auto">
                <Image
                  src={currentQuiz.imagePath}
                  alt="クイズ画像"
                  width={500}
                  height={300}
                  style={{ width: "auto", height: "auto" }} // 比率維持のために設定
                  className="rounded"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ゲーム終了メッセージ */}
      {gameOver && (
        <div className="p-4 text-center">
          {gameOver === "win" ? (
            <h2 className="text-2xl font-bold text-green-600">
              勝利しました！
            </h2>
          ) : (
            <h2 className="text-2xl font-bold text-red-600">敗北しました...</h2>
          )}
        </div>
      )}

      {/* ターン数 */}
      <div className="flex-shrink-0 p-4 text-center bg-gray-100">
        <h2 className="text-xl font-semibold">ターン数: {turnCount}</h2>
      </div>

      {/* 下画面: ボス */}
      {boss && (
        <div className="flex-shrink-0 p-4 bg-red-100 text-center">
          <h1 className="text-2xl font-bold mb-4">{boss.name}</h1>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {/* ボスの画像 */}
            <div className="flex-shrink-0">
              <Image
                src={boss.imageUrl}
                alt={boss.name}
                width={500} // サイズ調整
                height={300} // サイズ調整
                className="rounded object-contain max-w-[200px] max-h-[200px]"
              />
            </div>
            {/* ボスのステータス */}
            <div className="text-left">
              <p className="text-lg font-semibold">HP: {bossHp}</p>
              <p className="text-lg font-semibold">
                攻撃力: {boss.attackPower}
              </p>
              <p className="text-lg font-semibold">
                攻撃ターン数: {boss.attackTurn}
              </p>
              <p className="text-lg font-semibold">
                次の攻撃まで: {remainingBossTurns} ターン
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
