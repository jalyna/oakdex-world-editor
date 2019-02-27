import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'

import t from 'shared/translate'
import { DEFAULT_FONT, GREY_30, TEAL_70 } from 'shared/theme'
import readJson from 'shared/readJson'
import Button from 'shared/Button'

import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'
import { MapData } from 'components/MapEditor/reducers/mapData'
import { ADD_TILESET, REMOVE_TILESET } from 'components/MapEditor/actionTypes'

interface UploadState {
  loading: boolean,
  visible: boolean
}

interface UploadProps {
  tilesets: Tileset[],
  addTileset: (tileset: Tileset) => void,
  removeTileset: (tileset: Tileset) => void
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    removeTileset: (tileset: Tileset) => {
      dispatch({
        type: REMOVE_TILESET,
        tilesetTitle: tileset.title
      })
    },
    addTileset: (tileset: Tileset) => {
      dispatch({
        type: ADD_TILESET,
        data: tileset
      })
    }
  }
}

function mapStateToProps ({ mapData, tilesets }: any) {
  return {
    tilesets
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
    this.addToTilesets = this.addToTilesets.bind(this)
    this.onShowForm = this.onShowForm.bind(this)
  }

  render () {
    if (!this.state.visible) {
      return (
        <StyledWrapper>
          <Button onClick={this.onShowForm}>
            <FontAwesomeIcon icon={faUpload} />
            &nbsp;
            {t('upload_another_tileset')}
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
        {t('upload_tileset_text')}
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
      if (file.name.indexOf('.tileset.json') >= 0) {
        readJson(file).then((json) => {
          this.addToTilesets(json)
          this.setState({ visible: false })
        })
        this.changeLoading(false)
      } else {
        this.changeLoading(false)
        alert('INVALID FORMAT')
      }
    }
  }

  addToTilesets (json: any) {
    const tileset = json as Tileset
    const existingTileset = this.props.tilesets.find((t) => t.title === tileset.title)
    if (existingTileset) {
      if (!confirm('Overwrite existing tileset with the same name?')) {
        return
      } else {
        this.props.removeTileset(existingTileset)
      }
    }
    this.props.addTileset(tileset)
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
