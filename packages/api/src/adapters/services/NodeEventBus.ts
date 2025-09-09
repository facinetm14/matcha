import { EventEmitter } from 'node:stream';
import { EventBus } from '../../core/ports/services/event-bus';
import { EventType } from '../../core/domain/enums/event-type';
import { injectable } from 'inversify';

@injectable()
export class NodeEventBus extends EventEmitter implements EventBus {
  emitEvent(event: EventType, payload: string): void {
    this.emit(event, payload);
  }

  listenTo(event: EventType, handler: (payload: string) => void): void {
    this.on(event, handler);
  }
}
