import * as React from 'react'
import { mount } from 'enzyme'
import Button from '../Button'

describe('<Button>', () => {
  it('renders correctly', () => {
    const wrapper = mount(<Button onClick={jest.fn()} />)
    expect(wrapper).toMatchSnapshot()
  })
})
