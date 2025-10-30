export interface LostItemArticleForGet {
  id: number;
  boardId: number;
  type: string;
  category: string;
  foundPlace: string;
  foundDate: string;
  content: string;
  author: string;
  registeredAt: string;
  is_reported: boolean;
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
  type: string;
  category: string;
  foundPlace: string;
  foundDate: string;
  content: string;
  author: string;
  is_council: boolean;
  is_mine: boolean;
  images: Image[];
  prevId: number | null;
  nextId: number | null;
  registeredAt: string; // yyyy-MM-dd
  updatedAt: string; // yyyy-MM-dd HH:mm:ss
}

export interface LostItemArticleForPost {
  type: string;
  category: string;
  foundPlace: string;
  foundDate: string; // yyyy-MM-dd
  content: string;
  images: string[];
  registered_at: string;
  updated_at: string;
}

export interface LostItemArticlesForPost {
  articles: LostItemArticleForPost[];
}

interface LostItemArticleReportForPost {
  title: string;
  content: string;
}

export interface LostItemArticlesReportForPost {
  reports: LostItemArticleReportForPost[];
}
