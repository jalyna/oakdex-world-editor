import * as React from 'react'
import styled from 'styled-components'

import { DEFAULT_FONT, GREY_50, GREY_90, GREY_70 } from 'shared/theme'

const StyledButton = styled.button`
  cursor: pointer;
  font-family: ${DEFAULT_FONT};
  font-size: 16px;
  color: ${GREY_50};
  border: 1px solid ${GREY_90};
  padding: 5px 10px;
  outline: none;
  background: white;
  border-radius: 4px;
  box-sizing: border-box;
  width: 100%;

  &:hover {
    border-color: ${GREY_70};
  }
`

export default function Button (props: any) {
  return <StyledButton {...props} />
}
