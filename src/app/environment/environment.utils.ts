import { plainToClass } from "class-transformer";
import { validateSync } from "class-validator";

import { EnvironmentModel } from "./environment.model";

export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToClass(EnvironmentModel, config);
  const errors = validateSync(validatedConfig);

  if (errors.length > 0) throw new Error(errors.toString());

  return validatedConfig;
};
