import { Container } from 'inversify';
import { bindControllers } from './bind-controllers';
import { bindUseCases } from './bind-usecases';
import { bindRepositories } from './bind-repositories';
import { bindServices } from './bind-services';

const container: Container = new Container();
bindServices(container);
bindControllers(container);
bindUseCases(container);
bindRepositories(container);

export default container;