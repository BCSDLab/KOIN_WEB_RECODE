export const enum MenuTime {
  BREAKFAST = "BREAKFAST",
  LANUCH = "LANUCH",
  DINNER = "DINNER",
}


export type CafeteriaMenu = {
  id: number
  date: Date
  type: MenuTime
  place: string
  price_card: number
  price_cash: number
  kcal: number
  menu: string[]
  created_at: Date
  updated_at: Date
}

export interface CafeteriaMenuResponse {
  CafeteriaMenu: CafeteriaMenu[]
}