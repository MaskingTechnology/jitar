
import Serializer from './Serializer';
import ClassResolver from './interfaces/ClassResolver';
import ArraySerializer from './serializers/ArraySerializer';
import BigIntSerializer from './serializers/BigIntSerializer';
import BufferSerializer from './serializers/BufferSerializer';
import ClassSerializer from './serializers/ClassSerializer';
import DateSerializer from './serializers/DateSerializer';
import ErrorSerializer from './serializers/ErrorSerializer';
import MapSerializer from './serializers/MapSerializer';
import ObjectSerializer from './serializers/ObjectSerializer';
import PrimitiveSerializer from './serializers/PrimitiveSerializer';
import RegExpSerializer from './serializers/RegExpSerializer';
import SetSerializer from './serializers/SetSerializer';
import TypedArraySerializer from './serializers/TypedArraySerializer';
import UrlSerializer from './serializers/UrlSerializer';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class SerializerBuilder
{
    public static build(classResolver?: ClassResolver): Serializer
    {
        const serializer = new Serializer();
        
        serializer.addSerializer(new PrimitiveSerializer());
        serializer.addSerializer(new ObjectSerializer());

        if (classResolver !== undefined)
        {
            serializer.addSerializer(new ClassSerializer(classResolver));
        }

        serializer.addSerializer(new ErrorSerializer());
        serializer.addSerializer(new RegExpSerializer());
        serializer.addSerializer(new BigIntSerializer());
        serializer.addSerializer(new UrlSerializer());
        serializer.addSerializer(new DateSerializer());
        serializer.addSerializer(new SetSerializer());
        serializer.addSerializer(new MapSerializer());
        serializer.addSerializer(new ArraySerializer());
        serializer.addSerializer(new TypedArraySerializer());

        if (typeof Buffer !== 'undefined')
        {
            serializer.addSerializer(new BufferSerializer());
        }

        return serializer;
    }
}
