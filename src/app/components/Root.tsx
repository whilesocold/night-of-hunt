import React, { Component } from 'react'
import { Container } from 'react-pixi-fiber'
import { FightHeader } from './fight/FightHeader'

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
    return <Container x={this.state.width / 2} y={0}>
      <FightHeader/>
    </Container>
  }
}