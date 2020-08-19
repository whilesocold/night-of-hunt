export interface BattleRewardUserCardState {
  addExp: number
  cardId: number
  changed: boolean
  damage: number
  damageOri: number
  exp: number
  id: number
  image: string
  info: {
    id: number
    damage: number
    school: number
    image: string
    chapter: number
  }
  level: number
  maxLevel: number
  name: string
  newCard: boolean
  nextLevelExp: number
  percentLevel: number
  priceNewLevel: {
    damage: number
    dropExp: number
    exp: number
    gold: number
    id: number
    silver: number
  }
  quality: number
  school: number
  schoolName: string
  userId: number
}