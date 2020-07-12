import React, { Component } from 'react'
import { Container, Sprite } from 'react-pixi-fiber'
import { FightHeader } from './fight/FightHeader'
import { ResourceManager } from '../utils/resources/ResourceManager'

export class Root extends Component<any, any> {
  state = { width: 0, height: 0 }

  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight })
  }

  componentDidMount() {
    this.updateDimensions()

    window.addEventListener('resize', this.updateDimensions)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions)
  }

  render() {
    const { width } = this.props

    const bgTexture = ResourceManager.instance.getTexture('bg.jpg')
    const bossTexture = ResourceManager.instance.getTexture('boss12.png')

    return <Container>
      <Sprite texture={bgTexture}/>
      <Container x={(this.state.width - width) / 2} y={0}>
        <FightHeader bossTexture={bossTexture}/>
      </Container>
    </Container>
  }
}