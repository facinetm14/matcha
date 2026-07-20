import { inject, injectable } from 'inversify';
import { TYPE } from '@/config/ioc/inversify-type';
import { GeocodeService } from '../ports/services/geo-code-service';
import { GeocodeAddressType } from '@shared/extract-city-from-geocode';

@injectable()
export class ReverseGeocodeCoordinatesUseCase {
  constructor(
    @inject(TYPE.GeocodeService)
    private readonly geocodeService: GeocodeService,
  ) {}

  async execute(
    lat: number,
    lng: number,
  ): Promise<{ address: GeocodeAddressType } | null> {
    return this.geocodeService.getGeocode(lat, lng);
  }
}
