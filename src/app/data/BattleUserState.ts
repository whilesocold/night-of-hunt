import { BattleFightDeckState } from './BattleFightDeckState'
import { BattleFightLogState } from './BattleFightLogState'

export interface BattleUserState {
  name: string
  name2: string
  currentHealth: number
  currentHealthPercent: number
  health: number
  health2: number
  fightDeck: BattleFightDeckState[]
  fightLog: BattleFightLogState[]
  lastDamage: number
  lastDamagePercent: number
  lastAction: number
  timeAction: number
}