import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'

import { DEFAULT_FONT, GREY_30, TEAL_70 } from 'shared/theme'
import readImage from 'shared/readImage'
import readJson from 'shared/readJson'

import tilesetEditorStore from 'components/TilesetEditor/store'
import { UPLOAD_TILESET } from 'components/TilesetEditor/actionTypes'
import TilesetEditor from 'components/TilesetEditor'

interface UploadState {
  loading: boolean,
  page?: string
}

class Upload extends React.Component<{}, UploadState> {
  constructor (props: {}) {
    super(props)
    this.state = {
      loading: false
    }
    this.onChangeFile = this.onChangeFile.bind(this)
    this.changeLoading = this.changeLoading.bind(this)
  }

  render () {
    if (this.state.page === 'tilesetEditor') {
      return <TilesetEditor />
    }

    if (this.state.loading) {
      return (
        <StyledWrapper>
          Loading...
        </StyledWrapper>
      )
    }

    return (
      <StyledWrapper>
        <p>Tileset Upload: *.png or *.tileset.json</p>
        <p>Map Upload: *.map.json</p>
        <br />
        <p>Your first time here? Just add a Tileset that is a PNG and start creating
        awesome Maps</p>
        <FileUpload type='file' onChange={this.onChangeFile} />
      </StyledWrapper>
    )
  }

  onChangeFile (e: React.FormEvent<HTMLInputElement>) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      this.changeLoading(true)
      const file = e.currentTarget.files[0]
      if (file.name.indexOf('.json') >= 0) {
        readJson(file).then((json) => {
          tilesetEditorStore.dispatch({
            type: UPLOAD_TILESET,
            data: json
          })
          this.changeLoading(false)
          this.setState({ page: 'tilesetEditor' })
        })
        this.changeLoading(false)
      } else {
        readImage(file).then((imageData) => {
          tilesetEditorStore.dispatch({
            type: UPLOAD_TILESET,
            data: imageData
          })
          this.changeLoading(false)
          this.setState({ page: 'tilesetEditor' })
        })
      }
    }
  }

  changeLoading (value: boolean) {
    this.setState({ loading: value })
  }
}

const StyledWrapper = styled.div`
  font-family: ${DEFAULT_FONT};
  box-sizing: border-box;
  margin: 50px auto;
  padding: 15px;
  max-width: 500px;
  color: ${GREY_30};
  font-size: 16px;
  line-height: 1.66;
`

const FileUpload = styled.input`
  color: ${GREY_30};
  font-family: ${DEFAULT_FONT};
  font-size: 16px;
  margin-top: 25px;
  box-sizing: border-box;
  outline: none;
  background: transparent;
  border: 1px solid ${TEAL_70};
  width: 100%;
  padding: 15px;
`

export default Upload
