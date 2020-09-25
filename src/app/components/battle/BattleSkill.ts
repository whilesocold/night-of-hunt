import * as PIXI from 'pixi.js'
import { TweenMax } from 'gsap'

import { ResourceManager } from '../../utils/resources/ResourceManager'

export const BattleSkillColor = ['#ffac4b', '#B3E246', '#8fecff']

export class BattleSkill extends PIXI.Container {
  protected skillIconMask: PIXI.Sprite
  protected skillIcon: PIXI.Sprite

  protected digContainer: PIXI.Container
  protected digBackIcon: PIXI.Sprite
  protected digSchoolIcon: PIXI.Sprite
  protected digDamageLabel: PIXI.Text

  protected rechargeShape: PIXI.Graphics

  public skillId: number
  public schoolId: number
  public damage: number
  public index: number

  constructor(skillId: number, schoolId: number, damage: number, index: number) {
    super()

    const digOffset = 4

    this.skillId = skillId
    this.schoolId = schoolId
    this.damage = damage
    this.index = index

    this.skillIconMask = new PIXI.Sprite(ResourceManager.instance.getTexture('skill_mask.png') || PIXI.Texture.WHITE)
    this.skillIconMask.anchor.set(0.5)

    this.skillIcon = new PIXI.Sprite(ResourceManager.instance.getTexture('skill_' + skillId + '.png') || PIXI.Texture.WHITE)
    this.skillIcon.anchor.set(0.5)

    this.digContainer = new PIXI.Container()

    this.digBackIcon = new PIXI.Sprite(ResourceManager.instance.getTexture('dig_fight.png'))
    this.digBackIcon.anchor.set(0.5, 0.5)

    this.digSchoolIcon = new PIXI.Sprite(ResourceManager.instance.getTexture('school_' + schoolId + '.png') || PIXI.Texture.WHITE)
    this.digSchoolIcon.anchor.set(0, 0.5)

    this.digDamageLabel = new PIXI.Text(damage.toString(), {
      fontFamily: 'Munchkin-fnt',
      fontSize: 16,
      fill: (schoolId - 1) < BattleSkillColor.length ? BattleSkillColor[schoolId - 1] : '#ffffff',
    })
    this.digDamageLabel.anchor.set(0, 0.5)
    this.digDamageLabel.position.set(this.digSchoolIcon.width + digOffset, 0)

    this.rechargeShape = new PIXI.Graphics()
    this.rechargeShape.mask = this.skillIconMask

    this.addChild(this.skillIcon)
    this.addChild(this.digBackIcon)
    this.addChild(this.digContainer)
    this.addChild(this.rechargeShape)
    this.addChild(this.skillIconMask)

    this.digContainer.addChild(this.digSchoolIcon)
    this.digContainer.addChild(this.digDamageLabel)

    this.digBackIcon.y = this.skillIcon.height / 2 - 10

    this.digContainer.x = -this.digContainer.width / 2
    this.digContainer.y = this.digBackIcon.y
  }

  public startRecharge(): void {
    this.rechargeShape.clear()
    this.rechargeShape.beginFill(0x000000, 0.75)
    this.rechargeShape.drawRect(-this.skillIconMask.width / 2, -this.skillIconMask.height / 2, this.skillIconMask.width, this.skillIconMask.height)
    this.rechargeShape.endFill()
  }

  public async animateRecharge(time: number): Promise<void> {
    const tween = TweenMax.to(this, time, {
      onComplete: () => {

      }, onUpdate: () => {
        this.rechargeShape.clear()
        this.rechargeShape.beginFill(0x000000, 0.75)
        this.rechargeShape.drawRect(-this.skillIconMask.width / 2, -this.skillIconMask.height / 2, this.skillIconMask.width, this.skillIconMask.height * (1 - tween.progress()))
        this.rechargeShape.endFill()
      },
    })
  }
}