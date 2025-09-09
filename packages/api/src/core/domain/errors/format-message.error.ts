import { RegisterUserError } from "./register-user.error";

export const FormatErrorMessage: {[key: string]: string} = {
  [RegisterUserError.INVALID_USER_LAST_NAME]: 'user last'
} 