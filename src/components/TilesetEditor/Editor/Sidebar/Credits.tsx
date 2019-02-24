import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEraser, faPaintBrush, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'

import t from 'shared/translate'
import { DEFAULT_FONT, GREY_50 } from 'shared/theme'
import { TabData } from 'components/TilesetEditor/reducers/tabData'
import { Credit } from 'components/TilesetEditor/reducers/tilesetData'
import Button from 'shared/Button'
import TextField from 'shared/TextField'
import store from 'components/TilesetEditor/store'
import { CHANGE_TAB_DATA, UPDATE_TILESET } from 'components/TilesetEditor/actionTypes'
import ListItem, { ItemTitle, Actions } from 'shared/ListItem'

interface SpecialProps {
  tabData: TabData,
  credits: Credit[],
  onChangeTitle: (e: React.FormEvent) => void,
  onChangeUrl: (e: React.FormEvent) => void,
  onAddCredit: () => void,
  onRemoveCredit: (title: string) => void
}

function mapStateToProps ({ tabData, tilesetData }: any) {
  return {
    tabData,
    credits: tilesetData.credits || []
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    onChangeTitle: (e: React.ChangeEvent) => {
      const target = e.target as HTMLInputElement
      dispatch({
        type: CHANGE_TAB_DATA,
        data: { nextCreditTitle: target.value }
      })
    },
    onChangeUrl: (e: React.ChangeEvent) => {
      const target = e.target as HTMLInputElement
      dispatch({
        type: CHANGE_TAB_DATA,
        data: { nextCreditUrl: target.value }
      })
    },
    onAddCredit: () => {
      const state = store.getState()
      let credits = (state.tilesetData.credits || []).slice()
      credits.push({
        title: state.tabData.nextCreditTitle,
        url: state.tabData.nextCreditUrl === '' ? undefined : state.tabData.nextCreditUrl
      } as Credit)
      dispatch({ type: UPDATE_TILESET, data: { credits } })
      dispatch({
        type: CHANGE_TAB_DATA,
        data: {
          nextCreditTitle: '',
          nextCreditUrl: ''
        }
      })
    },
    onRemoveCredit: (title: string) => {
      const state = store.getState()
      let credits = (state.tilesetData.credits || []).slice().filter((credit: Credit) => {
        return credit.title !== title
      })
      dispatch({ type: UPDATE_TILESET, data: { credits } })
    }
  }
}

function Special ({
  tabData,
  credits,
  onChangeTitle,
  onChangeUrl,
  onAddCredit,
  onRemoveCredit
}: SpecialProps) {
  return (
    <div>
      <SpecialTileList>
        {credits.map((credit: Credit) => {
          return (
            <ListItem key={credit.title}>
              <ItemTitle>
                {credit.title}
                {credit.url && <UrlWrapper>{credit.url}</UrlWrapper>}
              </ItemTitle>
              <Actions>
                <Button onClick={onRemoveCredit.bind(this, credit.title)}><FontAwesomeIcon icon={faTrash} /></Button>
              </Actions>
            </ListItem>
          )
        })}
      </SpecialTileList>
      <Form>
        <InputWrapper>
          <TextField
            onChange={onChangeTitle}
            value={tabData.nextCreditTitle}
            placeholder={t('credit_title_placeholder')} />
          <TextField
            onChange={onChangeUrl}
            value={tabData.nextCreditUrl}
            placeholder={t('credit_url_placeholder')} />
        </InputWrapper>
        <Button onClick={onAddCredit}><FontAwesomeIcon icon={faPlus} /></Button>
      </Form>
      {t('credits_description')}
    </div>
  )
}

const SpecialTileList = styled.div`
  margin-bottom: 30px;
`

const UrlWrapper = styled.div`
  font-size: 12px;
  font-family: ${DEFAULT_FONT};
  margin-top: 2px;
  color: ${GREY_50};
`

const Form = styled.div`
  display: flex;
  margin-bottom: 20px;

  button {
    flex-grow: 0;
    flex-basis: 60px;
  }
`

const InputWrapper = styled.div`
  flex-grow: 1;
  flex-basis: 90%;
  margin-right: 10px;

  input {
    margin-bottom: 3px;
  }
`

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Special)
