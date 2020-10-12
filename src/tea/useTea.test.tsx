import React from 'react';
import { renderHook, act, cleanup } from '@testing-library/react-hooks';
import apiInstance from '../core/apiInstance';
import { useTea } from './useTea';
import { Tea } from '../shared/models';

const expectedTeas = [
  {
    id: 1,
    name: 'Green',
    image: 'green.jpg',
    description: 'Green tea description.',
  },
  {
    id: 2,
    name: 'Black',
    image: 'black.jpg',
    description: 'Black tea description.',
  },
  {
    id: 3,
    name: 'Herbal',
    image: 'herbal.jpg',
    description: 'Herbal Infusion description.',
  },
  {
    id: 4,
    name: 'Oolong',
    image: 'oolong.jpg',
    description: 'Oolong tea description.',
  },
  {
    id: 5,
    name: 'Dark',
    image: 'dark.jpg',
    description: 'Dark tea description.',
  },
  {
    id: 6,
    name: 'Puer',
    image: 'puer.jpg',
    description: 'Puer tea description.',
  },
  {
    id: 7,
    name: 'White',
    image: 'white.jpg',
    description: 'White tea description.',
  },
  {
    id: 8,
    name: 'Yellow',
    image: 'yellow.jpg',
    description: 'Yellow tea description.',
  },
];

const resultTeas = () => {
  return expectedTeas.map((t: Tea) => {
    const tea = { ...t };
    delete tea.image;
    return tea;
  });
};

describe('useTea', () => {
  describe('get all teas', () => {
    beforeEach(() => {
      (apiInstance.get as any) = jest.fn(() =>
        Promise.resolve({ data: resultTeas() }),
      );
    });

    it('gets the teas', async () => {
      const { result } = renderHook(() => useTea());
      await act(async () => {
        await result.current.getTeas();
      });
      expect(apiInstance.get).toHaveBeenCalledTimes(1);
    });

    it('adds an image to each tea item', async () => {
      let teas: Array<Tea> = [];
      const { result } = renderHook(() => useTea());
      await act(async () => {
        teas = await result.current.getTeas();
      });
      expect(teas).toEqual(expectedTeas);
    });
  });

  describe('get a specific tea', () => {
    beforeEach(() => {
      (apiInstance.get as any) = jest.fn(() =>
        Promise.resolve({ data: resultTeas()[0] }),
      );
    });

    it('gets the specific tea', async () => {
      const { result } = renderHook(() => useTea());
      await act(async () => {
        await result.current.getTeaById(4);
      });
      expect(apiInstance.get).toHaveBeenCalledTimes(1);
    });

    it('adds an image to the Tea object', async () => {
      let tea: Tea | undefined = undefined;
      const { result } = renderHook(() => useTea());
      await act(async () => {
        tea = await result.current.getTeaById(4);
      });
      expect(tea).toEqual(expectedTeas[0]);
    });
  });

  afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
  });
});
