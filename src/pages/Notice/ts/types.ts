export interface LostItemArticleForGet {
  id: number;
  boardId: number;
  category: string;
  foundPlace: string;
  foundDate: string;
  content: string;
  author: string;
  registeredAt: string;
  updatedAt: string;
}

export interface LostItemArticlesForGet {
  articles: LostItemArticleForGet[];
  totalCount: number;
  currentCount: number;
  totalPage: number;
  currentPage: number;
}

export interface Image {
  id: number;
  imageUrl: string;
}

export interface SingleLostItemArticle {
  id: number;
  boardId: number;
  category: string;
  foundPlace: string;
  foundDate: string;
  content: string;
  author: string;
  image: Image[]; // stage 현재 image, 추후 images로 변경
  prevId: number | null;
  nextId: number | null;
  registeredAt: string; // yyyy-MM-dd
  updatedAt: string; // yyyy-MM-dd HH:mm:ss
}

export interface LostItemArticleForPost {
  category: string;
  location: string;
  foundDate: string; // yyyy-MM-dd
  content: string;
  images: string[];
}

export interface LostItemArticlesForPost {
  articles: LostItemArticleForPost[];
}
