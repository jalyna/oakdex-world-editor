import * as React from 'react'
import styled from 'styled-components'

export interface HelloProps { 
  compiler: string
  framework: string
}


// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export default class Hello extends React.Component<HelloProps, {}> {
  render() {
    return <h1><Button>Helloe</Button> from {this.props.compiler} and {this.props.framework}!</h1>
  }
}

const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid palevioletred;
  color: palevioletred;
  margin: 0 1em;
  padding: 0.25em 1em;
`
