import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faDownload, faTrash } from '@fortawesome/free-solid-svg-icons'
import { saveAs } from 'file-saver'

import t from 'shared/translate'
import { DEFAULT_FONT, GREY_30, GREY_90, TEAL_70 } from 'shared/theme'
import readImage, { ImageData } from 'shared/readImage'
import Button from 'shared/Button'
import TextField from 'shared/TextField'

import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'
import { UPDATE_TILESET } from 'components/TilesetEditor/actionTypes'
import store from 'components/TilesetEditor/store'

interface UploadState {
  loading: boolean,
  name: string,
  versionInEdit?: string
}

interface UploadProps {
  tileset: Tileset,
  uploadNewTileset: (name: string, imageData: ImageData) => void,
  updateTileset: (name: string, imageData: ImageData) => void,
  deleteVersion: (name: string) => void
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    updateTileset: (name: string, imageData: ImageData) => {
      if (name === 'default') {
        dispatch({
          type: UPDATE_TILESET,
          data: imageData
        })
        return
      }
      const state = store.getState()
      dispatch({
        type: UPDATE_TILESET,
        data: {
          versions: [...(state.tilesetData.versions || [])].map(v => {
            if (v.name !== name) {
              return v
            } else {
              v.imageBase64 = imageData.imageBase64
              return v
            }
          })
        }
      })
    },
    uploadNewTileset: (name: string, imageData: ImageData) => {
      const state = store.getState()
      dispatch({
        type: UPDATE_TILESET,
        data: {
          versions: [...(state.tilesetData.versions || []), {
            name,
            imageBase64: imageData.imageBase64
          }]
        }
      })
    },
    deleteVersion: (name: string) => {
      const state = store.getState()
      dispatch({
        type: UPDATE_TILESET,
        data: {
          versions: [...(state.tilesetData.versions || [])].filter(v => v.name !== name)
        }
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
      name: ''
    }
    this.onChangeNewFile = this.onChangeNewFile.bind(this)
    this.onChangeName = this.onChangeName.bind(this)
    this.reUpload = this.reUpload.bind(this)
    this.onChangeEditFile = this.onChangeEditFile.bind(this)
  }

  render () {
    const versions = [{
      name: 'default',
      imageBase64: this.props.tileset.imageBase64
    }].concat(this.props.tileset.versions || [])
    return (
      <StyledWrapper>
        {versions.map(version => {
          return (<Item key={version.name}>
            <Preview style={{backgroundImage: 'url(' + version.imageBase64 + ')' }} />
            {version.name}
            <Button onClick={this.reUpload.bind(this, version.name)}>
              <FontAwesomeIcon icon={faUpload} />
            </Button>
            <Button onClick={() => saveAs(version.imageBase64, version + '.png')}>
              <FontAwesomeIcon icon={faDownload} />
            </Button>
            <Button onClick={this.props.deleteVersion.bind(this, version.name)} disabled={version.name === 'default'}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
            {this.state.versionInEdit === version.name && <div>
              <FileUpload type='file' onChange={this.onChangeEditFile} />
            </div>}
          </Item>)
        })}
        <br />
        <div>
          <TextField placeholder="Name..." value={this.state.name} onChange={this.onChangeName} />
          <FileUpload disabled={this.state.name === ''} type='file' onChange={this.onChangeNewFile} />
        </div>
      </StyledWrapper>
    )
  }

  onChangeName (e: React.FormEvent<HTMLInputElement>) {
    this.setState({ name: e.currentTarget.value })
  }

  onChangeNewFile (e: React.FormEvent<HTMLInputElement>) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      this.changeLoading(true)
      const file = e.currentTarget.files[0]
      if (file.name.indexOf('.png') >= 0 || file.name.indexOf('.gif') >= 0) {
        readImage(file).then((imageData) => {
          this.uploadNewTileset(imageData)
          this.setState({ name: '' })
        })
        this.changeLoading(false)
      } else {
        this.changeLoading(false)
        alert(t('invalid_format'))
      }
    }
  }

  onChangeEditFile (e: React.FormEvent<HTMLInputElement>) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      this.changeLoading(true)
      const file = e.currentTarget.files[0]
      if (file.name.indexOf('.png') >= 0 || file.name.indexOf('.gif') >= 0) {
        readImage(file).then((imageData) => {
          this.updateTileset(imageData)
          this.setState({ versionInEdit: undefined })
        })
        this.changeLoading(false)
      } else {
        this.changeLoading(false)
        alert(t('invalid_format'))
      }
    }
  }

  reUpload (name: string) {
    if (this.state.versionInEdit === name) {
      this.setState({ versionInEdit: undefined })
      return
    }
    this.setState({ versionInEdit: name })
  }

  uploadNewTileset (imageData: ImageData) {
    if (this.props.tileset.width !== imageData.width || this.props.tileset.height !== imageData.height) {
      alert(t('tileset_too_small'))
      return
    }
    this.props.uploadNewTileset(this.state.name, imageData)
  }

  updateTileset (imageData: ImageData) {
    if (this.props.tileset.width > imageData.width || this.props.tileset.height > imageData.height) {
      alert(t('tileset_too_small'))
      return
    }
    this.props.updateTileset(this.state.versionInEdit, imageData)
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

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${GREY_90};

  > Button {
    width: auto;
  }
`

const Preview = styled.div`
  width: 120px;
  height: 160px;
  image-rendering: pixelated;
  margin-right: 8px;
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
