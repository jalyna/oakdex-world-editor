import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'

import { DEFAULT_FONT } from 'shared/theme'
import readImage from 'shared/readImage'

import { UPLOAD_TILESET } from './actionTypes'

const StyledWrapper = styled.div`
  font-family: ${DEFAULT_FONT};
`

interface TilesetUploadProps {
  onChangeFile: (e: React.FormEvent<HTMLInputElement>, fn: (b: boolean) => void) => void
}

interface TilesetUploadState {
  loading: boolean
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    onChangeFile: (e: React.FormEvent<HTMLInputElement>, changeLoading: (b: boolean) => void) => {
      if (e.currentTarget.files && e.currentTarget.files[0]) {
        changeLoading(true)
        const file = e.currentTarget.files[0]
        if (file.name.indexOf('.json') >= 0) {
          alert('JSON is not possible yet')
          changeLoading(false)
        } else {
          readImage(file).then((imageData) => {
            dispatch({
              type: UPLOAD_TILESET,
              data: {
                ...imageData
              }
            })
            changeLoading(false)
          })
        }
      }
    }
  }
}

class TilesetUpload extends React.Component<TilesetUploadProps, TilesetUploadState> {
  constructor (props: TilesetUploadProps) {
    super(props)
    this.state = {
      loading: false
    }
    this.onChangeFile = this.onChangeFile.bind(this)
    this.changeLoading = this.changeLoading.bind(this)
  }

  render () {
    if (this.state.loading) {
      return (
        <StyledWrapper>
          Loading...
        </StyledWrapper>
      )
    }

    return (
      <StyledWrapper>
        <input type='file' onChange={this.onChangeFile} />
      </StyledWrapper>
    )
  }

  onChangeFile (e: React.FormEvent<HTMLInputElement>) {
    this.props.onChangeFile(e, this.changeLoading)
  }

  changeLoading (value: boolean) {
    this.setState({ loading: value })
  }
}

export default connect(
  () => { return {} },
  mapDispatchToProps
)(TilesetUpload)
