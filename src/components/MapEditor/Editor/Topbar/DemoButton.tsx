import * as React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faTimes } from '@fortawesome/free-solid-svg-icons'
import WorldEngine, { Direction } from 'oakdex-world-engine'

import t from 'shared/translate'
import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'
import { MapData } from 'components/MapEditor/reducers/mapData'
import Button from 'shared/Button'
import TextField from 'shared/TextField'
import downloadJson from 'shared/downloadJson'
import mapToGameMap, { GameMap } from 'shared/mapToGameMap'

import * as charset1 from './charset1.png'

interface DemoButtonProps {
  mapData: MapData,
  tilesets: Tileset[]
}

interface DemoButtonState {
  gameMap?: GameMap,
  x: number,
  y: number
}

function mapStateToProps ({ tilesets, mapData }: any) {
  return {
    tilesets,
    mapData
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {}
}

class DemoButton extends React.Component<DemoButtonProps, DemoButtonState> {
  constructor (props: DemoButtonProps) {
    super(props)
    this.state = {
      x: 0,
      y: 0
    }
    this.onClick = this.onClick.bind(this)
    this.onClose = this.onClose.bind(this)
    this.changeValue = this.changeValue.bind(this)
  }

  private canvas = React.createRef<HTMLCanvasElement>()

  render () {
    return (
      <React.Fragment>
        <Button onClick={this.onClick}>
          <Canvas
            ref={this.canvas}
            width={this.props.mapData.width * 16}
            height={this.props.mapData.height * 16} />
          <FontAwesomeIcon icon={faPlay} />
          &nbsp;
          {t('play_demo')}
        </Button>
        {this.state.gameMap && this.renderGameMap()}
      </React.Fragment>
    )
  }

  changeValue (field: string, e: React.ChangeEvent) {
    const target = e.target as HTMLInputElement
    const gameMap = { ...this.state.gameMap }
    if (field === 'x') {
      this.setState({ x: parseInt(target.value), gameMap: undefined }, () => this.setState({ gameMap }))
    } else if (field === 'y') {
      this.setState({ y: parseInt(target.value), gameMap: undefined }, () => this.setState({ gameMap }))
    }
  }

  renderGameMap () {
    return (
      <Overlay>
        <Wrapper>
          <WorldEngine
            mapData={this.state.gameMap}
            viewport={{ width: 19, height: 15 }}
            chars={[]}
            controllableChar={{
              id: 'heroine',
              name: 'Heroine',
              image: charset1,
              x: this.state.x,
              y: this.state.y
            }}
          />
          <br />
          <Form>
            X: <TextField value={this.state.x} onChange={this.changeValue.bind(this, 'x')} type="number" min={0} max={this.props.mapData.width - 1} step={1} />
            Y: <TextField value={this.state.y} onChange={this.changeValue.bind(this, 'y')} type="number" min={0} max={this.props.mapData.height - 1} step={1} />
          </Form>
          <br />
          <Button onClick={this.onClose}>
            <FontAwesomeIcon icon={faTimes} />
            &nbsp;
            {t('close')}
          </Button>
        </Wrapper>
      </Overlay>
    )
  }

  onClose (e: React.MouseEvent) {
    e.preventDefault()
    this.setState({ gameMap: undefined })
  }

  onClick (e: React.MouseEvent) {
    e.preventDefault()
    if (!this.canvas.current) {
      return
    }
    const { mapData, tilesets } = this.props
    this.setState({
      gameMap: mapToGameMap(this.canvas.current, mapData, tilesets)
    })
  }
}

const Canvas = styled.canvas`
  display: none;
`

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: white;
  box-sizing: border-box;
  z-index: 2;
  padding: 50px;
`

const Form = styled.div`
  display: flex;
`

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > button {
    width: auto;
  }
`

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DemoButton)
