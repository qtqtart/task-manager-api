import { Transform } from 'class-transformer';

export const ToBoolean = () => Transform(({ value }) => toBoolean(value));

const toBoolean = (value: any) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (['true', 'on', 'yes'].includes(value.toLowerCase())) return true;
    if (['false', 'off', 'no'].includes(value.toLowerCase())) return false;
  }

  return undefined;
};
