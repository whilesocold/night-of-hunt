import * as PIXI from 'pixi.js'
import { ResourceManager } from '../../utils/resources/ResourceManager'

export const BattleSkillColor = ['#ffac4b', '#B3E246', '#8fecff']

export class BattleSkill extends PIXI.Container {
  protected skillIcon: PIXI.Sprite

  protected digContainer: PIXI.Container
  protected digBackIcon: PIXI.Sprite
  protected digSchoolIcon: PIXI.Sprite
  protected digDamageLabel: PIXI.Text

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

    this.skillIcon = new PIXI.Sprite(ResourceManager.instance.getTexture('skill_' + skillId + '.png') || PIXI.Texture.WHITE)
    this.skillIcon.anchor.set(0.5)
    //this.skillIcon.position.set(this.skillIcon.width / 2, 0)

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

    this.addChild(this.skillIcon)
    this.addChild(this.digBackIcon)
    this.addChild(this.digContainer)

    this.digContainer.addChild(this.digSchoolIcon)
    this.digContainer.addChild(this.digDamageLabel)

    this.digBackIcon.y = this.skillIcon.height / 2 - 10

    this.digContainer.x = -this.digContainer.width / 2
    this.digContainer.y = this.digBackIcon.y
  }
}