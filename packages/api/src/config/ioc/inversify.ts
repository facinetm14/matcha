import { Container } from 'inversify';
import { bindSharedModule } from '@/modules/shared/module-bindings';
import { bindAuthModule } from '@/modules/auth/module-bindings';
import { bindUsersModule } from '@/modules/users/module-bindings';
import { bindNotificationsModule } from '@/modules/notifications/module-bindings';

const container: Container = new Container();
bindSharedModule(container);
bindAuthModule(container);
bindUsersModule(container);
bindNotificationsModule(container);

export default container;
