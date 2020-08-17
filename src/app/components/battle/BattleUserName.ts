import * as PIXI from 'pixi.js'

export class BattleUserName extends PIXI.Container {
  protected label: PIXI.Text

  constructor(text: string, color: number) {
    super()

    this.label = new PIXI.Text(text, {
      fontFamily: 'Munchkin-fnt',
      fontSize: 16,
      fill: color,
      fontVariant: 'bold'
    })
    this.label.anchor.set(0, 0.5)

    this.addChild(this.label)
  }
}