
import { cyan, green, yellow } from 'kolorist';

import { Framework } from '../types/Framework.js';

const Frameworks: Framework[] = [
    {
        name: 'jitar-only',
        display: 'None',
        color: yellow
    },
    {
        name: 'vue',
        display: 'Vue',
        color: green
    },
    {
        name: 'react',
        display: 'React',
        color: cyan
    }
];

export { Frameworks };
