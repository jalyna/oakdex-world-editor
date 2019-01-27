import * as React from 'react'
import styled from 'styled-components'

import { DEFAULT_FONT, GREY_30, GREY_70 } from 'shared/theme'

const StyledTextField = styled.input`
  font-family: ${DEFAULT_FONT};
  padding: 5px 10px;
  color: ${GREY_30};
  border: 1px solid ${GREY_70};
  font-size: 16px;
  outline: none;
  margin: 0;
  background: white;
  box-sizing: border-box;
  width: 100%;
`

export default function TextField (props: any) {
  return <StyledTextField {...props} />
}
