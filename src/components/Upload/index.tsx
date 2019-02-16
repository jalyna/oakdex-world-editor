import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'

import { DEFAULT_FONT, GREY_30, TEAL_70 } from 'shared/theme'
import readImage from 'shared/readImage'
import readJson from 'shared/readJson'

import tilesetEditorStore from 'components/TilesetEditor/store'
import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'
import { UPLOAD_TILESET, CHANGE_TAB_DATA } from 'components/TilesetEditor/actionTypes'
import TilesetEditor from 'components/TilesetEditor'

import mapEditorStore from 'components/MapEditor/store'
import MapEditor from 'components/MapEditor'
import { UPLOAD_MAP, CHANGE_EDITOR_DATA, ADD_TILESET, RESET_MAP } from 'components/MapEditor/actionTypes'

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
    this.closeEditor = this.closeEditor.bind(this)
    this.createMap = this.createMap.bind(this)
  }

  render () {
    if (this.state.page === 'tilesetEditor') {
      return <TilesetEditor />
    } else if (this.state.page === 'mapEditor') {
      return <MapEditor />
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

  closeEditor () {
    this.setState({ page: undefined })
  }

  createMap (tilesetData: Tileset) {
    mapEditorStore.dispatch({
      type: UPLOAD_MAP,
      data: {}
    })
    mapEditorStore.dispatch({
      type: CHANGE_EDITOR_DATA,
      data: {
        close: this.closeEditor
      }
    })
    mapEditorStore.dispatch({
      type: ADD_TILESET,
      data: tilesetData
    })
    this.setState({ page: 'mapEditor' })
  }

  onChangeFile (e: React.FormEvent<HTMLInputElement>) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      this.changeLoading(true)
      const file = e.currentTarget.files[0]
      if (file.name.indexOf('.tileset.json') >= 0) {
        readJson(file).then((json) => {
          this.passDataToTilesetEditor(json)
          this.changeLoading(false)
        })
        this.changeLoading(false)
      } else if (file.name.indexOf('.map.json') >= 0) {
        readJson(file).then((json) => {
          this.passDataToMapEditor(json)
          this.changeLoading(false)
        })
        this.changeLoading(false)
      } else if (file.name.indexOf('.png') >= 0) {
        readImage(file).then((imageData) => {
          this.passDataToTilesetEditor(imageData)
          this.changeLoading(false)
        })
      } else {
        alert('INVALID FORMAT')
      }
    }
  }

  passDataToMapEditor (json: any) {
    const tilesets = json.tilesets
    delete json.tilesets
    mapEditorStore.dispatch({
      type: RESET_MAP
    })
    mapEditorStore.dispatch({
      type: UPLOAD_MAP,
      data: json
    })
    mapEditorStore.dispatch({
      type: CHANGE_EDITOR_DATA,
      data: {
        close: this.closeEditor
      }
    })
    tilesets.forEach((t) => {
      mapEditorStore.dispatch({
        type: ADD_TILESET,
        data: t
      })
    })
    this.setState({ page: 'mapEditor' })
  }

  passDataToTilesetEditor (json: any) {
    tilesetEditorStore.dispatch({
      type: UPLOAD_TILESET,
      data: json
    })
    tilesetEditorStore.dispatch({
      type: CHANGE_TAB_DATA,
      data: {
        close: this.closeEditor,
        createMap: this.createMap
      }
    })
    this.setState({ page: 'tilesetEditor' })
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
