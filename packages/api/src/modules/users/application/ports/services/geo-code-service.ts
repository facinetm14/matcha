import { GeocodeAddressType } from '@shared/extract-city-from-geocode';

export interface GeocodeService {
  getGeocode(
    lat: number,
    lng: number,
  ): Promise<{ address: GeocodeAddressType } | null>;
}
