
import { File } from '@jitar/sourcing';

import Service from '../Service';

export default interface Repository extends Service
{
    readAsset(filename: string): Promise<File>;
}
