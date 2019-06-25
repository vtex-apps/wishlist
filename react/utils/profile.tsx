import { path } from 'ramda'

export const getProfile = (data: Session): Profile | undefined =>
  path(['getSession', 'profile'], data)
