export enum ApiError {
  UNEXPECTED = 'UNEXPECTED',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  STATE_CONFLICT = 'STATE_CONFLICT',
  UNAFFECTED = 'UNAFFECTED',
  UNIQUE_VIOLATION = 'UNIQUE_VIOLATION',
  FK_VIOLATION = 'FK_VIOLATION',
}

export { UnexpectedError } from './unexpected.error'
export { ValidationError } from './validation.error'
export { NotFoundError } from './not-found.error'
export { StateConflictError } from './state-conflict.error'
export { UnaffectedError } from './unaffected.error'
export { UniqueViolationError } from './unique-violation.error'
export { FKViolationError } from './fk-violation.error'
