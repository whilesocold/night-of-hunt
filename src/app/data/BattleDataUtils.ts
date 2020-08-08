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

  static getDamage(fightDeck: any, from: number, to: number, countSchool: number) {
    const X2 = 1.5
    const X3 = 2

    let k = 1

    if (countSchool == 2) {
      k = X2

    } else if (countSchool == 3) {
      k = X3
    }

    let damage = 0

    for (let i = 0; i < 3; i++) {
      if (fightDeck.length > i) {
        if (i >= from && i <= to) {
          damage += fightDeck[i].damage * k
        }
      }
    }

    return damage
  }
}