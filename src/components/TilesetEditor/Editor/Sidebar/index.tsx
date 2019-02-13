import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faObjectUngroup, faWalking, faStar, faPuzzlePiece } from '@fortawesome/free-solid-svg-icons'

import { DEFAULT_FONT, GREY_50, GREY_90, GREY_70, TEAL_30 } from 'shared/theme'
import { CHANGE_TAB } from 'components/TilesetEditor/actionTypes'

import Objects from './Objects'
import Walk from './Walk'
import Auto from './Auto'
import Special from './Special'

interface TabItemProps {
  isActive?: boolean
}

interface TabData {
  [key: string]: {
    component: React.JSXElementConstructor<any>,
    icon: any,
    title: string
  }
}

const TABS: TabData = {
  objects: {
    component: Objects,
    icon: faObjectUngroup,
    title: 'Objects'
  },
  walk: {
    component: Walk,
    icon: faWalking,
    title: 'Walk'
  },
  auto: {
    component: Auto,
    icon: faPuzzlePiece,
    title: 'Auto'
  },
  special: {
    component: Special,
    icon: faStar,
    title: 'Special'
  }
}

interface SidebarProps {
  activeTab: string,
  onTabClick: (tab: string) => void
}

function mapStateToProps ({ activeTab }: any) {
  return {
    activeTab
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    onTabClick: (tab: string) => {
      dispatch({ type: CHANGE_TAB, tab: tab })
    }
  }
}

function Sidebar ({ activeTab, onTabClick }: SidebarProps) {
  const ActiveTab: React.JSXElementConstructor<any> = TABS[activeTab].component
  return (
    <StyledSidebar>
      <TabList>
        {Object.keys(TABS).map((t) => {
          const tabData = TABS[t]
          return (
            <TabItem
              key={t}
              onClick={onTabClick.bind(this, t)}
              isActive={activeTab === t}>
              <FontAwesomeIcon icon={tabData.icon} />
              &nbsp;{tabData.title}
            </TabItem>
          )
        })}
      </TabList>
      <TabContent><ActiveTab /></TabContent>
    </StyledSidebar>
  )
}

const StyledSidebar = styled.div`
  box-sizing: border-box;
  padding: 15px;
`

const TabList = styled.div`
  display: flex;
`

const TabContent = styled.div`
  box-sizing: border-box;
  padding: 15px 0;
`

const TabItem = styled.button`
  cursor: pointer;
  font-family: ${DEFAULT_FONT};
  font-size: 16px;
  color: ${({ isActive }: TabItemProps) => isActive ? TEAL_30 : GREY_50};
  border: 1px solid ${GREY_90};
  padding: 5px 10px;
  outline: none;
  background: white;
  box-sizing: border-box;
  flex-grow: 1;

  &:hover {
    border-color: ${GREY_70};
  }
`

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Sidebar)
