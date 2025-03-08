import { Transform } from 'class-transformer';

export const ToPositiveNumber = () =>
  Transform(({ value }) => toPositiveNumber(value));

const toPositiveNumber = (value: any) => {
  if (typeof value === 'number') return value >= 0 ? value : undefined;
  if (typeof value === 'string')
    return isNaN(Number(value)) ? undefined : toPositiveNumber(Number(value));

  return undefined;
};
