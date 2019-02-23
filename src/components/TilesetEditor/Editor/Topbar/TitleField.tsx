import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import TitleField from 'shared/TitleField'
import { UPDATE_TILESET } from 'components/TilesetEditor/actionTypes'

function mapStateToProps ({ tilesetData }: any) {
  return {
    title: tilesetData.title
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    onChange: (title: string) => {
      dispatch({
        type: UPDATE_TILESET,
        data: { title }
      })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TitleField)
