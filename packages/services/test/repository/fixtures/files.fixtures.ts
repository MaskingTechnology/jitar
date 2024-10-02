
import { File } from '@jitar/sourcing';

export const FILES =
{
    HTML: new File('index.html', 'text/html', Buffer.from('Hello, world!')),
    PNG: new File('logo.png', 'image/png', Buffer.from('Fake image'))
};
