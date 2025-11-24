interface Range<T> {
  from: T;
  to?: T;
}
export interface FilterUsersDto {
  age?: Range<number>;
  fameRating?: Range<number>;
  tags?: string[];
}
