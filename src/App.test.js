import React from 'react';
import { act, render } from '@testing-library/react';
import App from './App';
import { sleep } from './utils/utils';

test('renders learn react link', async () => {
  const { getByText } = render(<App />);
  await act(() => sleep(1000));
  const linkElement = getByText(/Create New Wallet/i);
  expect(linkElement).toBeInTheDocument();
});
