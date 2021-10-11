export type IAuthReturnData = {
  user: {
    id: number
    email: string
    first_name: string
    last_name: string
    profile_image: string
    confirmed: boolean
  }
  access_token: string
}

export interface IUserDataFromToken {
  id: number
  email: string
  first_name: string
  last_name: string
  profile_image: string
  confirmed: boolean
}
export interface IToken {
  name: string
  sub: number
  iat: number
  exp: number
}
