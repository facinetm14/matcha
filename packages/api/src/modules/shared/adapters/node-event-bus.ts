import { EventEmitter } from 'node:stream';
import { EventBus } from '../ports/event-bus';
import { EventType } from '../consts/event-type';
import { injectable } from 'inversify';

@injectable()
export class NodeEventBus extends EventEmitter implements EventBus {
  publish(event: EventType, payload: string): void {
    this.emit(event, payload);
  }

  subscribe(event: EventType, handler: (payload: string) => void): void {
    this.on(event, handler);
  }
}
