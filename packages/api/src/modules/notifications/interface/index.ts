// Interface layer - inbound adapters (controllers, routers, middlewares, validations)
export { ChatController } from './http/controllers/chat.controller';
export { default as ChatRouter } from './http/routers/chat.router';

// Validations
export { CreateMessageDtoSchema } from './validations/create-message-dto.validation';
