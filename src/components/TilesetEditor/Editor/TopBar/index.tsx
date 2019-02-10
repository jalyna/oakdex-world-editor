import * as React from 'react'
import styled from 'styled-components'

import TitleField from './TitleField'
import SaveButton from './SaveButton'
import CloseButton from './CloseButton'

export default function Topbar () {
  return (
    <StyledTopbar>
      <TitleField />
      <ButtonsWrapper>
        <SaveButton /><CloseButton />
      </ButtonsWrapper>
    </StyledTopbar>
  )
}

const StyledTopbar = styled.div`
  display: flex;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  box-sizing: border-box;
  padding: 15px;
`

const ButtonsWrapper = styled.div`
  flex-grow: 0;
  display: flex;
  flex-basis: 400px;

  > * {
    margin-left: 10px;
  }
`
