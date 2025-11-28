import { Location } from '@/types/user';

const toRadians = (value: number) => (value * Math.PI) / 180;

export const calculateDistanceKm = (
  from?: Location,
  to?: Location,
): number => {
  const hasFromCoords =
    typeof from?.lat === 'number' && typeof from?.lng === 'number';
  const hasToCoords =
    typeof to?.lat === 'number' && typeof to?.lng === 'number';

  if (!hasFromCoords || !hasToCoords) {
    return Number.POSITIVE_INFINITY;
  }

  const earthRadiusKm = 6371;
  const deltaLat = toRadians((to!.lat ?? 0) - (from!.lat ?? 0));
  const deltaLng = toRadians((to!.lng ?? 0) - (from!.lng ?? 0));

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRadians(from!.lat ?? 0)) *
      Math.cos(toRadians(to!.lat ?? 0)) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
};
