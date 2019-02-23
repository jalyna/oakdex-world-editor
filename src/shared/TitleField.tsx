import * as React from 'react'
import styled from 'styled-components'

import TextField from 'shared/TextField'
import Button from 'shared/Button'
import { DEFAULT_FONT, GREY_30 } from 'shared/theme'

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
  title: string,
  onChange: (newTitle: string) => void
}

interface TitleFieldState {
  isEditing: boolean
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
              value={this.props.title}
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
        {this.props.title}
      </Wrapper>
    )
  }

  onChange (e: React.FormEvent<HTMLInputElement>) {
    this.props.onChange((e.target as HTMLInputElement).value)
  }

  onClick (e: React.MouseEvent) {
    e.preventDefault()
    this.setState({ isEditing: !this.state.isEditing })
  }
}

export default TitleField
