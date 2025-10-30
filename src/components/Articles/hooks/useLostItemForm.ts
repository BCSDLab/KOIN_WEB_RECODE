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

export const useLostItemForm = (defaultType: 'FOUND' | 'LOST') => {
  const [lostItems, setLostItems] = useState<Array<LostItem>>([{ ...initialForm, type: defaultType }]);

  const lostItemHandler = (key: number) => ({
    setType: (type: 'FOUND' | 'LOST') => {
      setLostItems((prev) => {
        const newLostItems = [...prev];
        newLostItems[key].type = type;
        return newLostItems;
      });
    },
    setCategory: (category: FindUserCategory) => {
      setLostItems((prev) => {
        const newLostItems = [...prev];
        newLostItems[key].category = category;
        return newLostItems;
      });
    },
    setFoundDate: (date: Date) => {
      setLostItems((prev) => {
        const newLostItems = [...prev];
        newLostItems[key].foundDate = date;
        return newLostItems;
      });
    },
    setFoundPlace: (foundPlace: string) => {
      setLostItems((prev) => {
        const newLostItems = [...prev];
        newLostItems[key].foundPlace = foundPlace;
        return newLostItems;
      });
    },
    setContent: (content: string) => {
      setLostItems((prev) => {
        const newLostItems = [...prev];
        newLostItems[key].content = content;
        return newLostItems;
      });
    },
    setAuthor: (author: string) => {
      setLostItems((prev) => {
        const newLostItems = [...prev];
        if (newLostItems[key].author !== author) {
          newLostItems[key].author = author;
        }
        return newLostItems;
      });
    },
    setImages: (images: Array<string>) => {
      setLostItems((prev) => {
        const newLostItems = [...prev];
        newLostItems[key].images = images;
        return newLostItems;
      });
    },
    setHasDateBeenSelected: () => {
      setLostItems((prev) => {
        const newLostItems = [...prev];
        newLostItems[key].hasDateBeenSelected = true;
        return newLostItems;
      });
    },
    checkIsCategorySelected: () => {
      setLostItems((prev) => {
        const newLostItems = [...prev];
        newLostItems[key].isCategorySelected = newLostItems[key].category.trim() !== '';
        return newLostItems;
      });
    },
    checkIsDateSelected: () => {
      setLostItems((prev) => {
        const newLostItems = [...prev];
        newLostItems[key].isDateSelected = newLostItems[key].hasDateBeenSelected;
        return newLostItems;
      });
    },
    checkIsFoundPlaceSelected: () => {
      setLostItems((prev) => {
        const newLostItems = [...prev];
        newLostItems[key].isFoundPlaceSelected = newLostItems[key].foundPlace.trim() !== '';
        return newLostItems;
      });
    },
  });

  const addLostItem = () => {
    setLostItems((prev) => [...prev, { ...initialForm }]);
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
