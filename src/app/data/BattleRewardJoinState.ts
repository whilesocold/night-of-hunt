export interface BattleRewardJoinState {
  changed: boolean
  createdAt: number
  equipped: boolean
  exp: number
  health: number
  id: number
  itemId: number
  itemLevel: { id: number, exp: number, dropExp: number }
  join: any
  level: number
  levelMax: number
  lock: { holdCount: number, heldByCurrentThread: boolean, locked: boolean, fair: boolean, queueLength: number }
  name: string
  nextLevel: { id: number, exp: number, dropExp: number }
  nextSharpeningInfo: { level: number, silver: number, gold: number }
  percentLevel: number
  quality: number
  rune: number
  runeDamageNew: number
  runeInfo: any
  school: number
  set: number
  sharpening: number
  sharpeningDamageNew: number
  sharpeningInfo: any
  slotTypeId: number
  typeId: number
  updateAt: number
  userId: number
}