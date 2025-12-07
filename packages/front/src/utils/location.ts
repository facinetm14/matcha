import { Location } from '@/types/user';

export const defaultLocation = {
  lat: 48.8566,
  lng: 2.3522,
};

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
