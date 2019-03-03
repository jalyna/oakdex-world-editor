import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'

import t from 'shared/translate'

import { DEFAULT_FONT, GREY_30, TEAL_70 } from 'shared/theme'
import readImage from 'shared/readImage'
import readJson from 'shared/readJson'
import Button from 'shared/Button'

import { loadState, saveState } from 'shared/localStorage'
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
    this.onChangeFile = this.onChangeFile.bind(this)
    this.changeLoading = this.changeLoading.bind(this)
    this.closeEditor = this.closeEditor.bind(this)
    this.createMap = this.createMap.bind(this)
    this.createMapWithDefaultTilesets = this.createMapWithDefaultTilesets.bind(this)
    mapEditorStore.dispatch({
      type: CHANGE_EDITOR_DATA,
      data: {
        close: this.closeEditor
      }
    })
    const persistedState = loadState()
    this.state = {
      loading: false,
      page: persistedState && persistedState.mapData ? 'mapEditor' : undefined
    }
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
        <Button onClick={this.createMapWithDefaultTilesets}>
          <FontAwesomeIcon icon={faPlusCircle} />&nbsp;
          {t('create_new_map_tilesets')}
        </Button>
        <br /><br /><br />
        <p>{t('intro')}</p>
        <FileUpload type='file' onChange={this.onChangeFile} />
        <p>{t('accepted_formats')}</p>
      </StyledWrapper>
    )
  }

  closeEditor () {
    saveState(null)
    this.setState({ page: undefined })
  }

  createEmptyMap () {
    mapEditorStore.dispatch({
      type: UPLOAD_MAP,
      data: {}
    })
    this.setState({ page: 'mapEditor' })
  }

  createMap (tilesetData: Tileset) {
    this.createEmptyMap()
    mapEditorStore.dispatch({
      type: ADD_TILESET,
      data: tilesetData
    })
  }

  createMapWithDefaultTilesets () {
    this.createEmptyMap()
    const outdoor = require('../../tilesets/outdoor.tileset.json')
    mapEditorStore.dispatch({
      type: ADD_TILESET,
      data: outdoor
    })
    const architecture = require('../../tilesets/architecture.tileset.json')
    mapEditorStore.dispatch({
      type: ADD_TILESET,
      data: architecture
    })
    const indoor = require('../../tilesets/indoor.tileset.json')
    mapEditorStore.dispatch({
      type: ADD_TILESET,
      data: indoor
    })
    mapEditorStore.dispatch({
      type: CHANGE_EDITOR_DATA,
      data: {
        activeTileset: 'outdoor'
      }
    })
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
        alert(t('invalid_format'))
        this.changeLoading(false)
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
    tilesets.forEach((t: Tileset) => {
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
