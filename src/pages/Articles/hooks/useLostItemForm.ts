import { useState } from 'react';

export interface LostItem {
  category: string;
  foundDate: Date;
  foundPlace: string;
  content: string;
  images: Array<string>;
  hasDateBeenSelected: boolean;
  isCategorySelected: boolean;
  isDateSelected: boolean;
  isFoundPlaceSelected: boolean;
}

export interface LostItemHandler {
  setCategory: (category: string) => void;
  setFoundDate: (date: Date) => void;
  setFoundPlace: (foundPlace: string) => void;
  setContent: (content: string) => void;
  setImages: (image: Array<string>) => void;
  setHasDateBeenSelected: () => void;
  checkIsCategorySelected: () => void;
  checkIsDateSelected: () => void;
  checkIsFoundPlaceSelected: () => void;
}

const initialForm: LostItem = {
  category: '',
  foundDate: new Date(),
  foundPlace: '',
  content: '',
  images: [],
  hasDateBeenSelected: false,
  isCategorySelected: true,
  isDateSelected: true,
  isFoundPlaceSelected: true,
};

export const useLostItemForm = () => {
  const [lostItems, setLostItems] = useState<Array<LostItem>>([{ ...initialForm }]);

  const lostItemHandler = (key: number) => ({
    setCategory: (category: string) => {
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

  const isItemValid = (item: LostItem) => (
    item.category.trim() !== ''
    && item.hasDateBeenSelected
    && item.foundPlace.trim() !== ''
  );

  const checkArticleFormFull = () => lostItems.every(isItemValid);

  const validateAndUpdateItems = () => {
    setLostItems((prev) => prev.map((item) => ({
      ...item,
      isCategorySelected: item.category.trim() !== '',
      isDateSelected: item.hasDateBeenSelected,
      isFoundPlaceSelected: item.foundPlace.trim() !== '',
    })));
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
