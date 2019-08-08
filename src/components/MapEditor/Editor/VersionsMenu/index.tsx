import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'

import t from 'shared/translate'
import { DEFAULT_FONT, GREY_50, GREY_90, GREY_70, TEAL_30 } from 'shared/theme'
import Button from 'shared/Button'
import TextField from 'shared/TextField'
import ListItem, { ItemTitle, Actions } from 'shared/ListItem'

import { MapData } from 'components/MapEditor/reducers/mapData'
import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'
import { CHANGE_EDITOR_DATA, UPDATE_MAP } from 'components/MapEditor/actionTypes'
import store from 'components/MapEditor/store'


interface VersionsMenuState {
  versionTitle: string
}

interface TilesetData {
  tilesetId: string,
  versions: string[]
}

interface VersionsMenuProps {
  versions: MapData['versions'],
  activeVersion: string,
  tilesets: TilesetData[],
  changeActiveVersion: (name: string) => void,
  onAddVersion: (name: string) => void,
  onRemoveVersion: (name: string) => void,
  onChangeVersion: (name: string, tilesetId: string, tilesetVersion: string) => void
}

function mapStateToProps ({ mapData, editorData, tilesets }: any) {
  return {
    versions: mapData.versions,
    activeVersion: editorData.activeVersion,
    tilesets: tilesets.map((tileset: Tileset) => {
      return {
        tilesetId: tileset.title,
        versions: ['default'].concat((tileset.versions || []).map(v => v.name))
      }
    }).filter((t: TilesetData) => t.versions.length > 1)
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    changeActiveVersion: (name: string) => {
      dispatch({
        type: CHANGE_EDITOR_DATA,
        data: {
          activeVersion: name
        }
      })
    },
    onRemoveVersion: (name: string) => {
      const versions = (store.getState().mapData.versions || []).slice().filter((c) => {
        return c.name !== name
      })
      dispatch({
        type: UPDATE_MAP,
        data: { versions }
      })
      dispatch({
        type: CHANGE_EDITOR_DATA,
        data: {
          activeVersion: 'default'
        }
      })
    },
    onAddVersion: (name: string) => {
      const versions = (store.getState().mapData.versions || []).slice()
      versions.push({
        name,
        tilesetVersions: []
      })
      dispatch({
        type: UPDATE_MAP,
        data: { versions }
      })
      dispatch({
        type: CHANGE_EDITOR_DATA,
        data: {
          activeVersion: name
        }
      })
    },
    onChangeVersion: (name: string, tilesetId: string, tilesetVersion: string) => {
      const versions = (store.getState().mapData.versions || []).slice().map(version => {
        if (version.name !== name) {
          return version
        }
        if (version.tilesetVersions.some(v => v.tilesetId === tilesetId)) {
          version.tilesetVersions = version.tilesetVersions.slice().map(tv => {
            if (tv.tilesetId === tilesetId) {
              tv.versionId = tilesetVersion
            }
            return tv
          })
        } else {
          version.tilesetVersions.push({
            tilesetId,
            versionId: tilesetVersion
          })
        }
        return version
      })
      dispatch({
        type: UPDATE_MAP,
        data: { versions }
      })
    }
  }
}

class VersionsMenu extends React.Component<VersionsMenuProps, VersionsMenuState> {
  constructor (props: VersionsMenuProps) {
    super(props)
    this.state = {
      versionTitle: ''
    }

    this.changeTitle = this.changeTitle.bind(this)
    this.addItem = this.addItem.bind(this)
  }

  render () {
    const versions = [{
      name: 'default',
      tilesetVersions: []
    }].concat(this.props.versions || [])
    return (<StyledSidebar>
      {versions.map(version => {
        return (
          <React.Fragment key={version.name}>
            <ListItem selected={this.props.activeVersion === version.name}>
              <ItemTitle onClick={this.props.changeActiveVersion.bind(this, version.name)}>{version.name}</ItemTitle>
              <Actions>
                {version.name !== 'default' &&<Button onClick={this.props.onRemoveVersion.bind(this, version.name)}>
                  <FontAwesomeIcon icon={faTrash} />
                </Button>}
              </Actions>
            </ListItem>
            {version.name !== 'default' && this.props.activeVersion === version.name && <TilesetSelects>
              {this.props.tilesets.map(tileset => {
                const versionTileset = version.tilesetVersions.find(v => v.tilesetId === tileset.tilesetId)
                return <TilesetWrapper key={tileset.tilesetId}>
                  {tileset.tilesetId}&nbsp;
                  <select value={versionTileset ? versionTileset.versionId : 'default'}
                    onChange={this.onChangeVersion.bind(this, version.name, tileset.tilesetId)}>
                    {tileset.versions.map(v => {
                      return <option key={v} value={v}>{v}</option>
                    })}
                  </select>
                </TilesetWrapper>
              })}
            </TilesetSelects>}
          </React.Fragment>
        )
      })}

      <br />
      <Form>
        <TextField value={this.state.versionTitle} placeholder="New version..." onChange={this.changeTitle} />
        <Button onClick={this.addItem}><FontAwesomeIcon icon={faPlus} /></Button>
      </Form>
    </StyledSidebar>)
  }

  changeTitle (e: React.ChangeEvent) {
    const target = e.target as HTMLInputElement
    this.setState({ versionTitle: target.value })
  }

  addItem () {
    this.props.onAddVersion(this.state.versionTitle)
    this.setState({ versionTitle: '' })
  }

  onChangeVersion (versionName: string, tilesetId: string, e: React.ChangeEvent) {
    const target = e.target as HTMLSelectElement
    this.props.onChangeVersion(versionName, tilesetId, target.value)
  }
}

const Form = styled.div`
  display: flex;
`

const TilesetSelects = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const TilesetWrapper = styled.div`
  padding: 8px;
`

const StyledSidebar = styled.div`
  box-sizing: border-box;
  padding: 15px;
`

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VersionsMenu)
