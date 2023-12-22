import { decodeJWT } from './auth'

function filterRoles(r) {
  return decodeJWT().roles[0] === r
}

export const coordinator = () => filterRoles('COORDINATOR')
export const florist = () => filterRoles('FLORIST')
export const admin = () => filterRoles('ADMIN')
