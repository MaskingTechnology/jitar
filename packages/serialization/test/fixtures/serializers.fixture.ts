
import Serializer from '../../src/Serializer';
import ValueSerializer from '../../src/ValueSerializer';

class FirstSerializer extends ValueSerializer
{
    canSerialize(value: unknown): boolean { return true; }

    canDeserialize(value: unknown): boolean { return true; }

    async serialize(value: unknown): Promise<number> { return 1; }

    async deserialize(value: unknown): Promise<number> { return 1; }
}

class SecondSerializer extends ValueSerializer
{
    canSerialize(value: unknown): boolean { return true; }

    canDeserialize(value: unknown): boolean { return true; }

    async serialize(value: unknown): Promise<number> { return 2; }

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

const overrideSerializer = new Serializer();
overrideSerializer.addSerializer(new FirstSerializer());
overrideSerializer.addSerializer(new SecondSerializer());

const typeSerializer = new Serializer();
typeSerializer.addSerializer(new NumberSerializer());
typeSerializer.addSerializer(new StringSerializer());

export const SERIALIZERS =
{
    OVERRIDE: overrideSerializer,
    TYPE: typeSerializer
};
