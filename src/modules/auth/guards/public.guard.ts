import { METADATA_KEYS } from '@shared/consts/metadata-keys';

import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata(METADATA_KEYS.PUBLIC, true);
