import { differenceInYears } from 'date-fns';

export const calculateAge = (from: Date, now: Date): number => {
  return differenceInYears(now, from);
};
