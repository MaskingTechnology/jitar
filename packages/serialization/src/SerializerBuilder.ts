
import Serializer from './Serializer.js';
import ClassLoader from './interfaces/ClassLoader.js';
import ArraySerializer from './serializers/ArraySerializer.js';
import BigIntSerializer from './serializers/BigIntSerializer.js';
import ClassSerializer from './serializers/ClassSerializer.js';
import DateSerializer from './serializers/DateSerializer.js';
import ErrorSerializer from './serializers/ErrorSerializer.js';
import MapSerializer from './serializers/MapSerializer.js';
import ObjectSerializer from './serializers/ObjectSerializer.js';
import PrimitiveSerializer from './serializers/PrimitiveSerializer.js';
import RegExpSerializer from './serializers/RegExpSerializer.js';
import SetSerializer from './serializers/SetSerializer.js';
import TypedArraySerializer from './serializers/TypedArraySerializer.js';
import UrlSerializer from './serializers/UrlSerializer.js';
import DefaultClassLoader from './DefaultClassLoader.js';

const defaultClassLoader = new DefaultClassLoader();

export default class SerializerBuilder
{
    public static build(loader: ClassLoader = defaultClassLoader): Serializer
    {
        const serializer = new Serializer();
        serializer.addSerializer(new PrimitiveSerializer());
        serializer.addSerializer(new ObjectSerializer());
        serializer.addSerializer(new ClassSerializer(loader));
        serializer.addSerializer(new ErrorSerializer());
        serializer.addSerializer(new RegExpSerializer());
        serializer.addSerializer(new BigIntSerializer());
        serializer.addSerializer(new UrlSerializer());
        serializer.addSerializer(new DateSerializer());
        serializer.addSerializer(new SetSerializer());
        serializer.addSerializer(new MapSerializer());
        serializer.addSerializer(new ArraySerializer());
        serializer.addSerializer(new TypedArraySerializer());

        return serializer;
    }
}
