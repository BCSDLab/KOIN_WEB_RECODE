import { APIResponse } from 'interfaces/APIResponse';

export type LandList = {
  internal_name: string;
  monthly_fee: string;
  latitude: number;
  longitude: number;
  charter_fee: string;
  name: string;
  id: number;
  softDeleted: boolean;
  room_type: string;
};

export interface LandDetailResponse extends APIResponse {
  monthly_fee: string;
  latitude: number;
  longitude: number;
  charter_fee: string;
  created_at: string;
  description: string;
  image_urls: null | string[];
  softDeleted: boolean;
  internal_name: string;
  is_deleted: boolean;
  updated_at: string;
  id: number;
  floor: null | number;
  management_fee: string;
  address: string;
  comments: [];
  size: number;
  phone: string;
  name: string;
  deposit: string;
  permalink: string;
  room_type: string;
  opt_electronic_door_locks: boolean;
  opt_tv: boolean;
  opt_elevator: boolean;
  opt_water_purifier: boolean;
  opt_washer: boolean;
  opt_veranda: boolean;
  opt_gas_range: boolean;
  opt_induction: boolean;
  opt_bidet: boolean;
  opt_shoe_closet: boolean;
  opt_refrigerator: boolean;
  opt_desk: boolean;
  opt_closet: boolean;
  opt_air_conditioner: boolean;
  opt_bed: boolean;
  opt_microwave: boolean;

}
export interface LandListResponse extends APIResponse {
  lands: LandList[];
}
