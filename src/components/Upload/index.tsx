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
import { MapData } from 'components/MapEditor/reducers/mapData'
import MapEditor from 'components/MapEditor'
import { UPLOAD_MAP, CHANGE_EDITOR_DATA, ADD_TILESET, RESET_MAP } from 'components/MapEditor/actionTypes'

interface UploadState {
  loading: boolean,
  page?: string
}

interface UploadProps {
  tilesets?: Tileset[],
  editMap?: (fn: (mapData: MapData, background?: React.ReactNode) => void) => void,
  onPageChange?: (page?: string) => void
}

class Upload extends React.Component<UploadProps, UploadState> {
  constructor (props: UploadProps) {
    super(props)
    this.onChangeFile = this.onChangeFile.bind(this)
    this.changeLoading = this.changeLoading.bind(this)
    this.closeEditor = this.closeEditor.bind(this)
    this.createMap = this.createMap.bind(this)
    this.editMap = this.editMap.bind(this)
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

    if (props.editMap) {
      props.editMap(this.editMap)
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

  changePage (page?: string) {
    this.setState({ page })
    this.props.onPageChange(page)
  }

  closeEditor () {
    saveState(null)
    this.changePage(undefined)
  }

  createEmptyMap () {
    mapEditorStore.dispatch({
      type: UPLOAD_MAP,
      data: {}
    })
    this.changePage('mapEditor')
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
    const { tilesets } = this.props
    if (tilesets) {
      tilesets.forEach((tileset) => {
        mapEditorStore.dispatch({
          type: ADD_TILESET,
          data: tileset
        })
      })
    }
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
      } else if (file.name.indexOf('.png') >= 0 || file.name.indexOf('.gif') >= 0) {
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
    this.changePage('mapEditor')
  }

  editMap (mapData: MapData, background?: React.ReactNode) {
    mapEditorStore.dispatch({
      type: RESET_MAP
    })
    mapEditorStore.dispatch({
      type: UPLOAD_MAP,
      data: mapData
    })
    mapEditorStore.dispatch({
      type: CHANGE_EDITOR_DATA,
      data: {
        close: this.closeEditor,
        background
      }
    })
    const { tilesets } = this.props
    tilesets.forEach((t: Tileset) => {
      mapEditorStore.dispatch({
        type: ADD_TILESET,
        data: t
      })
    })
    this.changePage('mapEditor')
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
    this.changePage('tilesetEditor')
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
