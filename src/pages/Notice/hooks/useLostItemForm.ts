import { useState } from 'react';

export interface LostItem {
  category: string;
  foundDate: Date; // 요청에서는 yy-MM-dd
  foundPlace: string;
  content: string;
  images: Array<string>;
  hasBeenSelected: boolean;
}

export interface LostItemHandler {
  setCategory: (category: string) => void;
  setFoundDate: (date: Date) => void;
  setLocation: (foundPlace: string) => void;
  setContent: (content: string) => void;
  setImages: (image: Array<string>) => void;
  setHasBeenSelected: () => void;
}

const initialForm: LostItem = {
  category: '',
  foundDate: new Date(),
  foundPlace: '',
  content: '',
  images: [],
  hasBeenSelected: false,
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
    setLocation: (foundPlace: string) => {
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
    setHasBeenSelected: () => {
      setLostItems((prev) => {
        const newLostItems = [...prev];
        newLostItems[key].hasBeenSelected = true;
        return newLostItems;
      });
    },
  });

  const addLostItem = () => {
    setLostItems((prev) => [...prev, { ...initialForm }]);
  };

  return {
    lostItems,
    lostItemHandler,
    addLostItem,
  };
};
