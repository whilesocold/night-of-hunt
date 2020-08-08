import { BattleUserState } from './BattleUserState'

export interface BattleState {
    enemy: BattleUserState,
    user: BattleUserState,
}