// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

export interface IUser {
  _id: string
  email: string
  avatar: string
  color: string
  fullName: string
  mainTitle: string
  slug: string
  occupation: string
  createdAt?: string
  updatedAt: string
}

export interface IUpdateImg {
  imageDetailsid: string,
  name: string,
  description: string,
  url: string
}

export interface IPicture { //
  _id?: string
  userId?: string
  portfolioId?: string
  url: string
  serial?: number
  description?: string
  name?: string,
  added?: boolean,
  deleted?: boolean
}

export interface PSlugPagenumberObj {
  slug: string | string[] | undefined
  pageNumber: number | string
  userId?: string | undefined
  // limit: number | null
}


export interface dataCreate {
  name?: string
  description?: string
  privacy?: string
  im?: string
}

export interface portfolioCreate {
  name: string
  description: string
  year: string
  privacy: string
  picture: string
}

export interface IPortfolio {
  _id: string
  userId: string
  name: string
  description: string
  privacy: string
  year?: string | number
  coverImage: number
  pictures: Array<IPicture>
  slug: string
  totalPictures?: number
  style?: number
  createdAt?: string
  updatedAt?: string
  userSlug: string | undefined
  color: string
}


export interface PortfolioData {

}