import * as React from 'react'
import styled from 'styled-components'

import TitleField from './TitleField'
import CloseButton from './CloseButton'
import SaveButton from './SaveButton'
import Tools from './Tools'

export default function Topbar () {
  return (
    <StyledTopbar>
      <TitleWrapper><TitleField /></TitleWrapper>
      <Tools />
      <ButtonsWrapper>
        <SaveButton />
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
  flex-basis: 400px;
  box-sizing: border-box;
  padding-right: 15px;

  > * {
    margin-left: 10px;
  }
`
