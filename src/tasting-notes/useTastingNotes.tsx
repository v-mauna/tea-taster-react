import { useCallback } from 'react';
import apiInstance from '../core/apiInstance';
import { TastingNote } from '../shared/models';

export const useTastingNotes = () => {
  const getNotes = useCallback(async (): Promise<Array<TastingNote>> => {
    const url = `/user-tasting-notes`;
    const { data } = await apiInstance.get(url);
    return data;
  }, []);

  const getNoteById = useCallback(async (id: number): Promise<TastingNote> => {
    const url = `/user-tasting-notes/${id}`;
    const { data } = await apiInstance.get(url);
    return data;
  }, []);

  const deleteNote = async (id: number): Promise<void> => {
    const url = `/user-tasting-notes/${id}`;
    await apiInstance.delete(url);
  };

  const saveNote = async (note: TastingNote) => {
    let url = `/user-tasting-notes`;
    if (note.id) url += `/${note.id}`;
    await apiInstance.post(url, note);
  };

  return { getNotes, getNoteById, deleteNote, saveNote };
};
