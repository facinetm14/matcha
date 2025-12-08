import { Location } from '@/types/user';
import { defaultLocation } from '../../../shared/distance';

export const getUserCurrentPosition = async (): Promise<Location> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        isEnabledByUser: false,
        lat: defaultLocation.lat,
        lng: defaultLocation.lng,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          isEnabledByUser: true,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        resolve({
          isEnabledByUser: false,
          lat: defaultLocation.lat,
          lng: defaultLocation.lng,
        });
      },
    );
  });
};
