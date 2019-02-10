import { Coordinate } from 'components/TilesetEditor/reducers/currentCoordinates'

export default function (zoom: number, e: React.MouseEvent<HTMLDivElement>): Coordinate {
  const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
  const size = zoom * 16
  return {
    x: Math.floor((e.pageX - rect.left) / size),
    y: Math.floor((e.pageY - rect.top) / size)
  }
}
