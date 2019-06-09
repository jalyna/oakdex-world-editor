import * as React from 'react'
import styled from 'styled-components'

import { WRAPPER_WIDTH, TABLET_MIN_WIDTH, GREY_95, GREY_90, GREY_40 } from './config'

interface ModalProps {
  children: React.ReactNode,
  title: string,
  onClose: () => void
}

const Blackout = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  z-index: 3;
`

const ModalWrapper = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
  width: calc(100% - 32px);
  box-sizing: border-box;
  max-width: ${WRAPPER_WIDTH - 200}px;
  max-height: calc(100% - 32px);
  position: relative;
  display: flex;
  flex-direction: column;

  @media only screen and (min-width: ${TABLET_MIN_WIDTH}px) {
    max-height: calc(100% - 120px);
  }
`

const CloseLink = styled.div`
  button {
    display: block;
    text-decoration: none;
    font-weight: bold;
    padding: 3px 7px;
    border: 1px solid ${GREY_95};
    color: ${GREY_40};
    border-radius: 2px;

    &:hover {
      border-color: ${GREY_90};
    }
  }
`

const ModalHeading = styled.div`
  padding: 16px 16px 15px 16px;
  border-bottom: 1px solid ${GREY_95};
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ModalContent = styled.div`
  overflow-y: auto;
  padding: 16px;
`

const ModalFooter = styled.div`
  border-top: 1px solid ${GREY_95};
  padding: 15px 16px 16px 16px;
`

const Heading = styled.h2`
  font-size: 18px;
  line-height: 24px;
  font-weight: bold;
`

export default function Modal({ title, onClose, children }: ModalProps) {
  return (
    <Blackout>
      <ModalWrapper>
        <ModalHeading>
          <Heading>{title}</Heading>
          <CloseLink>
            <button onClick={onClose}>Close</button>
          </CloseLink>
        </ModalHeading>
        <ModalContent className="bootstrap">
          {children}
        </ModalContent>
      </ModalWrapper>
    </Blackout>
  )
}
