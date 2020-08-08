export class BattleDataUtils {
  static getCountSchool(fightDeck: any): number {
    return Object.values(BattleDataUtils.getGroups(fightDeck)).length
  }

  static getGroups(fightDeck: any): any {
    const result = {}

    for (let i = 0; i < fightDeck.length; i++) {
      const fightCard = fightDeck[i]
      const schoolKey = 'school' + fightCard.school.toString()

      if (!result[schoolKey]) {
        result[schoolKey] = []
      }

      result[schoolKey].push(fightCard)
    }

    return result
  }

  static getDamage(damages: number[]) {
    const X2 = 1.5
    const X3 = 2

    let damage = 0
    let k = 1

    if (damages.length == 2) {
      k = X2

    } else if (damages.length == 3) {
      k = X3
    }

    for (let i = 0; i < damages.length; i++) {
      damage += damages[i] * k
    }

    return Math.floor(damage)
  }
}