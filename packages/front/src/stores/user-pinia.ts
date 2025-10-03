import { userApi } from '@/api/user.api';
import type { UserIdentifier } from '../../../shared/user-identifier';

export const useUserStore = defineStore('user', {
  state: () => ({}),

  actions: {
    async getMe() {
      const user = await userApi.getMe();
      console.log(user);
    },

    async checkUserIdentifierAvailability(
      field: UserIdentifier,
      value: string,
    ): Promise<boolean> {
      const availabilityResp = await userApi.checkUserIdentifierAvailability(
        field,
        value,
      );

      if (availabilityResp.status === 200) {
        const data = await availabilityResp.json();
        return data.available;
      }

      return false;
    },
  },
});
