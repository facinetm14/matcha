export interface UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  gender?: 'male' | 'female' | 'non-binary';
  sexualPreferences?: Array<'male' | 'female' | 'non-binary'>;
  biography?: string;
  tags?: string[];
  location?: {
    city?: string;
    lat?: number;
    lng?: number;
  };
  photos?: string[];
  profilePhoto?: string;
}