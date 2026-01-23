import { useState } from 'react';
import { FindUserCategory } from './useArticlesLogger';

export interface LostItem {
  type: 'FOUND' | 'LOST';
  category: FindUserCategory | '';
  foundDate: Date;
  foundPlace: string;
  content: string;
  author: string;
  images: Array<string>;
  registered_at: string;
  updated_at: string;
  hasDateBeenSelected: boolean;
  isCategorySelected: boolean;
  isDateSelected: boolean;
  isFoundPlaceSelected: boolean;
}

export interface LostItemHandler {
  setType: (type: 'FOUND' | 'LOST') => void;
  setCategory: (category: FindUserCategory) => void;
  setFoundDate: (date: Date) => void;
  setFoundPlace: (foundPlace: string) => void;
  setContent: (content: string) => void;
  setAuthor: (author: string) => void;
  setImages: (image: Array<string>) => void;
  setHasDateBeenSelected: () => void;
  checkIsCategorySelected: () => void;
  checkIsDateSelected: () => void;
  checkIsFoundPlaceSelected: () => void;
}

const initialForm: LostItem = {
  type: 'FOUND',
  category: '',
  foundDate: new Date(),
  foundPlace: '',
  content: '',
  author: '',
  images: [],
  registered_at: '',
  updated_at: '',
  hasDateBeenSelected: false,
  isCategorySelected: true,
  isDateSelected: true,
  isFoundPlaceSelected: true,
};

interface UseLostItemFormOptions {
  defaultType: 'FOUND' | 'LOST';
  initialItems?: LostItem[];
}

export const useLostItemForm = ({ defaultType, initialItems }: UseLostItemFormOptions) => {
  const [lostItems, setLostItems] = useState<Array<LostItem>>(initialItems ?? [{ ...initialForm, type: defaultType }]);

  const updateItem = (index: number, updates: Partial<LostItem>) => {
    setLostItems((prev) => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], ...updates };
      return newItems;
    });
  };

  const lostItemHandler = (key: number): LostItemHandler => ({
    setType: (type) => updateItem(key, { type }),
    setCategory: (category) => updateItem(key, { category }),
    setFoundDate: (foundDate) => updateItem(key, { foundDate }),
    setFoundPlace: (foundPlace) => updateItem(key, { foundPlace }),
    setContent: (content) => updateItem(key, { content }),
    setAuthor: (author) => updateItem(key, { author }),
    setImages: (images) => updateItem(key, { images }),
    setHasDateBeenSelected: () => updateItem(key, { hasDateBeenSelected: true }),
    checkIsCategorySelected: () => {
      setLostItems((prev) => {
        const newItems = [...prev];
        const item = newItems[key];
        newItems[key] = { ...item, isCategorySelected: item.category.trim() !== '' };
        return newItems;
      });
    },
    checkIsDateSelected: () => {
      setLostItems((prev) => {
        const newItems = [...prev];
        const item = newItems[key];
        newItems[key] = { ...item, isDateSelected: item.hasDateBeenSelected };
        return newItems;
      });
    },
    checkIsFoundPlaceSelected: () => {
      setLostItems((prev) => {
        const newItems = [...prev];
        const item = newItems[key];
        newItems[key] = { ...item, isFoundPlaceSelected: item.foundPlace.trim() !== '' };
        return newItems;
      });
    },
  });

  const addLostItem = () => {
    setLostItems((prev) => [...prev, { ...initialForm, type: defaultType }]);
  };

  const removeLostItem = (key: number) => {
    setLostItems((prev) => prev.filter((_, index) => index !== key));
  };

  const isItemValid = (item: LostItem) =>
    item.category.trim() !== '' && item.hasDateBeenSelected && (item.type === 'LOST' || item.foundPlace.trim() !== '');

  const checkArticleFormFull = () => {
    const isValid = lostItems.every(isItemValid);
    return isValid;
  };

  const validateAndUpdateItems = () => {
    setLostItems((prev) =>
      prev.map((item) => ({
        ...item,
        isCategorySelected: item.category.trim() !== '',
        isDateSelected: item.hasDateBeenSelected,
        isFoundPlaceSelected: item.foundPlace.trim() !== '',
      })),
    );
  };

  return {
    lostItems,
    lostItemHandler,
    addLostItem,
    removeLostItem,
    checkArticleFormFull,
    validateAndUpdateItems,
  };
};
