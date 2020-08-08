import * as PIXI from 'pixi.js'

import { BattleSkillCombo } from './BattleSkillCombo'
import { ResourceManager } from '../../utils/resources/ResourceManager'

export class BattleSkillSuperCombo extends BattleSkillCombo {
  protected delimiterSecondIcon: PIXI.Sprite

  constructor(skillIds: number[], schoolId: number, damage: number, index: number) {
    super(skillIds, schoolId, damage, index)

    this.comboIcon.texture = ResourceManager.instance.getTexture('super_combo.png')

    this.delimiterSecondIcon = new PIXI.Sprite(ResourceManager.instance.getTexture('school_back_' + schoolId + '.png'))
    this.delimiterSecondIcon.anchor.set(0.5, 0.5)

    this.addChildAt(this.delimiterSecondIcon, 1)

    this.digBackIcon.x = this.skillIcons[0].width * 1.5
    this.digContainer.x = this.digBackIcon.x - this.digContainer.width / 2

    this.delimiterIcon.x = this.skillIcons[0].width
    this.delimiterSecondIcon.position.set(this.delimiterIcon.x * 2, 0)

    this.comboIcon.x = this.digBackIcon.x
    this.glowIcon.x = this.digBackIcon.x
  }
}