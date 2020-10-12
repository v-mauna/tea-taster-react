import { renderHook, act, cleanup } from '@testing-library/react-hooks';
import apiInstance from '../core/apiInstance';
import { TastingNote } from '../shared/models';
import { useTastingNotes } from './useTastingNotes';

const mockNote = {
  id: 4,
  brand: 'Lipton',
  name: 'Yellow Label',
  notes: 'Overly acidic, highly tannic flavor',
  rating: 1,
  teaCategoryId: 3,
};

describe('useTea', () => {
  describe('get all notes', () => {
    beforeEach(() => {
      (apiInstance.get as any) = jest.fn(() =>
        Promise.resolve({ data: [mockNote] }),
      );

      it('gets the notes', async () => {
        let notes: Array<TastingNote> = [];
        const { result } = renderHook(() => useTastingNotes());
        await act(async () => {
          notes = await result.current.getNotes();
        });
        expect(apiInstance.get).toHaveBeenCalledTimes(1);
        expect(notes).toEqual([mockNote]);
      });
    });
  });

  describe('get a singular note', () => {
    beforeEach(() => {
      (apiInstance.get as any) = jest.fn(() =>
        Promise.resolve({ data: mockNote }),
      );
    });

    it('gets a single TastingNote', async () => {
      let note: TastingNote | undefined = undefined;
      const { result } = renderHook(() => useTastingNotes());
      await act(async () => {
        note = await result.current.getNoteById(4);
      });
      expect(apiInstance.get).toHaveBeenCalledTimes(1);
      expect(note).toEqual(mockNote);
    });
  });

  describe('delete a note', () => {
    beforeEach(() => {
      (apiInstance.delete as any) = jest.fn(() => Promise.resolve());
    });

    it('deletes a single note', async () => {
      const { result } = renderHook(() => useTastingNotes());
      await act(async () => {
        await result.current.deleteNote(4);
      });
      expect(apiInstance.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('save a note', () => {
    beforeEach(() => {
      (apiInstance.post as any) = jest.fn(() => Promise.resolve());
    });

    it('saves a single note', async () => {
      const { result } = renderHook(() => useTastingNotes());
      await act(async () => {
        await result.current.saveNote(mockNote);
      });
      expect(apiInstance.post).toHaveBeenCalledTimes(1);
    });
  });

  afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
  });
});
