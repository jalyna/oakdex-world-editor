import * as React from 'react'
import { mount } from 'enzyme'
import toJson from 'enzyme-to-json'

import ListItem, { Actions, ItemTitle } from '../ListItem'

describe('<ListItem>', () => {
  it('renders correctly', () => {
    const wrapper = mount(
      <ListItem>
        <ItemTitle>Foobar</ItemTitle>
        <Actions>Actions</Actions>
      </ListItem>
    )
    expect(toJson(wrapper, { noKey: false, mode: 'deep' })).toMatchSnapshot()
  })
})
