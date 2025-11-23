import { EventType } from '../consts/event-type';
/**
 * @param payload is json stringfy
 */
export interface EventBus {
  publish(event: EventType, payload: string): void;
  subscribe(event: EventType, handler: (payload: string) => void): void;
}
