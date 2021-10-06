export interface IUser {
  id: number
  email: string
  first_name: string
  last_name: string
  profile_image: string
  confirmed: boolean
  password: string
  created_at: Date
  updated_at: Date
}
export type IUserData = {
  id: number
  email: string
  first_name: string
  last_name: string
  profile_image: string
  confirmed: boolean
}
