import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from 'next-themes';
import { Moon, SunMedium, LockKeyholeOpen } from 'lucide-react';
import { UserProfile } from '@/types/user';
import { getInitials } from '@/utils/get-initials';
import { resolveUserImageUrl } from '@/utils/resolve-user-image-url';

type SettingsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blockedUsers: UserProfile[];
  isLoadingBlockedUsers: boolean;
  onUnblockUser: (user: UserProfile) => void;
  unblockingUserId?: string | null;
};

const getUserAvatar = (user: UserProfile) => {
  const firstPhoto = (user.photos ?? [])[0] as
    | { preview?: string }
    | string
    | undefined;

  if (!firstPhoto) {
    return undefined;
  }

  if (typeof firstPhoto === 'string') {
    return resolveUserImageUrl(firstPhoto);
  }

  return resolveUserImageUrl(firstPhoto.preview);
};

export function SettingsModal({
  open,
  onOpenChange,
  blockedUsers,
  isLoadingBlockedUsers,
  onUnblockUser,
  unblockingUserId,
}: SettingsModalProps) {
  const { theme = 'light', setTheme } = useTheme();
  const currentTheme = theme === 'dark' ? 'dark' : 'light';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your preferences and blocked users from here.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Appearance
            </h3>
            <div className="flex gap-3">
              <Button
                variant={currentTheme === 'light' ? 'default' : 'outline'}
                onClick={() => setTheme('light')}
              >
                <SunMedium className="w-4 h-4" />
                Light
              </Button>
              <Button
                variant={currentTheme === 'dark' ? 'default' : 'outline'}
                onClick={() => setTheme('dark')}
              >
                <Moon className="w-4 h-4" />
                Dark
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Blocked users
              </h3>
              <span className="text-xs text-muted-foreground">
                {blockedUsers.length} blocked
              </span>
            </div>

            {isLoadingBlockedUsers ? (
              <p className="text-sm text-muted-foreground">
                Loading blocked users...
              </p>
            ) : !blockedUsers.length ? (
              <p className="text-sm text-muted-foreground">
                You have not blocked any users.
              </p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {blockedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between gap-3 border rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={getUserAvatar(user)}
                          alt={user.firstName}
                        />
                        <AvatarFallback>
                          {getInitials(user.firstName, user.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUnblockUser(user)}
                      disabled={unblockingUserId === user.id}
                    >
                      <LockKeyholeOpen className="w-4 h-4" />
                      {unblockingUserId === user.id
                        ? 'Unblocking...'
                        : 'Unblock'}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
