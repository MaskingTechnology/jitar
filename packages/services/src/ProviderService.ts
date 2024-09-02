
import type { File } from '@jitar/sourcing';

import Service from './Service';

export default interface ProviderService extends Service
{
    provide(filename: string): Promise<File>;
}
