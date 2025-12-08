import { Location } from "@/modules/users/domain/entities/user-profile.entity";

export interface IpLocation {
  getLocation(ip: string): Promise<Location>;
}