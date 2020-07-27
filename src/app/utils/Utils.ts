export class Utils {
  static randomRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  static degToRad(value: number): number {
    return (value * Math.PI) / 180
  }

  static degToRadEuler(euler: any): any {
    const eulerRad = {}

    Object.keys(euler).forEach(key => {
      eulerRad[key] = Utils.degToRad(euler[key])
    })

    return eulerRad
  }

  static percent(value: number, percent: number): number {
    return (value * percent) / 100
  }

  static rangeToPercent(number: number, min: number, max: number): number {
    return (number - min) / (max - min)
  }

  static percentToRange(percent: number, min: number, max: number): number {
    return (max - min) * percent + min
  }

  static remap(value: number, low1: number, high1: number, low2: number, high2: number): number {
    return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1)
  }
}
