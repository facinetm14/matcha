export interface CreateUserDto {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  passwd: string;
  confirmPasswd: string;
}
