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

import { MapChar } from 'components/MapEditor/reducers/mapData'
import { UPDATE_MAP } from 'components/MapEditor/actionTypes'

interface UploadState {
  loading: boolean,
  visible: boolean
}

interface UploadProps {
  chars: MapChar[],
  uploadEvents: (events: MapChar[]) => void
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    uploadEvents: (events: MapChar[]) => {
      dispatch({
        type: UPDATE_MAP,
        data: {
          chars: events
        }
      })
    }
  }
}

function mapStateToProps ({ mapData }: any) {
  return {
    chars: mapData.chars || []
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
    this.addEvents = this.addEvents.bind(this)
    this.onShowForm = this.onShowForm.bind(this)
  }

  render () {
    if (!this.state.visible) {
      return (
        <StyledWrapper>
          <Button onClick={this.onShowForm}>
            <FontAwesomeIcon icon={faUpload} />
            &nbsp;
            {t('import_events')}
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
        {t('import_events')}
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
      if (file.name.indexOf('.events.json') >= 0) {
        readJson(file).then((json) => {
          this.addEvents(json)
          this.setState({ visible: false })
        })
        this.changeLoading(false)
      } else {
        this.changeLoading(false)
        alert('INVALID FORMAT')
      }
    }
  }

  addEvents (json: any) {
    const newEvents = json as MapChar[]
    this.props.uploadEvents([...this.props.chars, ...newEvents])
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
