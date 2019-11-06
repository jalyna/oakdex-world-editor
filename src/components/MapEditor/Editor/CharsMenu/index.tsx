import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faRedo, faEye, faEyeSlash, faBan, faWalking, faCode, faCopy } from '@fortawesome/free-solid-svg-icons'
import Form, { IChangeEvent } from 'react-jsonschema-form'

import t from 'shared/translate'
import { GREY_70 } from 'shared/theme'
import Button from 'shared/Button'
import Modal from 'shared/Modal'
import ListItem, { ItemTitle, Actions } from 'shared/ListItem'
import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'

import { MapChar } from 'components/MapEditor/reducers/mapData'
import { CHANGE_EDITOR_DATA, UPDATE_MAP } from 'components/MapEditor/actionTypes'
import store from 'components/MapEditor/store'
import CharPreview from './CharPreview'
import UploadEvents from './UploadEvents'

import { getEventSchema } from '../../../..'

type EventType = 'onTalk' | 'onWalkOver' | 'onMapEnter'

interface CharsMenuProps {
  chars: MapChar[],
  tilesets: Tileset[],
  onSelectCharset: (id: string) => void,
  onRemoveChar: (id: string) => void,
  onRotateChar: (id: string) => void,
  onChangeVisbility: (id: string) => void,
  onChangeWalk: (id: string) => void,
  onChangeEvent: (id: string, eventType: EventType, event: object) => void,
  selectEvent: (id: string) => void,
  copyEvent: (id: string) => void,
  onRemoveAll: () => void,
  selectedCharset?: string,
  selectedEvent?: string,
  eventToCopy?: string
}

function mapStateToProps ({ mapData, editorData, tilesets }: any) {
  return {
    chars: mapData.chars || [],
    tilesets,
    selectedCharset: editorData.selectedCharset,
    selectedEvent: editorData.selectedEvent,
    eventToCopy: editorData.eventToCopy
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    selectEvent: (id: string) => {
      dispatch({
        type: CHANGE_EDITOR_DATA,
        data: {
          selectedEvent: store.getState().editorData.selectedEvent === id ? undefined : id
        }
      })
    },
    copyEvent: (id: string) => {
      dispatch({
        type: CHANGE_EDITOR_DATA,
        data: {
          eventToCopy: store.getState().editorData.eventToCopy === id ? undefined : id,
          selectedCharset: undefined
        }
      })
    },
    onSelectCharset: (id: string) => {
      dispatch({
        type: CHANGE_EDITOR_DATA,
        data: {
          selectedCharset: store.getState().editorData.selectedCharset === id ? undefined : id,
          eventToCopy: undefined
        }
      })
    },
    onRemoveChar: (id: string) => {
      const chars = (store.getState().mapData.chars || []).slice().filter((c) => {
        return c.id !== id
      })
      dispatch({
        type: CHANGE_EDITOR_DATA,
        data: {
          selectedCharset: undefined,
          eventToCopy: undefined,
          selectedEvent: undefined
        }
      })
      dispatch({
        type: UPDATE_MAP,
        data: { chars }
      })
    },
    onRemoveAll: () => {
      dispatch({
        type: CHANGE_EDITOR_DATA,
        data: {
          selectedCharset: undefined,
          eventToCopy: undefined,
          selectedEvent: undefined
        }
      })
      dispatch({
        type: UPDATE_MAP,
        data: { chars: [] }
      })
    },
    onRotateChar: (id: string) => {
      const chars = (store.getState().mapData.chars || []).slice().map((c) => {
        if (c.id === id) {
          let dir = c.dir + 1
          if (dir >= 5) { dir = 1 }
          return {
            ...c,
            dir
          }
        }
        return c
      })
      dispatch({
        type: UPDATE_MAP,
        data: { chars }
      })
    },
    onChangeEvent: (id: string, eventType: EventType, event: object) => {
      const chars = (store.getState().mapData.chars || []).slice().map((c) => {
        if (c.id === id) {
          let newC = { ...c }
          newC.event = newC.event || {}
          newC.event[eventType] = event
          return {
            ...newC
          }
        }
        return c
      })
      dispatch({
        type: UPDATE_MAP,
        data: { chars }
      })
    },
    onChangeVisbility: (id: string) => {
      const chars = (store.getState().mapData.chars || []).slice().map((c) => {
        if (c.id === id) {
          return {
            ...c,
            hidden: !c.hidden
          }
        }
        return c
      })
      dispatch({
        type: UPDATE_MAP,
        data: { chars }
      })
    },
    onChangeWalk: (id: string) => {
      const chars = (store.getState().mapData.chars || []).slice().map((c) => {
        if (c.id === id) {
          return {
            ...c,
            walkThrough: !c.walkThrough
          }
        }
        return c
      })
      dispatch({
        type: UPDATE_MAP,
        data: { chars }
      })
    }
  }
}

interface CharsMenuState {
  editEvent?: {
    charId: string,
    eventType: EventType
  }
}

class CharsMenu extends React.Component<CharsMenuProps, CharsMenuState> {
  constructor (props: CharsMenuProps) {
    super(props)
    this.onEditEvent = this.onEditEvent.bind(this)
    this.closeEditEvent = this.closeEditEvent.bind(this)
    this.saveEvent = this.saveEvent.bind(this)
    this.state = {}
  }

