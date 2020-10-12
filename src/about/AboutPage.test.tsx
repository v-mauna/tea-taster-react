import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { ionFireEvent as fireEvent } from '@ionic/react-test-utils';
import AboutPage from './AboutPage';

jest.mock('../core/auth', () => ({
  useAuthentication: () => ({
    logout: mockLogout,
  }),
}));
jest.mock('react-router', () => ({
  useHistory: () => ({
    replace: jest.fn(),
  }),
}));

let mockLogout = jest.fn(() => Promise.resolve());

describe('<AboutPage />', () => {
  beforeEach(() => (mockLogout = jest.fn(() => Promise.resolve())));

  it('renders consistently', () => {
    const { asFragment } = render(<AboutPage />);
    expect(asFragment).toMatchSnapshot();
  });

  describe('sign out button', () => {
    it('signs the user out', async () => {
      let button: HTMLIonButtonElement;
      const { container } = render(<AboutPage />);
      button = container.querySelector('ion-button')!;
      fireEvent.click(button);
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
  });
});
