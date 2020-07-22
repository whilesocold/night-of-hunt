import React, { Component } from 'react'
import { Rectangle } from '../Rectangle'
import { Container } from 'react-pixi-fiber'
import { Utils } from '../../utils/Utils'

import { TweenMax } from 'gsap'

export class BattleHealthbar extends Component<any, any> {
  private progressRef: any
  private tweenObj: any

  constructor(props: any) {
    super(props)

    this.tweenObj = {
      width: undefined,
    }
  }

  render() {
    let { x, y, width, progress } = this.props

    x = x || 0
    y = y || 0

    const progressWidth = Utils.remap(progress, 0, 100, 0, width - 1)

    const content = <Container x={x} y={y}>
      <Rectangle x={1} y={0} width={width} height={8} fill={0x000000} strokeThickness={1} strokeFill={0x423b32}/>
      <Rectangle ref={div => this.progressRef = div}
                 x={1}
                 y={1}
                 width={typeof this.tweenObj.width === 'undefined' ? progressWidth : 0}
                 height={6} fill={0xff0000}/>
    </Container>

    if (typeof this.tweenObj.width === 'undefined') {
      this.tweenObj.width = progressWidth

    } else {
      TweenMax.to(this.tweenObj, 1, {
        width: progressWidth, onUpdate: (e) => {
          this.progressRef['_customApplyProps'](this.progressRef, {}, {
            x: 1, y: 1, width: this.tweenObj.width, height: 6, fill: 0xff0000,
          })
        },
      })
    }

    return content
  }
}