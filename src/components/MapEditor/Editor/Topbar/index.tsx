import * as React from 'react'
import styled from 'styled-components'

import TitleField from './TitleField'
import CloseButton from './CloseButton'
import SaveButton from './SaveButton'
import SaveForGameButton from './SaveForGameButton'
import ExportAsPngButton from './ExportAsPngButton'
import Tools from './Tools'
import CurrentCoordinates from './CurrentCoordinates'

export default function Topbar () {
  return (
    <StyledTopbar>
      <TitleWrapper><TitleField /></TitleWrapper>
      <CurrentCoordinates />
      <Tools />
      <ButtonsWrapper>
        <SaveButton />
        <SaveForGameButton />
        <ExportAsPngButton />
        <CloseButton />
      </ButtonsWrapper>
    </StyledTopbar>
  )
}

const StyledTopbar = styled.div`
  display: flex;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  align-content: stretch;
  box-sizing: border-box;
  padding: 15px 0 15px 15px;
`

const TitleWrapper = styled.div`
  flex-grow: 1;
`

const ButtonsWrapper = styled.div`
  flex-grow: 0;
  display: flex;
  flex-basis: 700px;
  box-sizing: border-box;
  padding-right: 15px;
  justify-content: flex-end;

  > * {
    margin-left: 10px;
    flex-grow: 0;
    width: auto;
  }
`
