import _ from 'underscore'

export class Utils {
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

  static remap(
    value: number,
    low1: number,
    high1: number,
    low2: number,
    high2: number,
  ): number {
    return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1)
  }

  static formatCurrency(num: string | number, precision = 1): string {
    if (isNaN(Number(num))) throw new Error(`formatBalance Error: "${num}" is not a number`)

    num = Number(num)

    // fix .toFixed
    // https://stackoverflow.com/questions/10808671/javascript-how-to-prevent-tofixed-from-rounding-off-decimal-numbers
    const trueToFixed = (val: number): string => {
      const d = Number('1' + (new Array(precision).fill(0).join('')))
      return (Math.floor(d * val) / d).toFixed(precision)
    }

    const rangesMap = [
      { bit: 0, postfix: '' },
      { bit: 3, postfix: 'K' },
      { bit: 6, postfix: 'M' },
    ].sort((a, b) => b.bit - a.bit)

    const numBit: number = Number(String(Math.round(num)).length - 1)
    const range = rangesMap.find(r => numBit >= Number(r.bit))
    const divider: number = Number('1' + (new Array(range.bit).fill(0).join('')))

    let shortNum = trueToFixed(num / divider)
    if ((Number(shortNum) ^ 0) === Number(shortNum)) {
      shortNum = Number(shortNum).toFixed(0)
    }

    return String(shortNum) + range.postfix
  }

  static deepExtend(obj: any, ...rest): any {
    const parentRE = /#{\s*?_\s*?}/
    let source

    const isAssign = (oProp, sProp) => {
      return (
        _.isUndefined(oProp) ||
        _.isNull(oProp) ||
        _.isFunction(oProp) ||
        _.isNull(sProp) ||
        _.isDate(sProp)
      )
    }

    const procAssign = (oProp, sProp, propName) => {
      return (obj[propName] = _.clone(sProp))
    }

    const hasRegex = (oProp, sProp) => {
      return _.isString(sProp) && parentRE.test(sProp)
    }

    const procRegex = (oProp, sProp, propName) => {
      if (!_.isString(oProp)) {
        throw new Error('Trying to replace with not a string (' + oProp + ')')
      }
      return (obj[propName] = sProp.replace(parentRE, oProp))
    }

    const hasArray = (oProp, sProp) => {
      return _.isArray(oProp) || _.isArray(sProp)
    }

    const procArray = (oProp, sProp, propName) => {
      if (!_.isArray(oProp) || !_.isArray(sProp)) {
        throw new Error(
          'Trying to combine an array with a non-array (' + propName + ')',
        )
      }
      const tmp = Utils.deepExtend(obj[propName], sProp)
      return (obj[propName] = _.reject(tmp, _.isNull))
    }

    const hasObject = (oProp, sProp) => {
      return _.isObject(oProp) || _.isObject(sProp)
    }

    const procObject = (oProp, sProp, propName) => {
      if (!_.isObject(oProp) || !_.isObject(sProp)) {
        throw new Error(
          'Trying to combine an object with a non-object (' + propName + ')',
        )
      }
      return (obj[propName] = Utils.deepExtend(oProp, sProp))
    }

    const procMain = propName => {
      const oProp = obj[propName]
      const sProp = source[propName]

      if (isAssign(oProp, sProp)) {
        procAssign(oProp, sProp, propName)
      } else if (hasRegex(oProp, sProp)) {
        procRegex(oProp, sProp, propName)
      } else if (hasArray(oProp, sProp)) {
        procArray(oProp, sProp, propName)
      } else if (hasObject(oProp, sProp)) {
        procObject(oProp, sProp, propName)
      } else {
        procAssign(oProp, sProp, propName)
      }
    }

    const procAll = src => {
      source = src
      Object.keys(source).forEach(procMain)
    }

    _.each(rest, procAll)

    return obj
  }

  static deepClone(object: any): any {
    const clone = _.clone(object)

    _.each(clone, (value, key) => {
      if (_.isObject(value)) {
        clone[key] = Utils.deepClone(value)
      }
    })

    return clone
  }

  static pick(object, keys) {
    const result = _.pick(object, ...keys)

    _.each(result, (value, key) => {
      if (_.isObject(value)) {
        result[key] = Utils.deepClone(value)
      }
    })

    return result
  }
}
