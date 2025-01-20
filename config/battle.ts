const battleConfig = {
  levelUpMultiplier: 15, // レベルアップに必要な経験値の倍率
  hpIncreasePerLevel: 1, // レベルアップごとのHP増加量
  levelup: 1.3, // 勝利した時に経験値が増える倍率
  leveldown: 1.2, // 敗北した時に経験値が失う倍率
  minExperience: 0, // 経験値の最小値
  iIncreasePerLevel: 2, // レベルアップごとの攻撃力、回復力、HP、maxHP増加量
  levelMilestone: 5, // 特定レベルの間隔を定義
  difficultyIncrementFloor: 10, // 難易度が上がる階層の単位
  damageDivisor: 5, // プレイヤーのダメージ分母
  bossCriticalHitChance: 0.05, // クリティカルヒットの確率
  bossCriticalHitMultiplier: 3, // クリティカルヒット時のダメージ倍率
  playerCriticalHitChance: 0.1, // プレイヤーのクリティカルヒット発動確率 (1/10)
  playerCriticalHitMultiplier: 2, // プレイヤーのクリティカルヒット時のダメージ倍率
  playerSpecialHealChance: 0.125, // 特別回復発動確率 (1/8)
  playerSpecialHealMultiplier: 2, // 特別回復効果の回復倍率
};

export default battleConfig;
