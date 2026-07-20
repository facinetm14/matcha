"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractCityFromGeocode = void 0;
const extractCityFromGeocode = (geocodeData) => {
    const cityCandidate = geocodeData?.city ||
        geocodeData?.town ||
        geocodeData?.village ||
        geocodeData?.municipality;
    return cityCandidate;
};
exports.extractCityFromGeocode = extractCityFromGeocode;
