import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'

import t from 'shared/translate'
import { DEFAULT_FONT, GREY_30, TEAL_70 } from 'shared/theme'
import readImage, { ImageData } from 'shared/readImage'
import Button from 'shared/Button'

import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'
import { UPDATE_TILESET } from 'components/TilesetEditor/actionTypes'

interface UploadState {
  loading: boolean,
  visible: boolean
}

interface UploadProps {
  tileset: Tileset,
  updateTileset: (imageData: ImageData) => void
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    updateTileset: (imageData: ImageData) => {
      dispatch({
        type: UPDATE_TILESET,
        data: imageData
      })
    }
  }
}

function mapStateToProps ({ tilesetData }: any) {
  return {
    tileset: tilesetData
  }
}

class Upload extends React.Component<UploadProps, UploadState> {
  constructor (props: UploadProps) {
    super(props)
    this.state = {
      loading: false,
      visible: false
    }
    this.onChangeFile = this.onChangeFile.bind(this)
    this.changeLoading = this.changeLoading.bind(this)
    this.updateTileset = this.updateTileset.bind(this)
    this.onShowForm = this.onShowForm.bind(this)
  }

  render () {
    if (!this.state.visible) {
      return (
        <StyledWrapper>
          <Button onClick={this.onShowForm}>
            <FontAwesomeIcon icon={faUpload} />
            &nbsp;
            {t('upload_new_tileset_image')}
          </Button>
        </StyledWrapper>
      )
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
        {t('upload_tileset_image_text')}
        <FileUpload type='file' onChange={this.onChangeFile} />
      </StyledWrapper>
    )
  }

  onShowForm () {
    this.setState({ visible: true })
  }

  onChangeFile (e: React.FormEvent<HTMLInputElement>) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      this.changeLoading(true)
      const file = e.currentTarget.files[0]
      if (file.name.indexOf('.png') >= 0) {
        readImage(file).then((imageData) => {
          this.updateTileset(imageData)
          this.setState({ visible: false })
        })
        this.changeLoading(false)
      } else {
        this.changeLoading(false)
        alert(t('invalid_format'))
      }
    }
  }

  updateTileset (imageData: ImageData) {
    if (this.props.tileset.width > imageData.width || this.props.tileset.height > imageData.height) {
      alert(t('tileset_too_small'))
      return
    }
    this.props.updateTileset(imageData)
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
