
import { File } from '../../source';

import Service from '../Service';

export default interface Repository extends Service
{
    readAsset(filename: string): Promise<File>;

    readModule(specifier: string): Promise<File>;
}
