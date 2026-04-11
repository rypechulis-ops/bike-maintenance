export interface Bike {
  id: string
  name: string
  type: string | null
  status: 'active' | 'retired'
  notes: string | null
  created_at: string
}

export interface Part {
  name: string
  brand?: string
  cost?: number
}

export interface ServiceFile {
  id: string
  service_record_id: string
  file_path: string
  file_name: string
  file_type: string | null
  created_at: string
}

export interface RentalRecord {
  id: string
  bike_id: string
  platform: string
  listing_name: string | null
  rental_start: string | null
  rental_end: string | null
  payout_date: string | null
  amount: number
  status: string
  borrower_name: string | null
  notes: string | null
  created_at: string
}

export interface ServiceRecord {
  id: string
  bike_id: string
  date: string
  mileage: number | null
  service_type: string
  description: string | null
  performed_by: string | null
  parts: Part[]
  total_cost: number | null
  notes: string | null
  created_at: string
  bikes?: Bike
  service_files?: ServiceFile[]
}
