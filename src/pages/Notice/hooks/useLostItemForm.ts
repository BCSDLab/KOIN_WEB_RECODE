import { useState } from 'react';

export interface LostItem {
  category: string;
  foundDate: Date;
  location: string;
  content: string;
  images: Array<string>;
  hasDateBeenSelected: boolean;
  isCategorySelected: boolean;
  isDateSelected: boolean;
  isLocationSelected: boolean;
}

export interface LostItemHandler {
  setCategory: (category: string) => void;
  setFoundDate: (date: Date) => void;
  setLocation: (location: string) => void;
  setContent: (content: string) => void;
  setImages: (image: Array<string>) => void;
  setHasDateBeenSelected: () => void;
  checkIsCategorySelected: () => void;
  checkIsDateSelected: () => void;
  checkIsLocationSelected: () => void;
}

const initialForm: LostItem = {
  category: '',
  foundDate: new Date(),
  location: '',
  content: '',
  images: [],
  hasDateBeenSelected: false,
  isCategorySelected: true,
  isDateSelected: true,
  isLocationSelected: true,
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
    setLocation: (location: string) => {
      setLostItems((prev) => {
        const newLostItems = [...prev];
        newLostItems[key].location = location;
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
    checkIsLocationSelected: () => {
      setLostItems((prev) => {
        const newLostItems = [...prev];
        newLostItems[key].isLocationSelected = newLostItems[key].location.trim() !== '';
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
    && item.location.trim() !== ''
  );

  const checkArticleFormFull = () => lostItems.every(isItemValid);

  const validateAndUpdateItems = () => {
    setLostItems((prev) => prev.map((item) => ({
      ...item,
      isCategorySelected: item.category.trim() !== '',
      isDateSelected: item.hasDateBeenSelected,
      isLocationSelected: item.location.trim() !== '',
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
