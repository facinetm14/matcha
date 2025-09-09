import { EventType } from '../../domain/enums/event-type';
/**
 * @param payload is json stringfy
 */
export interface EventBus {
  emitEvent(event: EventType, payload: string): void;
  listenTo(event: EventType, handler: (payload: string) => void): void;
}
