import { decodeJWT } from './auth'

function filterRoles(r) {
  return decodeJWT().roles[0] === r
}

export const coordinator = () => filterRoles('COORDINATOR')
export const operator = () => filterRoles('OPERATOR')
export const florist = () => filterRoles('FLORIST')
export const admin = () => filterRoles('ADMIN')
export const superUser = () => filterRoles('SUPERUSER')
export const workshop = () => filterRoles('WORKSHOP-WORKER')
