import { Direction } from 'oakdex-world-engine'

import mapToGameMap from '../mapToGameMap'

describe('.mapToGameMap', () => {
  const context = {
    clearRect: jest.fn(),
    drawImage: jest.fn()
  }
  const canvas = {
    getContext: () => context,
    toDataURL: () => 'base64example'
  } as any
  const mapData = {
    title: 'abc',
    width: 2,
    height: 2,
    layers: [
      {
        name: 'layer1',
        fields: [
          {
            x: 0,
            y: 0,
            tilesetTitle: 'tileset1',
            tilesetX: 1,
            tilesetY: 1
          }
        ]
      }
    ],
    chars: [
      {
        tilesetTitle: 'tileset1',
        charsetTitle: 'charset1',
        id: 'charset1-id',
        x: 1,
        y: 1,
        dir: Direction.Up
      },
      {
        tilesetTitle: 'tileset1',
        charsetTitle: 'charset2',
        id: 'charset2-id',
        x: 1,
        y: 1,
        dir: Direction.Left
      }
    ]
  } as any
  const tilesets = [
    {
      title: 'tileset1',
      width: 2,
      height: 2,
      objects: [
        [true, false],
        [false, false]
      ],
      specialTiles: [
        {
          title: 'Special',
          fields: [
            {
              x: 1,
              y: 1
            }
          ]
        }
      ],
      walkability: [
        [{ top: 0, right: 0, bottom: 0, left: 0 }, { top: 0, right: 0, bottom: 0, left: 0 }],
        [{ top: 0, right: 0, bottom: 0, left: 0 }, { top: 1, right: 1, bottom: 1, left: 1 }]
      ],
      credits: [{
        title: 'a'
      }, {
        title: 'b',
        url: 'some-url'
      }],
      charsets: [
        {
          title: 'charset1',
          imageBase64: 'af'
        },
        {
          title: 'charset2',
          imageBase64: 'ad'
        },
        {
          title: 'charset3',
          imageBase64: 'du'
        }
      ]
    },
    {
      credits: [{
        title: 'a'
      }, {
        title: 'c'
      }]
    }
  ] as any

  it('returns game map', async () => {
    const gameData = await mapToGameMap(canvas, mapData, tilesets)
    expect(gameData).toEqual({
      title: 'abc',
      width: 2,
      height: 2,
      credits: [{ title: 'a' }, { title: 'b', url: 'some-url' }, { title: 'c' }],
      specialTiles: [
        ['Special', null],
        [null, null]
      ],
      walkability: [
        [{ top: 1, right: 1, bottom: 1, left: 1 }, { top: 0, right: 0, bottom: 0, left: 0 }],
        [{ top: 0, right: 0, bottom: 0, left: 0 }, { top: 0, right: 0, bottom: 0, left: 0 }]
      ],
      chars: [
        {
          id: 'charset1-id',
          image: 'af',
          x: 1,
          y: 1,
          dir: Direction.Up
        },
        {
          id: 'charset2-id',
          image: 'ad',
          x: 1,
          y: 1,
          dir: Direction.Left
        }
      ],
      mapBackgroundImage: 'base64example',
      mapForegroundImage: 'base64example',
      versions: []
    })
  })
})
