import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import TitleField, { TitleFieldProps } from 'shared/TitleField'
import { UPDATE_MAP } from 'components/MapEditor/actionTypes'

function mapStateToProps ({ mapData }: any) {
  return {
    title: mapData.title
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    onChange: (title: string) => {
      dispatch({
        type: UPDATE_MAP,
        data: { title }
      })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TitleField)
