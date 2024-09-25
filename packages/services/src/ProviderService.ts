
import type { File } from '@jitar/sourcing';

import Service from './Service';

interface ProviderService extends Service
{
    provide(filename: string): Promise<File>;
}

export default ProviderService;
