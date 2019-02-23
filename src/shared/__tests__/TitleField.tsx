import * as React from 'react'
import { mount } from 'enzyme'
import TitleField from '../TitleField'

interface WithValue {
  value: string
}

describe('<TitleField>', () => {
  const onChange = jest.fn()

  it('renders correctly', () => {
    const wrapper = mount(
      <TitleField title='foobar' onChange={onChange} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  describe('when clicking on title', () => {
    it('shows text input', () => {
      const wrapper = mount(
        <TitleField title='foobar' onChange={onChange} />
      )
      expect(wrapper.find('TextField')).toHaveLength(0)
      wrapper.simulate('click')
      expect(wrapper.find('TextField').prop('value')).toEqual('foobar')
      wrapper.find('TextField').simulate('change', { target: { value: 'New Title' } })
      expect(onChange).toHaveBeenCalledWith('New Title')
      wrapper.find('Button').simulate('click')
      expect(wrapper.find('TextField')).toHaveLength(0)
    })
  })
})
