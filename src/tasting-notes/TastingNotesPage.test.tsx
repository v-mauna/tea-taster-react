import React from 'react';
import { render, wait, cleanup, waitForElement } from '@testing-library/react';
import { ionFireEvent as fireEvent } from '@ionic/react-test-utils';
import TastingNotesPage from './TastingNotesPage';
import { TastingNote } from '../shared/models';
jest.mock('../tea/useTea', () => ({
  useTea: () => ({
    getTeas: jest.fn(() => Promise.resolve(mockTeas)),
  }),
}));
jest.mock('./useTastingNotes', () => ({
  useTastingNotes: () => ({
    getNotes: mockGetNotes,
    getNote: mockGetNote,
  }),
}));

let mockGetNotes = jest.fn(() => Promise.resolve(mockNotes));
let mockGetNote = jest.fn(() => Promise.resolve(mockNotes[0]));

const mockNotes: Array<TastingNote> = [
  {
    id: 73,
    brand: 'Bently',
    name: 'Brown Label',
    notes: 'Essentially OK',
    rating: 3,
    teaCategoryId: 2,
  },
  {
    id: 42,
    brand: 'Lipton',
    name: 'Yellow Label',
    notes: 'Overly acidic, highly tannic flavor',
    rating: 1,
    teaCategoryId: 3,
  },
];

const mockTeas = [
  {
    id: 7,
    name: 'White',
    image: 'assets/img/white.jpg',
    description: 'White tea description.',
    rating: 5,
  },
  {
    id: 8,
    name: 'Yellow',
    image: 'assets/img/yellow.jpg',
    description: 'Yellow tea description.',
    rating: 3,
  },
];

describe('<TastingNotesPage />', () => {
  beforeEach(() => {
    mockGetNotes = jest.fn(() => Promise.resolve(mockNotes));
    mockGetNote = jest.fn(() => Promise.resolve(mockNotes[0]));
  });

  it('renders consistently', async () => {
    const { asFragment } = render(<TastingNotesPage />);
    await wait(() => expect(asFragment()).toMatchSnapshot());
  });

  describe('initialization', () => {
    it('gets all of the notes', async () => {
      render(<TastingNotesPage />);
      await wait(() => expect(mockGetNotes).toHaveBeenCalledTimes(1));
    });

    it('displays the notes', async () => {
      const { container } = render(<TastingNotesPage />);
      await wait(() => {
        expect(container).toHaveTextContent(/Bently/);
        expect(container).toHaveTextContent(/Lipton/);
      });
    });
  });

  describe('add a new note', () => {
    it('displays the editor modal', async () => {
      const { container, getByText } = render(<TastingNotesPage />);
      const button = container.querySelector('ion-fab-button')!;
      fireEvent.click(button);
      await wait(() => expect(getByText('Add New Tasting Note')).toBeDefined());
    });
  });

  describe('update an existing note', () => {
    it('prepopulates the editor modal', async () => {
      const { container, getByText } = render(<TastingNotesPage />);
      const firstNote = await waitForElement(
        () => container.querySelector('ion-item')!,
      );
      fireEvent.click(firstNote);
      await wait(() => {
        expect(getByText(/Bently/)).toBeDefined();
      });
    });
  });

  afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
  });
});
