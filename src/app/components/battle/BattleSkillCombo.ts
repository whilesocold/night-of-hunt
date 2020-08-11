import * as PIXI from 'pixi.js'
import { gsap, TweenMax } from 'gsap'

import { ResourceManager } from '../../utils/resources/ResourceManager'
import { BattleSkillColor } from './BattleSkill'

export class BattleSkillCombo extends PIXI.Container {
  protected skillIcons: PIXI.Sprite[]
  protected skillContainer: PIXI.Container

  protected digContainer: PIXI.Container
  protected digBackIcon: PIXI.Sprite
  protected digSchoolIcon: PIXI.Sprite
  protected digDamageLabel: PIXI.Text
  protected comboIcon: PIXI.Sprite
  protected delimiterIcon: PIXI.Sprite
  protected glowIcon: PIXI.Sprite

  public skillIds: number[]
  public schoolId: number
  public damage: number
  public index: number

  constructor(skillIds: number[], schoolId: number, damage: number, index: number, now: boolean = false) {
    super()

    const digOffset = 4

    this.skillIds = skillIds
    this.schoolId = schoolId
    this.damage = damage
    this.index = index

    this.skillIcons = []

    this.skillContainer = new PIXI.Container()
    this.addChild(this.skillContainer)

    skillIds.forEach((skillId, i) => {
      const skillIcon = new PIXI.Sprite(ResourceManager.instance.getTexture('skill_' + skillId + '.png') || PIXI.Texture.WHITE)

      skillIcon.anchor.set(0.5)

      if (skillIds.length === 2) {
        if (index === 0) {
          if (i === 0) {
            skillIcon.x = 0

          } else if (i === 1) {
            skillIcon.x = skillIcon.width
          }

        } else {
          if (i === 0) {
            skillIcon.x = -skillIcon.width

          } else if (i === 1) {
            skillIcon.x = 0//skillIcon.width
          }
        }

      } else if (skillIds.length === 3) {
        if (i === 0) {
          skillIcon.x = -skillIcon.width

        } else if (i === 1) {
          skillIcon.x = 0

        } else if (i === 2) {
          skillIcon.x = skillIcon.width
        }
      }

      this.skillIcons.push(skillIcon)
      this.skillContainer.addChild(skillIcon)
    })

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

    this.comboIcon = new PIXI.Sprite(ResourceManager.instance.getTexture('combo.png'))
    this.comboIcon.anchor.set(0.5, 0.5)
    this.comboIcon.alpha = 0

    if (!now) {
      TweenMax.to(this.comboIcon, 0.75, { delay: 0.25, alpha: 1 })

    } else {
      this.comboIcon.alpha = 1
    }

    this.delimiterIcon = new PIXI.Sprite(ResourceManager.instance.getTexture('school_back_' + schoolId + '.png'))
    this.delimiterIcon.anchor.set(0.5, 0.5)

    this.glowIcon = new PIXI.Sprite(ResourceManager.instance.getTexture('school_glow_' + schoolId + '.png'))
    this.glowIcon.anchor.set(0.5, 0.5)

    this.addChildAt(this.delimiterIcon, 0)
    this.addChildAt(this.glowIcon, 0)

    this.addChild(this.digBackIcon)
    this.addChild(this.digContainer)
    this.addChild(this.comboIcon)

    this.digContainer.addChild(this.digSchoolIcon)
    this.digContainer.addChild(this.digDamageLabel)

    this.digBackIcon.x = index === 0 ? this.skillIcons[0].width / 2 : -this.skillIcons[0].width / 2
    this.digBackIcon.y = this.skillIcons[0].height / 2 - 10

    this.digContainer.x = this.digBackIcon.x - this.digContainer.width / 2
    this.digContainer.y = this.digBackIcon.y

    this.delimiterIcon.x = this.digBackIcon.x
    this.comboIcon.x = this.digBackIcon.x
    this.glowIcon.x = this.digBackIcon.x

    this.startGlowAnimation()

    this.on('removed', () => {
      this.stopGlowAnimation()
    })
  }

  public startGlowAnimation(): void {
    TweenMax.to(this.glowIcon.scale, 0.5, { x: 1.15, y: 1.15, repeat: -1, yoyo: true })
  }

  public stopGlowAnimation(): void {
    gsap.killTweensOf(this.glowIcon.scale)
  }

  public async animateShow(time: number = 1): Promise<void> {
    this.skillIcons.forEach(skillIcon => {
      TweenMax.to(skillIcon, time, {})
    })
  }
}