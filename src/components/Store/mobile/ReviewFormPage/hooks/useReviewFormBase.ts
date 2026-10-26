import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

// KOIN_ORDER_WEBVIEW pages/Shop/hooks/useReviewForm(useReviewFormBase) 이전. 작성·수정 화면이 함께 쓴다
export const MAX_CONTENT_LENGTH = 500;
export const MAX_MENU_COUNT = 5;

// 수정 화면은 기존 리뷰 값을 초기값으로 넣는다(서버가 받은 값으로 첫 렌더부터 채워 그린다)
export interface ReviewFormInitialValues {
  content?: string;
  menus?: string[];
  rating?: number;
  existingImageUrls?: string[];
}

export default function useReviewFormBase(initialValues: ReviewFormInitialValues = {}) {
  const [content, setContentState] = useState(() => (initialValues.content ?? '').slice(0, MAX_CONTENT_LENGTH));
  const [menuInput, setMenuInput] = useState('');
  const [menus, setMenus] = useState<string[]>(initialValues.menus ?? []);
  const [rating, setRating] = useState(initialValues.rating ?? 0);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>(initialValues.existingImageUrls ?? []);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const menuTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const isFormValid = rating > 0 && content.trim().length > 0;

  const setContent = (value: string) => setContentState(value.slice(0, MAX_CONTENT_LENGTH));

  // 입력창에 남은 메뉴명을 태그로 확정하고, 확정 후 태그 목록을 돌려준다(제출 시 바로 쓰기 위해).
  // order는 Enter로만 태그를 만들어 Enter 없이 넘어가면 입력이 조용히 빠졌다 → 입력창을 벗어날 때·제출할 때도 확정한다(스펙 차이)
  const commitMenuInput = () => {
    const value = menuInput.trim();
    setMenuInput('');
    if (!value || menus.length >= MAX_MENU_COUNT || menus.includes(value)) return menus;

    const next = [...menus, value];
    setMenus(next);

    return next;
  };

  const handleMenuKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key !== 'Enter') return;

    e.preventDefault();
    commitMenuInput();
  };

  const handleMenuBlur = () => {
    commitMenuInput();
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
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
    existingImageUrls,
    setExistingImageUrls,
    textareaRef,
    menuTextareaRef,
    isFormValid,
    handleRemoveExistingImage,
    handleMenuKeyDown,
    handleMenuBlur,
    commitMenuInput,
    handleRemoveMenu,
  };
}
