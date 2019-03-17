import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaintBrush, faFillDrip, faPuzzlePiece, faEraser, faDice, faUsers } from '@fortawesome/free-solid-svg-icons'

import t from 'shared/translate'
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
        onClick={changeTool.bind(this, 'default')}
        title={t('brush_tool')}>
        <FontAwesomeIcon icon={faPaintBrush} />
      </Button>
      <Button isActive={tool === 'fill'}
        onClick={changeTool.bind(this, 'fill')}
        title={t('fill_tool')}>
        <FontAwesomeIcon icon={faFillDrip} />
      </Button>
      <Button isActive={tool === 'auto'}
        onClick={changeTool.bind(this, 'auto')}
        title={t('auto_tool')}>
        <FontAwesomeIcon icon={faPuzzlePiece} />
      </Button>
      <Button isActive={tool === 'erase'}
        onClick={changeTool.bind(this, 'erase')}
        title={t('erase_tool')}>
        <FontAwesomeIcon icon={faEraser} />
      </Button>
      <Button isActive={tool === 'random'}
        onClick={changeTool.bind(this, 'random')}
        title={t('random_tool')}>
        <FontAwesomeIcon icon={faDice} />
      </Button>
      <Button isActive={tool === 'events'}
        onClick={changeTool.bind(this, 'events')}
        title={t('events_tool')}>
        <FontAwesomeIcon icon={faUsers} />
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
