export type GeocodeAddressType = {
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  country?: string;
};

export const extractCityFromGeocode = (
  geocodeData: GeocodeAddressType,
): string => {
  const cityCandidate =
    geocodeData?.city ||
    geocodeData?.town ||
    geocodeData?.village ||
    geocodeData?.municipality;

  return cityCandidate as string;
};
