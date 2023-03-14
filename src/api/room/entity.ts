import { APIResponse } from 'interfaces/APIResponse';

export type LandList = {
  internal_name: string
  monthly_fee: string
  latitude: number
  longitude: number
  charter_fee: string
  name: string
  id: number
  softDeleted: boolean
  room_type: string
};

export interface LandDetailResponse extends APIResponse {
  opt_electronic_door_locks: boolean,
  opt_tv: boolean,
  monthly_fee: string,
  opt_elevator: boolean,
  opt_water_purifier: boolean,
  opt_washer: boolean,
  latitude: number,
  longitude: number,
  charter_fee: string,
  opt_veranda: boolean,
  created_at: string,
  description: string,
  image_urls: null,
  opt_gas_range: boolean,
  opt_induction: boolean,
  softDeleted: boolean,
  internal_name: string,
  is_deleted: boolean,
  updated_at: string,
  opt_bidet: boolean,
  opt_shoe_closet: boolean,
  opt_refrigerator: boolean,
  id: number,
  floor: null,
  management_fee: string,
  opt_desk: boolean,
  opt_closet: boolean,
  address: string,
  comments: [],
  opt_bed: boolean,
  size: number,
  phone: string,
  opt_air_conditioner: boolean,
  name: string,
  deposit: string,
  opt_microwave: boolean,
  permalink: string,
  room_type: string
}
export interface LandListResponse extends APIResponse {
  lands: LandList[]
}
