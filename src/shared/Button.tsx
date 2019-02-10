import * as React from 'react'
import styled from 'styled-components'

import { DEFAULT_FONT, GREY_50, GREY_90, GREY_70, TEAL_30 } from 'shared/theme'

interface ButtonProps {
  isActive?: boolean
}

const StyledButton = styled.button`
  cursor: pointer;
  font-family: ${DEFAULT_FONT};
  font-size: 16px;
  color: ${({ isActive }: ButtonProps) => isActive ? 'white' : GREY_50};
  border: 1px solid ${({ isActive }: ButtonProps) => isActive ? TEAL_30 : GREY_90};
  padding: 5px 10px;
  outline: none;
  background: ${({ isActive }: ButtonProps) => isActive ? TEAL_30 : 'white'};
  border-radius: 4px;
  box-sizing: border-box;
  width: 100%;

  &:hover {
    border-color: ${GREY_70};
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`

export default function Button (props: any) {
  const isActive = props.isActive as boolean
  return <StyledButton {...props} />
}
