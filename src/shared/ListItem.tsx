import * as React from 'react'
import styled from 'styled-components'

import { DEFAULT_FONT, GREY_90, TEAL_70, GREY_30, TEAL_30 } from 'shared/theme'

interface ListItemProps {
  children: React.ReactNode,
  selected?: boolean
}

interface ItemProps {
  selected: boolean
}

const Item = styled.div`
  border-bottom: 1px solid ${GREY_90};
  padding: 5px;
  display: flex;
  width: 100%;
  box-sizing: border-box;
  align-items: center;
  background: ${({ selected }: ItemProps) => selected ? TEAL_70 : 'transparent'};
`

export const ItemTitle = styled.button`
  flex-grow: 2;
  flex-basis: 200%;
  outline: none;
  border: 0;
  background: transparent;
  padding: 4px;
  box-sizing: border-box;
  text-align: left;
  color: ${GREY_30}
  cursor: pointer;
  font-size: ${DEFAULT_FONT};
  font-size: 18px;

  &:hover {
    color: ${TEAL_30};
  }
`

export const Actions = styled.div `
  display: flex;
  flex-grow: 0;
`

export default function ListItem ({ children, selected }: ListItemProps) {
  return <Item selected={selected}>{children}</Item>
}
