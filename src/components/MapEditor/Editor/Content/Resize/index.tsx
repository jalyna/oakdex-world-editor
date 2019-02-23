import * as React from 'react'
import styled, { StyledComponent } from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight, faCaretDown, faCaretLeft, faCaretUp, IconDefinition } from '@fortawesome/free-solid-svg-icons'

import Button from 'shared/Button'

import resize from './resize'

interface IconMap {
  [key: string]: IconDefinition
}

interface ContainerMap {
  [key: string]: StyledComponent<"div", any>
}

const ICON_MAP = {
  'right_1': faCaretRight,
  'right_-1': faCaretLeft,
  'left_1': faCaretLeft,
  'left_-1': faCaretRight,
  'top_1': faCaretUp,
  'top_-1': faCaretDown,
  'bottom_1': faCaretDown,
  'bottom_-1': faCaretUp
} as IconMap

const ResizeItem = styled.div`
  position: absolute;
  width: 45px;
  box-sizing: border-box;
  padding: 5px;
  display: flex;

  button {
    margin: 0 3px;
  }
`

const ResizeItemX = styled(ResizeItem)`
  flex-direction: column;
  justify-content: center;
  align-items: stretch;

  button {
    margin: 3px 0;
    flex-grow: 1;
  }
`

const ResizeRight = styled(ResizeItemX)`
  top: 0;
  bottom: 0;
  left: 100%;
`

const ResizeLeft = styled(ResizeItemX)`
  top: 0;
  bottom: 0;
  right: 100%;
`

const ResizeTop = styled(ResizeItem)`
  left: 0;
  right: 0;
  width: 100%;
  bottom: 100%;
`

const ResizeBottom = styled(ResizeItem)`
  left: 0;
  right: 0;
  width: 100%;
  top: 100%;
`

const CONTAINER_MAP = {
  right: ResizeRight,
  left: ResizeLeft,
  top: ResizeTop,
  bottom: ResizeBottom
} as ContainerMap

interface ResizeProps {
  changeSize: (direction: string, changeBy: number) => void
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    changeSize: resize.bind(null, dispatch)
  }
}

function renderButton (changeSize: (direction: string, changeBy: number) => void, direction: string, changeBy: number) {
  return (
    <Button onClick={changeSize.bind(this, direction, changeBy)}>
      <FontAwesomeIcon icon={ICON_MAP[[direction, changeBy].join('_')]} />
    </Button>
  )
}

function renderDirection (changeSize: (direction: string, changeBy: number) => void, direction: string) {
  const Container = CONTAINER_MAP[direction]
  return (
    <Container key={direction}>
      {renderButton(changeSize, direction, 1)}
      {renderButton(changeSize, direction, -1)}
    </Container>
  )
}

function Resize ({ changeSize }: ResizeProps) {
  return (
    <React.Fragment>
      {Object.keys(CONTAINER_MAP).map((dir) => {
        return renderDirection(changeSize, dir)
      })}
    </React.Fragment>
  )
}

export default connect(
  () => ({}),
  mapDispatchToProps,
)(Resize)
