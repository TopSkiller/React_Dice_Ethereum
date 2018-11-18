import React from 'react';
import Transactions from './Transactions';
import renderer from 'react-test-renderer';

it('renders correctly on empty transactions', () => {
  const tree = renderer
    .create(<Transactions transactions={[]} network={3} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders correctly on not empty transactions', () => {
  const tree = renderer
    .create(<Transactions transactions={['0x0123']} network={3} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
