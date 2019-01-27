import * as React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { Tileset } from '../reducers/tilesetData'

import TopBar from './TopBar'

interface EditorProps {
  tilesetData: Tileset
}

function mapStateToProps ({ tilesetData }: any) {
  return {
    tilesetData
  }
}

function Editor ({ tilesetData }: EditorProps) {
  return <div><TopBar /></div>
}

export default connect(
  mapStateToProps,
  (d: Dispatch) => { return {} },
)(Editor)
