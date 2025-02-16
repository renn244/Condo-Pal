import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

/** 
 * Decorator that checks if the property is equal to another property
 * @param property string the property name that is being compared to
 */

export function Match(property: string, validationOptions?: ValidationOptions) {
    return function(object: Object, propertyName: string) {
        registerDecorator({
            name: 'Match',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName];
                    // the property name is the name that is provided in the front section
                    const anotherValueToCompare = args.object[propertyName];


                    if(!(typeof relatedValue == 'string') && !(typeof anotherValueToCompare == 'string')) {
                        args.constraints.push('TypeMismatch');
                        return false
                    }
                    
                    return relatedValue === anotherValueToCompare;
                },
                defaultMessage(args: ValidationArguments) {
                    if(args.constraints.includes('TypeMismatch')) {
                        return `${args.property} and ${args.constraints[0]} does not match types`
                    }
                    return `${args.property} and ${args.constraints[0]} do not match`;
                }
            }
        })
    }
}