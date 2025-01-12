import { useState } from 'react';

export interface LostItem {
  category: string,
  foundDate: string,
  location: string,
  content: string,
  image: Array<{ image_url: string }>,
  author: '총학생회',
}

export interface LostItemHandler {
  setCategory: (category: string) => void;
  setFoundDate: (foundDate: string) => void;
  setLocation: (location: string) => void;
  setContent: (content: string) => void;
  setImage: (image: Array<{ image_url: string }>) => void;
}

const initialForm: LostItem = {
  category: '',
  foundDate: '',
  location: '',
  content: '',
  image: [],
  author: '총학생회',
};

export const useLostItemForm = () => {
  const [lostItems, setLostItems] = useState<Array<LostItem>>([initialForm]);

  const lostItemHandler = (key: number) => ({
    setCategory: (category: string) => {
      setLostItems((prev) => {
        const newLostItems = [...prev];
        newLostItems[key].category = category;
        return newLostItems;
      });
    },
    setFoundDate: (foundDate: string) => {
      setLostItems((prev) => {
        const newLostItems = [...prev];
        newLostItems[key].foundDate = foundDate;
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
    setImage: (image: Array<{ image_url: string }>) => {
      setLostItems((prev) => {
        const newLostItems = [...prev];
        newLostItems[key].image = image;
        return newLostItems;
      });
    },
  });

  const addLostItem = () => {
    setLostItems((prev) => [...prev, initialForm]);
  };

  return {
    lostItems,
    lostItemHandler,
    addLostItem,
  };
};
