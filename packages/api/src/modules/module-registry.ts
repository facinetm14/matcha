import { ApiModuleDescriptor } from './module-descriptor';
import { authModule } from './auth/module';
import { notificationsModule } from './notifications/module';
import { usersModule } from './users/module';

export const apiModules: ApiModuleDescriptor[] = [
  authModule,
  usersModule,
  notificationsModule,
];
