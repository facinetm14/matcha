import { IpLocation } from '@/modules/auth/application/ports/services/ip-location-service';
import { Location } from '@/modules/users/domain/entities/user-profile.entity';
import { injectable } from 'inversify';

@injectable()
export class IpLocationIpApi implements IpLocation {
  async getLocation(ip: string): Promise<Location> {
    const ipV4 = ip.replace('::ffff:', '');
    const apiLocationKey = process.env.API_LOCATION_KEY;
    const url = `http://api.ipapi.com/${ipV4}?access_key=${apiLocationKey}`;

    const resp = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (resp.ok) {
      const data = await resp.json();

      console.log({ data });
    }

    return {
      isEnabledByUser: false,
      lat: 0,
      lng: 0,
    };
  }
}
