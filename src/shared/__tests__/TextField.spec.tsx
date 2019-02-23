import * as React from 'react'
import { mount } from 'enzyme'
import TextField from '../TextField'

describe('<TextField>', () => {
  it('renders correctly', () => {
    const wrapper = mount(<TextField value='test' onChange={jest.fn()} />)
    expect(wrapper).toMatchSnapshot()
  })
})
