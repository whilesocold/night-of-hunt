import { BattleRewardCardState } from './BattleRewardCardState'
import { BattleRewardItemState } from './BattleRewardItemState'
import { BattleRewardUserCardState } from './BattleRewardUserCardState'

export interface BattleRewardState {
  blood: number
  bonusDays: number
  bonusExp: number
  cards: BattleRewardCardState[]
  countJoins: number
  energy: number
  exp: number
  expCards: number
  gold: number
  valor: number
  goldLimit: number
  ingredients: any // TODO
  items: BattleRewardItemState[]
  joins: any // TODO
  lose: boolean
  newCards: BattleRewardCardState[]
  pvpRating: number
  silver: number
  snowflakes: number
  toys: number
  userCards: BattleRewardUserCardState []
  userIngredients: any // TODO
  userItems: any // TODO
}