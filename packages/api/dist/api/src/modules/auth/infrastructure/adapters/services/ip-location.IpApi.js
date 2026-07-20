"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpLocationIpApi = void 0;
const distance_1 = require("../../../../../../../shared/distance");
const inversify_1 = require("inversify");
let IpLocationIpApi = class IpLocationIpApi {
    async getLocation(ip) {
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
            return {
                isEnabledByUser: false,
                lat: data.latitude ?? distance_1.defaultLocation.lat,
                lng: data.longitude ?? distance_1.defaultLocation.lng,
            };
        }
        return {
            isEnabledByUser: false,
            lat: distance_1.defaultLocation.lat,
            lng: distance_1.defaultLocation.lng,
        };
    }
};
exports.IpLocationIpApi = IpLocationIpApi;
exports.IpLocationIpApi = IpLocationIpApi = __decorate([
    (0, inversify_1.injectable)()
], IpLocationIpApi);
