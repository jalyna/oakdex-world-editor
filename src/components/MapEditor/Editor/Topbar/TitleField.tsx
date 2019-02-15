import * as React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { MapData } from 'components/MapEditor/reducers/mapData'
import TextField from 'shared/TextField'
import Button from 'shared/Button'

import { DEFAULT_FONT, GREY_30 } from 'shared/theme'
import { UPDATE_MAP } from 'components/MapEditor/actionTypes'

const Wrapper = styled.div`
  font-family: ${DEFAULT_FONT};
  color: ${GREY_30};
  font-size: 18px;
  cursor: pointer;
`

const TextFieldWrapper = styled.div`
  float: left;
  width: 80%;
  padding-right: 20px;
  box-sizing: border-box;
`

const ButtonWrapper = styled.div`
  float: left;
  width: 20%;
`

interface TitleFieldProps {
  mapData: MapData,
  onChange: (e: React.FormEvent<HTMLInputElement>) => void
}

interface TitleFieldState {
  isEditing: boolean
}

function mapStateToProps ({ mapData }: any) {
  return {
    mapData
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    onChange: (e: React.FormEvent<HTMLInputElement>) => {
      dispatch({
        type: UPDATE_MAP,
        data: {
          title: e.currentTarget.value
        }
      })
    }
  }
}

class TitleField extends React.Component<TitleFieldProps, TitleFieldState> {
  constructor (props: TitleFieldProps) {
    super(props)
    this.state = {
      isEditing: false
    }
    this.onChange = this.onChange.bind(this)
    this.onClick = this.onClick.bind(this)
  }

  render () {
    if (this.state.isEditing) {
      return (
        <div>
          <TextFieldWrapper>
            <TextField
              value={this.props.mapData.title}
              onChange={this.onChange} />
          </TextFieldWrapper>
          <ButtonWrapper>
            <Button onClick={this.onClick}>
              OK
            </Button>
          </ButtonWrapper>
        </div>
      )
    }

    return (
      <Wrapper onClick={this.onClick}>
        {this.props.mapData.title}
      </Wrapper>
    )
  }

  onChange (e: React.FormEvent<HTMLInputElement>) {
    this.props.onChange(e)
  }

  onClick (e: React.MouseEvent) {
    e.preventDefault()
    this.setState({ isEditing: !this.state.isEditing })
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TitleField)
