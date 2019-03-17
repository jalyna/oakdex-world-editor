import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'

import store from 'components/TilesetEditor/store'
import t from 'shared/translate'
import { DEFAULT_FONT, GREY_30, TEAL_70 } from 'shared/theme'
import readImage, { ImageData } from 'shared/readImage'
import Button from 'shared/Button'

import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'
import { UPDATE_TILESET } from 'components/TilesetEditor/actionTypes'

interface UploadState {
  loading: boolean
}

interface UploadProps {
  uploadCharset: (imageData: ImageData) => void
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    uploadCharset: (imageData: ImageData) => {
      const state = store.getState()
      let charsets = (state.tilesetData.charsets || []).slice().filter((c) => {
        c.title !== imageData.title
      })
      charsets.push({
        title: imageData.title,
        imageBase64: imageData.imageBase64
      })
      dispatch({ type: UPDATE_TILESET, data: { charsets } })
    }
  }
}

function mapStateToProps ({ }: any) {
  return {}
}

class Upload extends React.Component<UploadProps, UploadState> {
  constructor (props: UploadProps) {
    super(props)
    this.state = {
      loading: false
    }
    this.onChangeFile = this.onChangeFile.bind(this)
    this.changeLoading = this.changeLoading.bind(this)
    this.uploadCharset = this.uploadCharset.bind(this)
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
        {t('upload_charset_image_text')}
        <FileUpload type='file' onChange={this.onChangeFile} />
      </StyledWrapper>
    )
  }

  onChangeFile (e: React.FormEvent<HTMLInputElement>) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      this.changeLoading(true)
      const file = e.currentTarget.files[0]
      if (file.name.indexOf('.png') >= 0) {
        readImage(file).then((imageData) => {
          this.uploadCharset(imageData)
        })
        this.changeLoading(false)
      } else {
        this.changeLoading(false)
        alert(t('invalid_format'))
      }
    }
  }

  uploadCharset (imageData: ImageData) {
    if (imageData.width !== 6 || imageData.height !== 8) {
      alert(t('charset_wrong_size'))
      return
    }
    this.props.uploadCharset(imageData)
  }

  changeLoading (value: boolean) {
    this.setState({ loading: value })
  }
}

const StyledWrapper = styled.div`
  font-family: ${DEFAULT_FONT};
  box-sizing: border-box;
  margin-top: 20px;
  color: ${GREY_30};
  font-size: 16px;
  line-height: 1.66;
`

const FileUpload = styled.input`
  color: ${GREY_30};
  font-family: ${DEFAULT_FONT};
  font-size: 16px;
  margin-top: 5px;
  box-sizing: border-box;
  outline: none;
  background: transparent;
  border: 1px solid ${TEAL_70};
  width: 100%;
  padding: 15px;
`

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Upload)
