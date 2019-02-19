import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaintBrush, faFillDrip, faPuzzlePiece, faEraser } from '@fortawesome/free-solid-svg-icons'

import Button from 'shared/Button'
import { DEFAULT_FONT, GREY_50, GREY_90, GREY_70, TEAL_30 } from 'shared/theme'
import { CHANGE_EDITOR_DATA } from 'components/MapEditor/actionTypes'

interface ToolsProps {
  tool: string,
  changeTool: (tool: string) => void
}

function mapStateToProps ({ editorData }: any) {
  return {
    tool: editorData.tool
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    changeTool: (tool: string) => {
      dispatch({
        type: CHANGE_EDITOR_DATA,
        data: { tool }
      })
    }
  }
}

function Tools ({ tool, changeTool }: ToolsProps) {
  return (
    <StyledTools>
      <Button isActive={tool === 'default'}
        onClick={changeTool.bind(this, 'default')}>
        <FontAwesomeIcon icon={faPaintBrush} />
      </Button>
      <Button isActive={tool === 'fill'}
        onClick={changeTool.bind(this, 'fill')}>
        <FontAwesomeIcon icon={faFillDrip} />
      </Button>
      <Button isActive={tool === 'auto'}
        onClick={changeTool.bind(this, 'auto')}>
        <FontAwesomeIcon icon={faPuzzlePiece} />
      </Button>
      <Button isActive={tool === 'erase'}
        onClick={changeTool.bind(this, 'erase')}>
        <FontAwesomeIcon icon={faEraser} />
      </Button>
    </StyledTools>
  )
}

const StyledTools = styled.div`
  flex-grow: 0;
  display: flex;
  flex-basis: 300px;
  box-sizing: border-box;
  padding-right: 15px;

  button {
    margin-left: 3px;
  }
`

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Tools)
