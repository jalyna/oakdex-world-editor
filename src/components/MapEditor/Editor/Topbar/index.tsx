import * as React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import useOnClickOutside from 'use-onclickoutside'

import t from 'shared/translate'
import TitleField from './TitleField'
import CloseButton from './CloseButton'
import DemoButton from './DemoButton'
import SaveButton from './SaveButton'
import SaveEvents from './SaveEvents'
import SaveForGameButton from './SaveForGameButton'
import ExportAsPngButton from './ExportAsPngButton'
import Tools from './Tools'
import CurrentCoordinates from './CurrentCoordinates'
import Button from 'shared/Button'

export default function Topbar () {
  const ref = React.useRef(null)
  const [dropdownIsOpen, setDropdownIsOpen] = React.useState(false)
  useOnClickOutside(ref, () => setDropdownIsOpen(false))

  return (
    <StyledTopbar>
      <TitleWrapper><TitleField /></TitleWrapper>
      <CurrentCoordinates />
      <Tools />
      <ButtonsWrapper>
        <DemoButton />
        <DropdownWrapper ref={ref}>
          <Button onClick={() => setDropdownIsOpen(!dropdownIsOpen)}>
            <FontAwesomeIcon icon={faDownload} />
            &nbsp;
            {t('download_dropdown')}
          </Button>
          {dropdownIsOpen && <DropdownContent>
            <SaveButton />
            <SaveEvents />
            <SaveForGameButton />
            <ExportAsPngButton />
          </DropdownContent>}
        </DropdownWrapper>
        <CloseButton />
      </ButtonsWrapper>
    </StyledTopbar>
  )
}

const DropdownWrapper = styled.div`
  position: relative;
  margin-left: 16px;
`

const DropdownContent = styled.div`
  position: fixed;
  top: 60px;
  right: 60px;
  width: 240px;
  z-index: 3;
`

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

  > button {
    margin-left: 10px;
    flex-grow: 0;
    width: auto;
  }
`
