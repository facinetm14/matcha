import { registerAuthEventSubscribers } from '@/modules/auth/event-subscribers/event-subscribers-bootstrap';
import { registerUsersEventSubscribers } from '@/modules/users/application/event-subscribers/event-subscribers-bootstrap';
import { registerNotificationsEventSubscribers } from '@/modules/notifications/application/event-subscribers/event-subscribers-bootstrap';

/**
 * Register all event subscribers across all modules.
 * Must be called after the IoC container is fully initialized.
 */
export function registerAllEventSubscribers(): void {
  registerAuthEventSubscribers();
  registerUsersEventSubscribers();
  registerNotificationsEventSubscribers();
}
