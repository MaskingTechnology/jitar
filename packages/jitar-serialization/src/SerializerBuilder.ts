
import Serializer from './Serializer.js';
import ClassLoader from './interfaces/ClassLoader.js';
import ObjectSerializer from './serializers/ObjectSerializer.js';
import ClassSerializer from './serializers/ClassSerializer.js';
import DateSerializer from './serializers/DateSerializer.js';
import SetSerializer from './serializers/SetSerializer.js';
import MapSerializer from './serializers/MapSerializer.js';
import ArraySerializer from './serializers/ArraySerializer.js';
import ArrayBufferSerializer from './serializers/ArrayBufferSerializer.js';
import ErrorSerializer from './serializers/ErrorSerializer.js';

export default class SerializerBuilder
{
    public static build(loader: ClassLoader): Serializer
    {
        const serializer = new Serializer();
        serializer.addSerializer(new ObjectSerializer());
        serializer.addSerializer(new ClassSerializer(loader));
        serializer.addSerializer(new ErrorSerializer(loader));
        serializer.addSerializer(new DateSerializer());
        serializer.addSerializer(new SetSerializer());
        serializer.addSerializer(new MapSerializer());
        serializer.addSerializer(new ArraySerializer());
        serializer.addSerializer(new ArrayBufferSerializer());

        return serializer;
    }
}
