
import { cyan, green, magenta, red, yellow, blue } from 'kolorist';

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
    },
    {
        name: 'solid',
        display: 'SolidJS',
        color: blue
    },
    {
        name: 'lit',
        display: 'Lit',
        color: magenta
    },
    {
        name: 'svelte',
        display: 'Svelte',
        color: red
    }
];

export { Frameworks };
