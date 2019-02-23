import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { GREY_70, GREY_95 } from 'shared/theme'

interface MapDimensionsProps {
  width: number,
  height: number
}

function mapStateToProps ({ mapData }: any) {
  return {
    width: mapData.width,
    height: mapData.height
  }
}

function MapDimensions ({ width, height }: MapDimensionsProps) {
  return (
    <Wrapper>
      {width} x {height}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  margin-bottom: 5px;
  font-weight: bold;
  border-bottom: 1px solid ${GREY_70};
  background: ${GREY_95};
  padding: 5px;
`

export default connect(
  mapStateToProps
)(MapDimensions)
