export interface AddressCreateRequest {
  recipient_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  district: string;
  district_id: string;
  city: string;
  city_id: string;
  province: string;
  province_id: string;
  postal_code: string;
  is_primary?: boolean;
}

export interface AddressUpdateRequest {
  recipient_name?: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string;
  district?: string;
  district_id?: string;
  city?: string;
  city_id?: string;
  province?: string;
  province_id?: string;
  postal_code?: string;
  is_primary?: boolean;
}

export interface AddressResponse {
  id: number;
  recipient_name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  district: string;
  district_id: string;
  city: string;
  city_id: string;
  province: string;
  province_id: string;
  postal_code: string;
  is_primary: boolean;
  created_at: string;
}

export interface Province {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
  zip_code: string;
}

export interface District {
  id: number;
  name: string;
  zip_code: string;
}

export interface ShippingCostRequest {
  destination: string;
  weight: number;
  courier: string;
}

export interface ShippingCostResponse {
  name: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}
