import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

// KOIN_ORDER_WEBVIEW pages/Shop/hooks/useReviewForm(useReviewFormBase) 이전. 작성·수정 화면이 함께 쓴다
export const MAX_CONTENT_LENGTH = 500;
export const MAX_MENU_COUNT = 5;

export default function useReviewFormBase() {
  const [content, setContentState] = useState('');
  const [menuInput, setMenuInput] = useState('');
  const [menus, setMenus] = useState<string[]>([]);
  const [rating, setRating] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const menuTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const isFormValid = rating > 0 && content.trim().length > 0;

  const setContent = (value: string) => setContentState(value.slice(0, MAX_CONTENT_LENGTH));

  const handleMenuKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key !== 'Enter') return;

    e.preventDefault();
    const value = e.currentTarget.value.trim();
    if (!value) return;

    setMenus((prev) => {
      if (prev.length >= MAX_MENU_COUNT) return prev;
      if (prev.includes(value)) return prev;

      return [...prev, value];
    });
    setMenuInput('');
  };

  const handleRemoveMenu = (index: number) => {
    setMenus((prev) => prev.filter((_, i) => i !== index));
  };

  // 입력 내용에 맞춰 textarea 높이를 늘린다
  useEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [content]);

  useEffect(() => {
    if (!menuTextareaRef.current) return;

    menuTextareaRef.current.style.height = 'auto';
    menuTextareaRef.current.style.height = `${menuTextareaRef.current.scrollHeight}px`;
  }, [menuInput]);

  return {
    content,
    setContent,
    menuInput,
    setMenuInput,
    menus,
    setMenus,
    rating,
    setRating,
    textareaRef,
    menuTextareaRef,
    isFormValid,
    handleMenuKeyDown,
    handleRemoveMenu,
  };
}
