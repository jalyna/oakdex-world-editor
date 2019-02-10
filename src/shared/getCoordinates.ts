import { Coordinate } from 'components/TilesetEditor/reducers/currentCoordinates'

export default function (e: React.MouseEvent<HTMLDivElement>): Coordinate {
  const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
  return {
    x: Math.floor((e.pageX - rect.left) / 16),
    y: Math.floor((e.pageY - rect.top) / 16)
  }
}