  render () {
    const {
      chars,
      tilesets,
      selectedCharset,
      onSelectCharset,
      onRemoveChar,
      onRotateChar,
      onChangeVisbility,
      onChangeWalk,
      selectEvent,
      selectedEvent,
      copyEvent,
      eventToCopy,
      onRemoveAll
    } = this.props

    return (
      <StyledSidebar>
        <CharBox>
          {tilesets.map((tileset) => {
            return (tileset.charsets || []).map((charset) => {
              const key = tileset.title + ',' + charset.title
              return <CharPreview
                key={key}
                selected={selectedCharset === key}
                onClick={onSelectCharset.bind(this, key)}
                charset={charset} />
            })
          })}
        </CharBox>
        <ItemList>
          {chars.map((char) => {
            const tileset = tilesets.find((t) => t.title === char.tilesetTitle)
            if (!tileset) { return null }
            const charset = (tileset.charsets || []).find((c) => c.title === char.charsetTitle)
            if (!charset) { return null }

            return (
              <React.Fragment key={char.id}>
                <ListItem selected={selectedEvent === char.id}>
                  <ItemTitle onClick={selectEvent.bind(this, char.id)}>
                    <InnerTitle>
                      <CharPreview charset={charset} />
                      {char.id} | {char.x}, {char.y}
                    </InnerTitle>
                  </ItemTitle>
                  <Actions>
                    <Button onClick={onChangeVisbility.bind(this, char.id)}><FontAwesomeIcon icon={char.hidden ? faEyeSlash : faEye} /></Button>
                    &nbsp;
                    <Button onClick={onChangeWalk.bind(this, char.id)}><FontAwesomeIcon icon={char.walkThrough ? faWalking : faBan} /></Button>
                    &nbsp;
                    <Button onClick={onRotateChar.bind(this, char.id)}><FontAwesomeIcon icon={faRedo} /></Button>
                    &nbsp;
                    <Button onClick={copyEvent.bind(this, char.id)} isActive={eventToCopy === char.id}><FontAwesomeIcon icon={faCopy} /></Button>
                    &nbsp;
                    <Button onClick={onRemoveChar.bind(this, char.id)}><FontAwesomeIcon icon={faTrash} /></Button>
                  </Actions>
                </ListItem>
                {selectedEvent === char.id && <EventActions>
                  <Button secondary={!char.event || !char.event.onTalk} onClick={this.onEditEvent.bind(this, char.id, 'onTalk')}>
                    <FontAwesomeIcon icon={faCode} /> onTalk
                  </Button>
                  <Button secondary={!char.event || !char.event.onWalkOver} onClick={this.onEditEvent.bind(this, char.id, 'onWalkOver')}>
                    <FontAwesomeIcon icon={faCode} /> onWalkOver
                  </Button>
                  <Button secondary={!char.event || !char.event.onMapEnter} onClick={this.onEditEvent.bind(this, char.id, 'onMapEnter')}>
                    <FontAwesomeIcon icon={faCode} /> onMapEnter
                  </Button>
                </EventActions>}
              </React.Fragment>
            )
          })}
        </ItemList>
        <br />
        <Button onClick={onRemoveAll}><FontAwesomeIcon icon={faTrash} />&nbsp; {t('delete_all_events')}</Button>
        <UploadEvents />
        {this.renderEditEvent()}
      </StyledSidebar>
    )
  }

  renderEditEvent () {
    if (!this.state.editEvent) {
      return
    }

    const { charId, eventType } = this.state.editEvent

    const char = (store.getState().mapData.chars || []).slice().find((c) => {
      return c.id === charId
    })

    const schema = getEventSchema()

    return (
      <Modal onClose={this.closeEditEvent} title={charId + ' ' + eventType}>
        <FormWrapper>
          <Form
            schema={schema}
            formData={char.event ? char.event[eventType] || {} : {}}
            onSubmit={this.saveEvent}
            uiSchema={{
              commands: {
                classNames: "command-list"
              }
            }}
           >
             <button className="btn btn-lg btn-primary" type="submit">
               Save
             </button>
          </Form>
        </FormWrapper>
      </Modal>
    )
  }

  saveEvent ({ formData }: IChangeEvent<object>) {
    const { charId, eventType } = this.state.editEvent
    this.props.onChangeEvent(charId, eventType, formData)
    this.setState({ editEvent: undefined })
  }

  onEditEvent (id: string, eventType: EventType) {
    this.setState({
      editEvent: {
        charId: id,
        eventType
      }
    })
  }

  closeEditEvent () {
    this.setState({ editEvent: undefined })
  }
}

const FormWrapper = styled.div`
  .command-list {
    #root_type, label[for="root_type"] {
      display: none;
    }
  }

  #root_commands > .array-item-list > .array-item {
    &::after {
      content: '';
      display: block;
      clear: both;
    }

    padding-top: 16px;

    &:nth-child(odd) {
      background-color: #eee;
    }
  }

  #root_commands > .array-item-list > .array-item > .col-xs-9 > .form-group > .panel-body > .field-object > fieldset > legend {
    display: none;
  }
`

const InnerTitle = styled.div`
  display: flex;
  align-items: center;
`

const ItemList = styled.div`
  margin-bottom: 20px;
`

const CharBox = styled.div`
  height: 150px;
  overflow-y: auto;
  border: 1px solid ${GREY_70};
  padding: 7px;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
`

const StyledSidebar = styled.div`
  box-sizing: border-box;
  padding: 15px;
`

const EventActions = styled.div`
  display: flex;
`

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CharsMenu)
