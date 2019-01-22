import * as React from 'react'
import { shallow } from 'enzyme'
import Hello from '../Hello'

describe('Hello', () => {
  it('renders', () => {
    const hello = shallow(<Hello compiler='foo' framework='lala' />)
    expect(hello).toMatchSnapshot()
  })
})
