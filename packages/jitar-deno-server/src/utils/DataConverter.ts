
import { plainToClass } from 'npm:class-transformer@^0.5.1';
import { validateOrReject } from 'npm:class-validator@^0.13.2';

export declare type ClassConstructor<T> = {
    new(...args: unknown[]): T;
};

export default class DataConverter
{
    static async convert<Type extends Object>(targetClass: ClassConstructor<Type>, dataObject: object): Promise<Type>
    {
        const createdObject: Type = plainToClass(targetClass, dataObject);

        await validateOrReject(createdObject);

        return createdObject;
    }
}
