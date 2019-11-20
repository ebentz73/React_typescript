import React from 'react';
import {shallow} from 'enzyme';
import {Home} from '../home';

test('Home', () => {
  expect(shallow(<Home />)).toMatchSnapshot();
});
