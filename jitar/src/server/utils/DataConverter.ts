
import { ClassConstructor, plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';

export default class DataConverter
{
    static async convert<Type extends Object>(targetClass: ClassConstructor<Type>, dataObject: object): Promise<Type>
    {
        const createdObject: Type = plainToClass(targetClass, dataObject);

        await validateOrReject(createdObject);

        return createdObject;
    }
}
