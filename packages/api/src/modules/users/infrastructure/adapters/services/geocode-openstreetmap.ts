import { GeocodeService } from '@/modules/users/application/ports/services/geo-code-service';
import { GeocodeAddressType } from '@shared/extract-city-from-geocode';
import { injectable } from 'inversify';

@injectable()
export class GeocodeOpenStreetMap implements GeocodeService {
  async getGeocode(
    lat: number,
    lng: number,
  ): Promise<{ address: GeocodeAddressType } | null> {
    const result = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      {
        headers: {
          'User-Agent': 'matcha-app',
        },
      },
    );

    if (!result.ok) {
      return null;
    }

    const data = await result.json();

    return data;
  }
}
