import * as PIXI from 'pixi.js'
import { gsap, TweenMax } from 'gsap'

import { BattleSkillCombo } from './BattleSkillCombo'
import { ResourceManager } from '../../utils/resources/ResourceManager'

export class BattleSkillSuperCombo extends BattleSkillCombo {
  protected delimiterSecondIcon: PIXI.Sprite

  constructor(skillIds: number[], schoolId: number, damage: number, index: number, now: boolean = false) {
    super(skillIds, schoolId, damage, index, now)

    this.comboIcon.texture = ResourceManager.instance.getTexture('super_combo.png')
    this.comboIcon.anchor.set(0.5, 0.5)
    this.comboIcon.alpha = 0

    if (!now) {
      gsap.killTweensOf(this.comboIcon)
      TweenMax.to(this.comboIcon, 0.75, { delay: 0.5, alpha: 1 })

    } else {
      this.comboIcon.alpha = 1
    }

    this.delimiterSecondIcon = new PIXI.Sprite(ResourceManager.instance.getTexture('school_back_' + schoolId + '.png'))
    this.delimiterSecondIcon.anchor.set(0.5, 0.5)

    this.addChildAt(this.delimiterSecondIcon, 1)

    this.digBackIcon.x = 0
    this.digContainer.x = this.digBackIcon.x - this.digContainer.width / 2

    this.delimiterIcon.x = -this.skillIcons[0].width / 2 + 2
    this.delimiterSecondIcon.x = this.skillIcons[0].width / 2 - 2

    this.comboIcon.x = this.digBackIcon.x
    this.glowIcon.x = this.digBackIcon.x
  }
}