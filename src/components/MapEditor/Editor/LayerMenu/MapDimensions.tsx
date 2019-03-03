import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { GREY_70, GREY_95 } from 'shared/theme'
import TextField from 'shared/TextField'
import Button from 'shared/Button'

import store from 'components/MapEditor/store'
import resize from 'components/MapEditor/Editor/Content/Resize/resize'

interface MapDimensionsProps {
  width: number,
  height: number,
  onChangeDimensions: (width: number, height: number) => void
}

interface MapDimensionsState {
  newWidth: string,
  newHeight: string,
  formVisible: boolean
}

function mapStateToProps ({ mapData }: any) {
  return {
    width: mapData.width,
    height: mapData.height
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    onChangeDimensions: (width: number, height: number) => {
      const mapData = store.getState().mapData
      resize(dispatch, 'right', (width - mapData.width))
      resize(dispatch, 'bottom', (height - mapData.height))
    }
  }
}

class MapDimensions extends React.Component<MapDimensionsProps, MapDimensionsState> {
  constructor (props: MapDimensionsProps) {
    super(props)
    this.state = {
      newWidth: props.width.toString(),
      newHeight: props.height.toString(),
      formVisible: false
    }
    this.onToggleForm = this.onToggleForm.bind(this)
    this.onChangeDimensions = this.onChangeDimensions.bind(this)
    this.onChangeWidth = this.onChangeWidth.bind(this)
    this.onChangeHeight = this.onChangeHeight.bind(this)
  }

  render () {
    const { width, height } = this.props
    const { formVisible, newHeight, newWidth } = this.state

    if (formVisible) {
      return (
        <FormWrapper>
          <TextField onChange={this.onChangeWidth} value={newWidth} type="number" step="1" min="1" max="400" />
          &nbsp;x&nbsp;
          <TextField onChange={this.onChangeHeight} value={newHeight} type="number" step="1" min="1" max="400" />
          <Button onClick={this.onChangeDimensions}>OK</Button>
        </FormWrapper>
      )
    }

    return (
      <Wrapper onClick={this.onToggleForm}>
        {width} x {height}
      </Wrapper>
    )
  }

  onToggleForm () {
    this.setState({ formVisible: !this.state.formVisible })
  }

  onChangeDimensions () {
    this.props.onChangeDimensions(parseInt(this.state.newWidth), parseInt(this.state.newHeight))
    this.onToggleForm()
  }

  onChangeWidth (e: React.FormEvent<HTMLInputElement>) {
    this.setState({ newWidth: (e.target as HTMLInputElement).value })
  }

  onChangeHeight (e: React.FormEvent<HTMLInputElement>) {
    this.setState({ newHeight: (e.target as HTMLInputElement).value })
  }
}

const Wrapper = styled.div`
  margin-bottom: 5px;
  font-weight: bold;
  border-bottom: 1px solid ${GREY_70};
  background: ${GREY_95};
  padding: 5px;
  cursor: pointer;
`

const FormWrapper = styled(Wrapper)`
  cursor: default;
  display: flex;

  > input, buttom {
    margin: 0 2px;
  }
`

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapDimensions)
