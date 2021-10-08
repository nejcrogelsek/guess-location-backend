export interface IPersonalBest {
  location: {
    id: number
    lat: string
    long: string
    city: string
    location_image: string
    user_id: number
    created_at: Date
    updated_at: Date
  }
  distance: number
}
