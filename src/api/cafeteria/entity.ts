export const enum MenuTime {
  BREAKFAST = "BREAKFAST",
  LANUCH = "LANUCH",
  DINNER = "DINNER",
}


export type CafeteriaMenu = {
  id: number
  date: string
  type: MenuTime
  place: string
  price_card: number
  price_cash: number
  kcal: number
  menu: string[]
  created_at: string
  updated_at: string
}

export interface CafeteriaMenuResponse {
  CafeteriaMenu: CafeteriaMenu[]
}