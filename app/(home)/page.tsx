import Link from "next/link";

export default function IndexPage() {
  return (
    <>
      <section className="pt-6 md:pt-10 lg:py-32 pb-8 md:pb-12">
        <div className="container mx-auto text-center flex flex-col gap-4 items-center max-w-[64rem]">
          <h1 className="font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            サイバー大学「勉強部屋」
          </h1>
          <p className="max-w-[42rem] text-muted-foreground sm:text-xl sm:leading-8 leading-normal">
            Cyber
            Universityの勉強部屋は、AIを活用したクイズ生成機能など、豊富な学習サポート機能で学びを深められるオンライン学習プラットフォームです。
          </p>
          <div className="space-x-4">
            <Link
              href="/start"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium text-lg"
            >
              はじめる
            </Link>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="container mx-auto bg-slate-50 py-8 md:py-12 lg:py-24 space-y-6"
      >
        <div className="mx-auto flex flex-col items-center space-y-4 text-center max-w-[58rem]">
          <h2 className="font-extrabold text-3xl sm:text-3xl md:text-6xl">
            サービスの特徴
          </h2>
          <p className="max-w-[85%] text-muted-foreground sm:text-lg sm:leading-7">
            AIによる自動クイズ生成、タイムアタックモード、バッジ獲得など、多彩な学習サポート機能で学びを楽しく続けられるWebアプリケーションです。
          </p>
        </div>

        <div className="mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:max-w-[64rem]">
          <div className="bg-background border p-2 rounded-lg">
            <div className="flex flex-col justify-between p-6 h-[180px]">
              <h3 className="font-bold">AIクイズ生成</h3>
              <p className="text-sm text-muted-foreground">
                画像やテキストをアップロードするだけで、AIが自動的に問題を生成します。
              </p>
            </div>
          </div>
          <div className="bg-background border p-2 rounded-lg">
            <div className="flex flex-col justify-between p-6 h-[180px]">
              <h3 className="font-bold">ランキングシステム</h3>
              <p className="text-sm text-muted-foreground">
                学習成果を競えるランキング機能でモチベーションを高めましょう。
              </p>
            </div>
          </div>
          <div className="bg-background border p-2 rounded-lg">
            <div className="flex flex-col justify-between p-6 h-[180px]">
              <h3 className="font-bold">進捗管理</h3>
              <p className="text-sm text-muted-foreground">
                グラフで進捗を可視化し、学習の成長を感じられます。
              </p>
            </div>
          </div>
          <div className="bg-background border p-2 rounded-lg">
            <div className="flex flex-col justify-between p-6 h-[180px]">
              <h3 className="font-bold">難易度自動調整</h3>
              <p className="text-sm text-muted-foreground">
                AIが解答傾向に基づいて適切な難易度を自動調整します。
              </p>
            </div>
          </div>
          <div className="bg-background border p-2 rounded-lg">
            <div className="flex flex-col justify-between p-6 h-[180px]">
              <h3 className="font-bold">バッジと称号</h3>
              <p className="text-sm text-muted-foreground">
                学習成果に応じたバッジや称号が獲得でき、成長の実感を得られます。
              </p>
            </div>
          </div>
          <div className="bg-background border p-2 rounded-lg">
            <div className="flex flex-col justify-between p-6 h-[180px]">
              <h3 className="font-bold">ソーシャルシェア</h3>
              <p className="text-sm text-muted-foreground">
                学習結果をSNSでシェアし、友達と学びを共有しましょう。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="container mx-auto py-8 md:py-12 lg:py-24"
      >
        <div className="max-w-[58rem] mx-auto text-center flex flex-col items-center gap-4">
          <h2 className="font-extrabold text-3xl sm:text-3xl md:text-6xl">
            お問い合わせ
          </h2>
          <p className="max-w-[85%] text-muted-foreground sm:text-lg sm:leading-7">
            サービスや機能についてのご質問やご要望は、お気軽にお問い合わせください。
          </p>
          <Link href="/contact" className="underline underline-offset-4">
            お問い合わせフォーム
          </Link>
        </div>
      </section>
    </>
  );
}
