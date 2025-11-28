import { Location, UserProfile } from '@/types/user';

const MOCK_LOCATIONS: Location[] = [
  { city: 'Paris', lat: 48.8566, lng: 2.3522, isEnabledByUser: true },
  { city: 'Lyon', lat: 45.764, lng: 4.8357, isEnabledByUser: true },
  { city: 'Marseille', lat: 43.2965, lng: 5.3698, isEnabledByUser: true },
  { city: 'Toulouse', lat: 43.6047, lng: 1.4442, isEnabledByUser: true },
  { city: 'Bordeaux', lat: 44.8378, lng: -0.5792, isEnabledByUser: true },
  { city: 'Nice', lat: 43.7102, lng: 7.262, isEnabledByUser: true },
  { city: 'New York', lat: 40.7128, lng: -74.006, isEnabledByUser: true },
];

export const getMockLocation = (index = 0): Location =>
  MOCK_LOCATIONS[index % MOCK_LOCATIONS.length];

export const withMockedLocation = (
  user: UserProfile,
  index = 0,
): UserProfile => {
  const hasCoords =
    typeof user.location?.lat === 'number' &&
    typeof user.location?.lng === 'number';

  if (hasCoords) {
    if (user.location?.city) {
      return user;
    }

    const fallback = getMockLocation(index);
    return {
      ...user,
      location: {
        ...user.location!,
        city: user.location?.city ?? fallback.city,
        isEnabledByUser: user.location?.isEnabledByUser ?? true,
      },
    };
  }

  const mockLocation = getMockLocation(index);
  return {
    ...user,
    location: {
      isEnabledByUser:
        user.location?.isEnabledByUser ?? mockLocation.isEnabledByUser ?? true,
      city: user.location?.city ?? mockLocation.city,
      lat: mockLocation.lat,
      lng: mockLocation.lng,
    },
  };
};
