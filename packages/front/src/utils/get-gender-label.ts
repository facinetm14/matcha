import { Gender } from '@/types/user';

export function getGenderLabel(gender?: Gender): string {
  if (!gender) {
    return '';
  }

  return `${gender[0].toUpperCase()}${gender.slice(1)}`;
}
