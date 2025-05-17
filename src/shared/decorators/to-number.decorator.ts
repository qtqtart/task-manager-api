import { Transform } from "class-transformer";

export const ToNumber = () =>
  Transform(({ value }) => {
    if (typeof value === "number") {
      return value >= 0 ? value : undefined;
    }
    if (typeof value === "string") {
      const numericValue = Number(value);
      return isNaN(numericValue)
        ? undefined
        : numericValue >= 0
          ? numericValue
          : undefined;
    }
    return undefined;
  });
