
import SegmentModule from '../../../src/core/types/SegmentModule';

function defaultFunction(): string
{
    return 'default';
}

function anotherFunction(a: string, b: string): string
{
    return a + b;
}

const segmentModule: SegmentModule =
{
    procedures:
        [
            {
                module: '',
                name: 'defaultFunction',
                implementations:
                    [
                        {
                            access: 'public',
                            version: '0.0.0',
                            executable: defaultFunction
                        }
                    ]
            },
            {
                module: '',
                name: 'anotherFunction',
                implementations:
                    [
                        {
                            access: 'public',
                            version: '1.0.0',
                            executable: anotherFunction
                        }
                    ]
            }
        ]
}

export { segmentModule }
