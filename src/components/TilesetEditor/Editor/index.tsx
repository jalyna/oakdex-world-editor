import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { Tileset } from '../reducers/tilesetData'

interface EditorProps {
  tilesetData: Tileset
}

function mapStateToProps ({ tilesetData }: any) {
  return {
    tilesetData
  }
}

function Editor ({ tilesetData }: EditorProps) {
  return <div>EDITOR {tilesetData.title}</div>
}

export default connect(
  mapStateToProps,
  (d: Dispatch) => { return {} },
)(Editor)
