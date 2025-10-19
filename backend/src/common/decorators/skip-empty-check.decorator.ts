import { SetMetadata } from '@nestjs/common';

export const SKIP_EMPTY_CHECK = 'skipEmptyCheck';
export const SkipEmptyCheck = () => SetMetadata(SKIP_EMPTY_CHECK, true);

