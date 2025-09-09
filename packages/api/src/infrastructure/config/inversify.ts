import { Container } from 'inversify';
import { bindControllers } from './bind-controllers';
import { bindUseCases } from './bind-usecases';
import { bindRepositories } from './bind-repositories';
import { bindLoggers } from './bind-logger';

const container: Container = new Container();
bindLoggers(container);
bindControllers(container);
bindUseCases(container);
bindRepositories(container);

export default container;