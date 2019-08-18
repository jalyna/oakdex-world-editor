import * as React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faTimes } from '@fortawesome/free-solid-svg-icons'
import WorldEngine, { Direction, ActionHandler } from 'oakdex-world-engine'

import t from 'shared/translate'
import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'
import { MapData } from 'components/MapEditor/reducers/mapData'
import Button from 'shared/Button'
import TextField from 'shared/TextField'
import downloadJson from 'shared/downloadJson'
import mapToGameMap, { GameMap } from 'shared/mapToGameMap'
import { getOnDemoEvent } from '../../../..'

const CHARSET = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAACACAMAAADDApyIAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMEYzQUU0Q0JCOURFMDExQUM0NzlGRDJBQkIzMjJERSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2QTEyMUU5QkIzMEExMUU1ODdDMkYyRTlCQ0RGQkIxQyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2QTEyMUU5QUIzMEExMUU1ODdDMkYyRTlCQ0RGQkIxQyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBQjEwNjAwNUE0MDQxMUUwOUI4M0E3NkNEODc5QjNCOCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBQjEwNjAwNkE0MDQxMUUwOUI4M0E3NkNEODc5QjNCOCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pg1CF74AAAAwUExURdCYcHhIMMjY6PjQuMBQgIBAYHhYUDhQmEB4wOhYmPj4+EAoOKi40GBAOAAAAP///0WVCwAAAAAQdFJOU////////////////////wDgI10ZAAAHkUlEQVR42uxa29beJg4Fg48y8vu/bSXANgcJ/5lpM7NWQ5PmQuy9BZ8BCWSuf7iZ3ymA1O7//ydNhFcjwBAQg8qfoAMHGEsU+ghC/m9AcI0dSHhdAKiF0Drx4LMDigQykhkqcyGAcB7UTkBR4cErHjDqYZAEkI37zh1QJkB8PJDtBUMvgOd0m6dTmgMs8bK9ZBAFJupBf8m89AwyvhpAydAK4HmSfadG1lOaJBlf8tcMgsDp/TR5f4oCCr4WKBkkgZ2M0x7NwgBEfPkT1Ay1gDXIOMbzP2isKNDjn6YxPAIBvd9j8x6hE/j0oGEIvUCYb/McJAH48iDAywCtAK9Dc+BMDQ8jrFQSKPEgzCG59TBAwG4dABzoqOHhEKTvfOwBEaC7GQCEhUZeudSstBmRgw/egWQPaDOBEQV4iM7QH4soe3jjnZVHiGgTAxT77fMbGBKgHsRuMO7Mwlq1tweiFZkkMpCA6RaaIQUEf1JHmqNL2M7CjaeewlZ3oXeYGAKz9VPE00xrlT5nmueOIf4whJ/SsWh7CedmZtg90reA4om2hPOgjxwFAes8Tx3hacGg8c4KAkgMB/mIs5+lE209l+NYogv9ABzzM35fZlrIzkpH8sOwKwInnSnrWpirSYaEJ/iunMrrSqfReS6awLpu9Pf08yxGDbBufGRuXvQgboiZomAwjR0XQIX/gpPR2zprHtBvtJCb51rYS4FwmPkahHVw8MeH5tD440TO5gijyG4YG4aAP+kzCB2XD/DCX+K4zzIQuL7C3hTdfvf5X4XvfwT+HwQgtjeb+dX24p+vqdoq7vAeLiXLKAhQOlQf/PUsyHKzI/N0h+dBWLEVgWCu8LeHRgnPA3Z5TEOAnbnC3x7WAtyFO8R0qdk3vhxQ8O+ZTDHnlDpEB0SBgQMaPgvQKc1R8xRbTA9oYws/IRDx54tPAvO+2z2G5blhTEcvjaB1QMbDIzBzSGsL+9mkux8OyPhE8Ars1lcd8Jugslf45AD3SFNkc9xf2LFgkAkKDzo8Pgx3AkKNA3OKzYzjwVUCAgE0HVp8KxBDKxczB+7Axmo36h2oBR48ZvyF+Ud4BWJ2QLmRsdmObWxXEmB76ZHwhhIpm6CYKEyZJcXMwUK+Fmr33UjA2V0EYudCDO5NIYzY3XiFAPo+zQRxanKPrmMM7lvZJqpYaYjeoBYvRLx6UFDiAN0u3wiwj2h0ChiGXYhTMIOwJSYGEAZnGaeafqCwc56nCqDb6TcMXwQw0KfsBNyOqoADy1sCDghIQPcAD8JDnR/VU2Q9NTsicDsMHGD8QOCCLwHreZT6HEU8gvojA/CWYPQPxXoAb/WoxTBevdZ8rnYHXyITqEb6gUwXfhshwF/wx+nFMDXQQkfEj/vvn6YGf6Lrf5lA/jrK+P4XX1f6BKEUSNE8CNf/DYPiQU4nQHs/SMF4vr6fquv/aoGpHuR8QCIw+W0j3c5r1/f5YUXzIGcD6vsBLfH4bHIH553AlwcjglLgzNH5xJfTPyW4PgjSFC3x/ewNz/epujT68iATnBKByQcBhSNF8Byj9bklUD3I2YBIkARijzI8j9Fuw6B7kPAyQR4BVnafounWRc2DBC8dKAhMhmPRIb8T2PJiXSV44SgSvAI8Tkfn8cyX+NXR+DDIHrwCEkH+DXK8T3Z+ZXD1tevDoHiQYvkrE2BNYG6K2MFS+B3fCNqbtjsl6AkyGnNUQgmMqQhMsZcRhY3vFO37SWaIHpBA58GbEJAPxlQErasxfkZlL02pG/YeVK7wC4ASeBkP3q/jfZ8ZRvE3v3MYVYCTAze+FqXgcxjWmOBHkR3NDz8D6ARgxikIP+AsgwyHtzSzu0GK0xI08b2j3/DQRzDFZ3WnCvA3BjVB8wgCY4Ftm8I0DdK8E3Y3Fphg2nQBM23bhnpYgSsNb9tUB2i5rNTU/IBWIfYJdvuZnjCw8sFtQBXA7wB6+BnH9U7bTVAEluXzNvbrfaJ7hTC/8nzwwythfaH9ia7/BQKpuue/oesZxPqiX8DL9/+f9UU/x7f3/8P6IlpDZEZU7hK+POAcBg9+Ckatvoi6HDHVQZH/xodJ7ZAItPqit0hMIsDYITowyfaUiYVUCYSiQG6SAFYOiB0KvCjw2EMY4zUPSrtQX/QSULYh1ReNBYghLIW9K/9BzInSsoQglQ/hQ8DpjtQhYePbCwoCEDukLprAkj3QBG4GDuDa+iKICvcQpRnIDkQCaQ4LePF4UQk8XaTyHngdkOICiklf9wQBVuCQIfGDWJ+EUDBIQdkNLu2mPGxDuutA8Yb9oWcSlGOWhA/luV1U53BQpNJXCspud7/8RKZuqzDexGpZROV6P44vT4KyG5oI50/AiwVMcwg7eQdOuv62mAtuU9WulVIHh5EhoFzA5Odlj6tk1uqL5jjCcGn1RTNmhguF7Xrf/U7byXIqBUzm9eCS6osY5XdaJOe5gXCizbv3G5f3rKv8EUUPFvZghUvuQQxcHrTJArOfY23QqkTP0YNYX7QqHTLDVnUwhX09KfRftBP3wWse8JtwiPVFWvkPjuuL5pntXD8Eo7i3sf/m+qLl76gvWn5vfdFfAgwA68Z42OO/LeAAAAAASUVORK5CYII='

interface DemoButtonProps {
  mapData: MapData,
  tilesets: Tileset[],
  activeVersion: string
}

interface DemoButtonState {
  gameMap?: GameMap,
  x: number,
  y: number,
  actionHandler?: ActionHandler
}

function mapStateToProps ({ tilesets, mapData, editorData }: any) {
  return {
    tilesets,
    mapData,
    activeVersion: editorData.activeVersion
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
            mapVersion={this.props.activeVersion}
            viewport={{ width: 19, height: 15 }}
            chars={[]}
            controllableChar={{
              id: 'heroine',
              name: 'Heroine',
              image: CHARSET,
              x: this.state.x,
              y: this.state.y
            }}
            onLoaded={(actionHandler) => this.setState({ actionHandler })}
            onEvent={getOnDemoEvent() ? getOnDemoEvent().bind(this, this.state.actionHandler) : undefined}
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

  async onClick (e: React.MouseEvent) {
    e.preventDefault()
    if (!this.canvas.current) {
      return
    }
    const { mapData, tilesets } = this.props
    const data = await mapToGameMap(this.canvas.current, mapData, tilesets)
    this.setState({
      gameMap: data
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
