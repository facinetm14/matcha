export interface EmailPayload {
  email: string;
  message: string;
  subject: string;
  username: string;
}

export interface EmailService {
  send(payload: EmailPayload): void;
}
