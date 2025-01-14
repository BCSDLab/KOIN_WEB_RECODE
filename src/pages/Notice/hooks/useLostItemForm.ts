import { useState } from "react";

// const getyyMMdd = (date: Date) => {
//   const yy = String(date.getFullYear()).slice(2);
//   const MM = String(date.getMonth() + 1).padStart(2, "0");
//   const dd = String(date.getDate()).padStart(2, "0");
//   return `${yy}-${MM}-${dd}`;
// };

export interface LostItem {
  category: string;
  foundDate: Date; // 요청에서는 yy-MM-dd
  location: string;
  content: string;
  images: Array<{ image_url: string }>;
  hasBeenSelected: boolean;
}

export interface LostItemHandler {
  setCategory: (category: string) => void;
  setFoundDate: (date: Date) => void;
  setLocation: (location: string) => void;
  setContent: (content: string) => void;
  setImage: (image: Array<{ image_url: string }>) => void;
  setHasBeenSelected: () => void;
}

const initialForm: LostItem = {
  category: "",
  foundDate: new Date(),
  location: "",
  content: "",
  images: [],
  hasBeenSelected: false,
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
    setImage: (image: Array<{ image_url: string }>) => {
      setLostItems((prev) => {
        const newLostItems = [...prev];
        newLostItems[key].images = image;
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
    setLostItems((prev) => [...prev, initialForm]);
  };

  return {
    lostItems,
    lostItemHandler,
    addLostItem,
  };
};
