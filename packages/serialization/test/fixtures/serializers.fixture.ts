
import ValueSerializer from '../../src/ValueSerializer';

class FirstSerializer extends ValueSerializer
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    canSerialize(value: unknown): boolean { return true; }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    canDeserialize(value: unknown): boolean { return true; }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async serialize(value: unknown): Promise<number> { return 1; }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async deserialize(value: unknown): Promise<number> { return 1; }
}

class SecondSerializer extends ValueSerializer
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    canSerialize(value: unknown): boolean { return true; }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    canDeserialize(value: unknown): boolean { return true; }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async serialize(value: unknown): Promise<number> { return 2; }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async deserialize(value: unknown): Promise<number> { return 2; }
}

class NumberSerializer extends ValueSerializer
{
    canSerialize(value: unknown): boolean { return typeof value === 'number'; }

    canDeserialize(value: unknown): boolean { return typeof value === 'number'; }

    async serialize(value: number): Promise<number> { return value; }

    async deserialize(value: number): Promise<number> { return value; }
}

class StringSerializer extends ValueSerializer
{
    canSerialize(value: unknown): boolean { return typeof value === 'string'; }

    canDeserialize(value: unknown): boolean { return typeof value === 'string'; }

    async serialize(value: string): Promise<string> { return value; }

    async deserialize(value: string): Promise<string> { return value; }
}

export const SERIALIZERS =
{
    FirstSerializer,
    SecondSerializer,
    NumberSerializer,
    StringSerializer,
};
