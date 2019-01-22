import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'

import { DEFAULT_FONT } from 'shared/theme'

import { UPLOAD_TILESET } from './actionTypes'

const StyledWrapper = styled.div`
  font-family: ${DEFAULT_FONT};
`

interface TilesetUploadProps {
  onChangeFile: () => void
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    onChangeFile: (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.files && e.currentTarget.files[0]) {
        const file = e.currentTarget.files[0]
        if (file.name.indexOf('.json') >= 0) {
          alert('JSON is not possible yet')
        } else {
          const fr = new FileReader()
          const img = new Image()

          fr.addEventListener('load', (e) => {
            img.src = (fr.result as string)
            img.addEventListener('load', () => {
              console.log('woopwoop', img.naturalWidth, img.naturalHeight)
              dispatch({
                type: UPLOAD_TILESET,
                data: {
                  imageBase64: fr.result as string,
                  width: img.naturalWidth / 16,
                  height: img.naturalHeight / 16
                }
              })
            })
          })

          fr.readAsDataURL(e.currentTarget.files[0])
        }
      }
    }
  }
}

function TilesetUpload ({ onChangeFile }: TilesetUploadProps) {
  return (
    <StyledWrapper>
      <input type='file' onChange={onChangeFile} />
    </StyledWrapper>
  )
}

export default connect(
  () => { return {} },
  mapDispatchToProps
)(TilesetUpload)
