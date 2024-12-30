"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useQuizContext } from "@/context/quiz_context";

// 型定義
interface Question {
  id: number;
  text: string;
  options: Option[];
  feedback: Feedback;
  imagePath?: string;
}

interface Option {
  id: number;
  text: string;
  isCorrect: boolean;
}

interface Feedback {
  text: string;
}

export default function ChallengeStartPage() {
  const router = useRouter();
  const {
    selectedFolder,
    selectedQuestions,
    selectedMode, // Context からモードを取得
  } = useQuizContext();

  const folderId = selectedFolder?.id || 0;
  const questionCount = selectedQuestions || 0;
  const mode = selectedMode || "normal"; // デフォルト値 "normal"
  // console.log("mode", mode);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<Option[]>([]);
  const [incorrectQuestion, setIncorrectQuestion] = useState<Question | null>(
    null
  );
  const [isFinished, setIsFinished] = useState(false);
  const [showImages, setShowImages] = useState(false); // 画像表示の状態
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!folderId || !questionCount) {
        setError("フォルダIDまたは問題数が指定されていません。");
        return;
      }

      try {
        const response = await fetch(
          `/api/challenge/questions?folderId=${folderId}&limit=${questionCount}`
        );

        if (!response.ok) {
          throw new Error("問題の取得に失敗しました。");
        }

        const data: Question[] = await response.json();

        if (!data || data.length === 0) {
          throw new Error("問題データが存在しません。");
        }

        const shuffledQuestions = shuffleArray(data);
        setQuestions(shuffledQuestions);
        setShuffledOptions(shuffleArray(shuffledQuestions[0].options));
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "データ取得中にエラーが発生しました。"
        );
      }
    };

    fetchQuestions();
  }, [folderId, questionCount]);

  // 配列をランダムにシャッフルする関数
  const shuffleArray = <T,>(array: T[]): T[] =>
    [...array].sort(() => Math.random() - 0.5);

  const currentQuestion = questions[currentIndex];

  const handleOptionSelect = (option: Option) => {
    setSelectedOption(option.id);

    if (!option.isCorrect) {
      setIncorrectQuestion(currentQuestion);
      setIsFinished(true);
    } else {
      handleNext();
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShuffledOptions(shuffleArray(questions[currentIndex + 1].options));
    } else {
      setIsFinished(true);
      handleClearChallenge(); // クリア記録をサーバーに送信
    }
  };

  const handleClearChallenge = async () => {
    try {
      const response = await fetch("/api/challenge/clear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          folderId, // フォルダID
          mode, // クイズのモード (例: "easy", "normal")
          questionCount, // 問題数
        }),
      });

      if (!response.ok) {
        throw new Error(`サーバーエラー: ${response.status}`);
      }

      console.log("クリア記録を送信しました！");
    } catch (error) {
      console.error("クリア記録の送信に失敗しました:", error);
    }
  };

  const handleRegisterIncorrect = async () => {
    if (incorrectQuestion) {
      await fetch("/api/challenge/incorrect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: incorrectQuestion.id }),
      });
    }
    router.push("/dashboard/challenge");
  };

  // 正解の選択肢を取得
  const correctOption = incorrectQuestion?.options.find((opt) => opt.isCorrect);
  const correctIndex =
    correctOption && incorrectQuestion?.options
      ? incorrectQuestion.options.indexOf(correctOption) + 1
      : null;

  if (error) return <p className="text-red-500">{error}</p>;

  if (isFinished) {
    return (
      <div className="text-center p-4">
        <h1 className="text-2xl font-bold mb-4">チャレンジ終了</h1>
        {incorrectQuestion ? (
          <div className="flex flex-col items-center">
            <p className="text-red-600 mb-2">{incorrectQuestion.text}</p>
            {/* 画像表示 */}
            {incorrectQuestion.imagePath ? (
              <Image
                src={incorrectQuestion.imagePath}
                alt="不正解の問題画像"
                width={500}
                height={300}
                className="rounded mb-4"
              />
            ) : (
              <p className="text-gray-400">画像が存在しません。</p>
            )}
            {/* 正解と解説 */}
            <p className="text-green-600 font-semibold mb-2">
              正解は {correctIndex} 番: {correctOption?.text || "データなし"}
            </p>
            <p className="text-gray-700 mb-4">
              解説: {incorrectQuestion.feedback.text}
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleRegisterIncorrect}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                不正解を登録する
              </button>
              <button
                onClick={() => router.push("/dashboard/challenge")}
                className="px-4 py-2 bg-gray-300 text-black rounded"
              >
                登録せずに終了
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p>全問クリアしました！</p>
            <button
              onClick={() => router.back()} // 前の画面に戻る
              className="px-4 py-2 bg-gray-300 text-black rounded mt-4"
            >
              戻る
            </button>
          </div>
        )}
      </div>
    );
  }

  if (!currentQuestion) return <p>問題を読み込み中...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between mb-4">
        {/* 前の画面に戻るボタン */}
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-300 text-black rounded"
        >
          戻る
        </button>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showImages}
            onChange={() => setShowImages((prev) => !prev)}
          />
          <span>画像を表示</span>
        </label>
      </div>

      <h2 className="text-xl font-bold mb-4">{currentQuestion.text}</h2>

      {showImages && currentQuestion.imagePath && (
        <Image
          src={currentQuestion.imagePath}
          alt="質問画像"
          width={500}
          height={300}
          className="rounded mb-4"
        />
      )}

      <ul>
        {shuffledOptions.map((option) => (
          <li
            key={option.id}
            onClick={() => handleOptionSelect(option)}
            className={`p-4 border rounded cursor-pointer ${
              selectedOption === option.id
                ? option.isCorrect
                  ? "bg-green-200"
                  : "bg-red-200"
                : "hover:bg-gray-100"
            }`}
          >
            {option.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Image from "next/image";

// // 型定義
// interface Question {
//   id: number;
//   text: string;
//   options: Option[];
//   feedback: Feedback;
//   imagePath?: string;
// }

// interface Option {
//   id: number;
//   text: string;
//   isCorrect: boolean;
// }

// interface Feedback {
//   text: string;
// }

// export default function ChallengeStartPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const folderId = parseInt(searchParams.get("folderId") || "0");
//   const questionCount = parseInt(searchParams.get("questions") || "0");
//   const mode = searchParams.get("mode") || "normal"; // クエリからモードを取得

//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [selectedOption, setSelectedOption] = useState<number | null>(null);
//   const [shuffledOptions, setShuffledOptions] = useState<Option[]>([]);
//   const [incorrectQuestion, setIncorrectQuestion] = useState<Question | null>(
//     null
//   );
//   const [isFinished, setIsFinished] = useState(false);
//   const [showImages, setShowImages] = useState(false); // 画像表示の状態
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       if (!folderId || !questionCount) {
//         setError("フォルダIDまたは問題数が指定されていません。");
//         return;
//       }

//       try {
//         const response = await fetch(
//           `/api/challenge/questions?folderId=${folderId}&limit=${questionCount}`
//         );

//         if (!response.ok) {
//           throw new Error("問題の取得に失敗しました。");
//         }

//         const data: Question[] = await response.json();

//         if (!data || data.length === 0) {
//           throw new Error("問題データが存在しません。");
//         }

//         const shuffledQuestions = shuffleArray(data);
//         setQuestions(shuffledQuestions);
//         setShuffledOptions(shuffleArray(shuffledQuestions[0].options));
//       } catch (err) {
//         setError(
//           err instanceof Error
//             ? err.message
//             : "データ取得中にエラーが発生しました。"
//         );
//       }
//     };

//     fetchQuestions();
//   }, [folderId, questionCount]);

//   // 配列をランダムにシャッフルする関数
//   const shuffleArray = <T,>(array: T[]): T[] =>
//     [...array].sort(() => Math.random() - 0.5);

//   const currentQuestion = questions[currentIndex];

//   const handleOptionSelect = (option: Option) => {
//     setSelectedOption(option.id);

//     if (!option.isCorrect) {
//       setIncorrectQuestion(currentQuestion);
//       setIsFinished(true);
//     } else {
//       handleNext();
//     }
//   };

//   const handleNext = () => {
//     if (currentIndex + 1 < questions.length) {
//       setCurrentIndex((prev) => prev + 1);
//       setSelectedOption(null);
//       setShuffledOptions(shuffleArray(questions[currentIndex + 1].options));
//     } else {
//       setIsFinished(true);
//       handleClearChallenge(); // クリア記録をサーバーに送信
//     }
//   };

//   const handleClearChallenge = async () => {
//     try {
//       const response = await fetch("/api/challenge/clear", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           folderId, // フォルダID
//           mode, // クイズのモード (例: "easy", "normal")
//           questionCount, // 問題数
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`サーバーエラー: ${response.status}`);
//       }

//       console.log("クリア記録を送信しました！");
//     } catch (error) {
//       console.error("クリア記録の送信に失敗しました:", error);
//     }
//   };

//   const handleRegisterIncorrect = async () => {
//     if (incorrectQuestion) {
//       await fetch("/api/challenge/incorrect", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ questionId: incorrectQuestion.id }),
//       });
//     }
//     router.push("/dashboard/challenge");
//   };

//   // 正解の選択肢を取得
//   const correctOption = incorrectQuestion?.options.find((opt) => opt.isCorrect);
//   const correctIndex =
//     correctOption && incorrectQuestion?.options
//       ? incorrectQuestion.options.indexOf(correctOption) + 1
//       : null;

//   if (error) return <p className="text-red-500">{error}</p>;

//   if (isFinished) {
//     return (
//       <div className="text-center p-4">
//         <h1 className="text-2xl font-bold mb-4">チャレンジ終了</h1>
//         {incorrectQuestion ? (
//           <div className="flex flex-col items-center">
//             <p className="text-red-600 mb-2">{incorrectQuestion.text}</p>
//             {/* 画像表示 */}
//             {incorrectQuestion.imagePath ? (
//               <Image
//                 src={incorrectQuestion.imagePath}
//                 alt="不正解の問題画像"
//                 width={500}
//                 height={300}
//                 className="rounded mb-4"
//               />
//             ) : (
//               <p className="text-gray-400">画像が存在しません。</p>
//             )}
//             {/* 正解と解説 */}
//             <p className="text-green-600 font-semibold mb-2">
//               正解は {correctIndex} 番: {correctOption?.text || "データなし"}
//             </p>
//             <p className="text-gray-700 mb-4">
//               解説: {incorrectQuestion.feedback.text}
//             </p>
//             <div className="flex gap-4">
//               <button
//                 onClick={handleRegisterIncorrect}
//                 className="px-4 py-2 bg-red-500 text-white rounded"
//               >
//                 不正解を登録する
//               </button>
//               <button
//                 onClick={() => router.push("/dashboard/challenge")}
//                 className="px-4 py-2 bg-gray-300 text-black rounded"
//               >
//                 登録せずに終了
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div>
//             <p>全問クリアしました！</p>
//             <button
//               onClick={() => router.back()} // 前の画面に戻る
//               className="px-4 py-2 bg-gray-300 text-black rounded mt-4"
//             >
//               戻る
//             </button>
//           </div>
//         )}
//       </div>
//     );
//   }

//   if (!currentQuestion) return <p>問題を読み込み中...</p>;

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <div className="flex justify-between mb-4">
//         {/* 前の画面に戻るボタン */}
//         <button
//           onClick={() => router.back()}
//           className="px-4 py-2 bg-gray-300 text-black rounded"
//         >
//           戻る
//         </button>
//         <label className="flex items-center space-x-2">
//           <input
//             type="checkbox"
//             checked={showImages}
//             onChange={() => setShowImages((prev) => !prev)}
//           />
//           <span>画像を表示</span>
//         </label>
//       </div>

//       <h2 className="text-xl font-bold mb-4">{currentQuestion.text}</h2>

//       {showImages && currentQuestion.imagePath && (
//         <Image
//           src={currentQuestion.imagePath}
//           alt="質問画像"
//           width={500}
//           height={300}
//           className="rounded mb-4"
//         />
//       )}

//       <ul>
//         {shuffledOptions.map((option) => (
//           <li
//             key={option.id}
//             onClick={() => handleOptionSelect(option)}
//             className={`p-4 border rounded cursor-pointer ${
//               selectedOption === option.id
//                 ? option.isCorrect
//                   ? "bg-green-200"
//                   : "bg-red-200"
//                 : "hover:bg-gray-100"
//             }`}
//           >
//             {option.text}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useQuizContext } from "@/context/quiz_context";
// import Image from "next/image";

// // 型定義
// interface Question {
//   id: number;
//   text: string;
//   options: Option[];
//   feedback: Feedback;
//   imagePath?: string;
// }

// interface Option {
//   id: number;
//   text: string;
//   isCorrect: boolean;
// }

// interface Feedback {
//   text: string;
// }

// export default function ChallengeStartPage() {
//   const router = useRouter();
//   const {
//     selectedFolder,
//     selectedQuestions,
//     selectedMode, // Context からモードを取得
//   } = useQuizContext();

//   const folderId = selectedFolder?.id || 0;
//   const questionCount = selectedQuestions || 0;
//   const mode = selectedMode || "normal"; // デフォルト値 "normal"

//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [selectedOption, setSelectedOption] = useState<number | null>(null);
//   const [shuffledOptions, setShuffledOptions] = useState<Option[]>([]);
//   const [incorrectQuestion, setIncorrectQuestion] = useState<Question | null>(
//     null
//   );
//   const [isFinished, setIsFinished] = useState(false);
//   const [showImages, setShowImages] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       if (!folderId || !questionCount) {
//         setError("フォルダIDまたは問題数が指定されていません。");
//         return;
//       }

//       try {
//         const response = await fetch(
//           `/api/challenge/questions?folderId=${folderId}&limit=${questionCount}`
//         );

//         if (!response.ok) {
//           throw new Error("問題の取得に失敗しました。");
//         }

//         const data: Question[] = await response.json();

//         if (!data || data.length === 0) {
//           throw new Error("問題データが存在しません。");
//         }

//         const shuffledQuestions = shuffleArray(data);
//         setQuestions(shuffledQuestions);
//         setShuffledOptions(shuffleArray(shuffledQuestions[0].options));
//       } catch (err) {
//         setError(
//           err instanceof Error
//             ? err.message
//             : "データ取得中にエラーが発生しました。"
//         );
//       }
//     };

//     fetchQuestions();
//   }, [folderId, questionCount]);

//   const shuffleArray = <T,>(array: T[]): T[] =>
//     [...array].sort(() => Math.random() - 0.5);

//   const currentQuestion = questions[currentIndex];

//   const handleOptionSelect = (option: Option) => {
//     setSelectedOption(option.id);

//     if (!option.isCorrect) {
//       setIncorrectQuestion(currentQuestion);
//       setIsFinished(true);
//     } else {
//       handleNext();
//     }
//   };

//   const handleNext = () => {
//     if (currentIndex + 1 < questions.length) {
//       setCurrentIndex((prev) => prev + 1);
//       setSelectedOption(null);
//       setShuffledOptions(shuffleArray(questions[currentIndex + 1].options));
//     } else {
//       setIsFinished(true);
//       handleClearChallenge();
//     }
//   };

//   const handleClearChallenge = async () => {
//     try {
//       const response = await fetch("/api/challenge/clear", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           folderId,
//           mode, // モードを送信
//           questionCount,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`サーバーエラー: ${response.status}`);
//       }

//       console.log("クリア記録を送信しました！");
//     } catch (error) {
//       console.error("クリア記録の送信に失敗しました:", error);
//     }
//   };

//   const handleRegisterIncorrect = async () => {
//     if (incorrectQuestion) {
//       await fetch("/api/challenge/incorrect", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ questionId: incorrectQuestion.id }),
//       });
//     }
//     router.push("/dashboard/challenge");
//   };

//   const correctOption = incorrectQuestion?.options.find((opt) => opt.isCorrect);
//   const correctIndex =
//     correctOption && incorrectQuestion?.options
//       ? incorrectQuestion.options.indexOf(correctOption) + 1
//       : null;

//   if (error) return <p className="text-red-500">{error}</p>;

//   if (isFinished) {
//     return (
//       <div className="text-center p-4">
//         <h1 className="text-2xl font-bold mb-4">チャレンジ終了</h1>
//         {incorrectQuestion ? (
//           <div className="flex flex-col items-center">
//             <p className="text-red-600 mb-2">{incorrectQuestion.text}</p>
//             {incorrectQuestion.imagePath && (
//               <Image
//                 src={incorrectQuestion.imagePath}
//                 alt="不正解の問題画像"
//                 width={500}
//                 height={300}
//                 className="rounded mb-4"
//               />
//             )}
//             <p className="text-green-600 font-semibold mb-2">
//               正解は {correctIndex} 番: {correctOption?.text || "データなし"}
//             </p>
//             <p className="text-gray-700 mb-4">
//               解説: {incorrectQuestion.feedback.text}
//             </p>
//           </div>
//         ) : (
//           <p>全問クリアしました！</p>
//         )}
//       </div>
//     );
//   }

//   if (!currentQuestion) return <p>問題を読み込み中...</p>;

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h2>{currentQuestion.text}</h2>
//     </div>
//   );
// }
