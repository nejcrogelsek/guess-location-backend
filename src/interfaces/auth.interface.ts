export type IAuthReturnData = {
  user: {
    id: number
    email: string
    first_name: string
    last_name: string
    profile_image: string
  }
  access_token: string
}

export interface IUserDataFromToken {
  id: number
  email: string
  first_name: string
  last_name: string
  profile_image: string
}
export interface IRefreshTokenData {
  name: string
  sub: number
}
