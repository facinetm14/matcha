import { Container } from 'inversify';
import { Logger } from '../../core/ports/services/logger.service';
import { TYPE } from './inversify-type';
import { LoggerStd } from '../../adapters/services/LoggerStd';

export function bindLoggers(container: Container) {
  container.bind<Logger>(TYPE.Logger).to(LoggerStd).inSingletonScope();
}
