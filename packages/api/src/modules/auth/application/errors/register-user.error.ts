export enum RegisterUserError {
  INVALID_USER_EMAIL = 'Invalid_user_email',
  INVALID_USER_NAME = 'Invalid_user_name',
  INVALID_USER_FIRST_NAME = 'Invalid_user_firstname',
  INVALID_USER_LAST_NAME = 'Invalid_user_lastname',
  INVALID_USER_PASSWD = 'Invalid_user_password',
  MISMATCH_CONFIRM_PASSWD_WITH_PASSWD = 'Mismatch_confirm_passwordd_with_password',
  USER_PASSWD_WEAK = 'Weak_user_password',
  UNKNOWN_ERROR = 'Unknown_error',
  EMAIL_ALREADY_EXISTS = 'Email_already_exists',
  USER_NAME_ALREADY_EXISTS = 'Username_already_exists',
}
