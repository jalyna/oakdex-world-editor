import * as React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { Tileset, Walkability } from 'components/TilesetEditor/reducers/tilesetData'
import { TabData } from 'components/TilesetEditor/reducers/tabData'
import { Coordinate } from 'components/TilesetEditor/reducers/currentCoordinates'
import { TEAL_90, TEAL_50 } from 'shared/theme'
import Tile from 'shared/Tile'

interface WalkProps {
  walkability: Walkability[][],
  tabData: TabData
}

function mapStateToProps ({ tilesetData, tabData }: any) {
  return {
    walkability: tilesetData.walkability,
    tabData
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {}
}

function allSame (tile: Walkability, status: number): boolean {
  return Object.values(tile).every((v: number) => v === status)
}

function renderType (status: number): string {
  if (status === 2) {
    return '◎'
  } else if (status === 1) {
    return 'X'
  } else {
    return 'O'
  }
}

function renderSimpleColor (cell: Walkability): string {
  if (allSame(cell, 2)) {
    return renderTypeColor(2)
  } else if (allSame(cell, 1)) {
    return renderTypeColor(1)
  } else if (allSame(cell, 0)) {
    return renderTypeColor(0)
  } else {
    return 'rgba(224, 35, 234, 0.3)'
  }
}

function renderTypeColor (status: number): string {
  if (status === 2) {
    return 'rgba(0, 191, 255, 0.6)'
  } else if (status === 1) {
    return 'rgba(211, 76, 52, 0.6)'
  } else {
    return 'rgba(58, 178, 106, 0.6)'
  }
}

function setDefaults(ctx: CanvasRenderingContext2D, walkabilityMode: string) {
  ctx.font = 'normal 8px Verdana'
  ctx.textBaseline = 'top'
  ctx.textAlign = 'left'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'

  if (walkabilityMode === 'details') {
    ctx.shadowOffsetX = 1
    ctx.shadowOffsetY = 1
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'
    ctx.shadowBlur = 1
  } else {
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    ctx.shadowBlur = 0
  }
}

function drawWalkability(canvas: HTMLCanvasElement, walkability: Walkability[][], walkabilityMode: string) {
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  setDefaults(ctx, walkabilityMode)
  walkability.forEach((row, y) => {
    row.forEach((cell, x) => {
      drawCell(ctx, walkability, walkabilityMode, x, y)
    })
  })
}

function drawCell(ctx: CanvasRenderingContext2D, walkability: Walkability[][], walkabilityMode: string, x: number, y: number, redraw?: boolean) {
  if (redraw) {
    ctx.clearRect(x * 16, y * 16, 16, 16)
    setDefaults(ctx, walkabilityMode)
  }

  const cell = walkability[y][x]

  if (walkabilityMode === 'details') {
    ctx.fillText(renderType(cell.top), x * 16 + 4, y * 16)
    ctx.fillText(renderType(cell.bottom), x * 16 + 4, y * 16 + 8)
    ctx.fillText(renderType(cell.left), x * 16, y * 16 + 4)
    ctx.fillText(renderType(cell.right), x * 16 + 8, y * 16 + 4)
  } else {
    const color = renderSimpleColor(cell)
    if (color !== ctx.fillStyle) {
      ctx.fillStyle = color
    }
    ctx.fillRect(x * 16, y * 16, 16, 16)
  }
}

function cellToString (cell: Walkability): string {
  return Object.keys(cell).map((c) => c + '_' + (cell as any)[c]).sort().toString()
}

class Walk extends React.Component<WalkProps, {}> {
  constructor (props: WalkProps) {
    super(props)
  }

  private canvas = React.createRef<HTMLCanvasElement>()

  render () {
    const { walkability, tabData } = this.props
    return (
      <canvas
        ref={this.canvas}
        width={walkability[0].length * 16}
        height={walkability.length * 16}
        />
    )
  }

  componentDidUpdate (prevProps: WalkProps) {
    const { walkability, tabData } = this.props
    const prevWalkability = prevProps.walkability
    const ctx = this.canvas.current.getContext('2d')

    if (tabData.walkabilityMode !== prevProps.tabData.walkabilityMode) {
      this.redraw()
      return
    }

    walkability.forEach((row, y) => {
      row.forEach((cell, x) => {
        const otherCell = prevWalkability[y] && prevWalkability[y][x]
        if (!otherCell) {
          drawCell(ctx, walkability, tabData.walkabilityMode, x, y, true)
          return
        }
        if (cellToString(otherCell) !== cellToString(cell)) {
          drawCell(ctx, walkability, tabData.walkabilityMode, x, y, true)
        }
      })
    })
  }

  componentDidMount () {
    this.redraw()
  }

  async redraw () {
    const { walkability, tabData } = this.props
    await drawWalkability(this.canvas.current, walkability, tabData.walkabilityMode)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Walk)
