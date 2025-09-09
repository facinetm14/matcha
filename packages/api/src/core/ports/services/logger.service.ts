export interface Logger {
  info(message: string): void;
  error(message: string): void;
  success(message: string): void;
}