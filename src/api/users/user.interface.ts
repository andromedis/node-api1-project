export interface BaseUser {
  name: string,
  bio: string
}

export interface User extends BaseUser {
  id: string
}