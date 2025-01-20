const battleConfig = {
  levelUpMultiplier: 15, // レベルアップに必要な経験値の倍率
  hpIncreasePerLevel: 1, // レベルアップごとのHP増加量
  levelup: 2, // 勝利した時に経験値が増える倍率
  leveldown: 2, // 敗北した時に経験値が失う倍率
  minExperience: 0, // 経験値の最小値
  attackPowerIncreasePerLevel: 1, // レベルアップごとの攻撃力増加量
  healingPowerIncreasePerLevel: 1, // レベルアップごとの回復力増加量
  difficultyIncrementFloor: 10, // 難易度が上がる階層の単位
  damageDivisor: 5, // プレイヤーのダメージ分母
  bossCriticalHitChance: 1 / 20, // クリティカルヒットの確率
  bossCriticalHitMultiplier: 3, // クリティカルヒット時のダメージ倍率
  playerCriticalHitChance: 10, // プレイヤーのクリティカルヒット発動確率 (1/10)
  playerCriticalHitMultiplier: 2, // プレイヤーのクリティカルヒット時のダメージ倍率
  playerSpecialHealChance: 8, // 特別回復発動確率 (1/8)
  playerSpecialHealMultiplier: 2, // 特別回復効果の回復倍率
};

export default battleConfig;
