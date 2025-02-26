import { Prisma } from "@prisma/client";

type PrismaError = Prisma.PrismaClientKnownRequestError
type ErrorType = {
    field: string;
    message: string[];
}[]

const handlePrismaErrorsCode = (propertyName: any, code: PrismaError['code']) => {
    // add more error codes later on 
    // https://www.prisma.io/docs/orm/reference/error-reference
    const messageToCode: Record<string, string> = {
        'P2000': `${propertyName} is too long. Please shorten it.`,
        'P2001': `Could not find with ${propertyName}`,
        'P2002': `${propertyName} already exists.`,
        'P2003': `${propertyName} does not exist anymore`, // not sure if this is proper implementation
        'P2025': `${propertyName} not found.`,
    }

    return messageToCode[code] || 'unknown error';
}

const handlePrismaExceptionErrors = (exception: PrismaError) => {
    let errors: ErrorType | undefined = undefined;
    
    return errors = Array.isArray(exception?.meta?.target) ? exception.meta.target.map((err) => {
        return {
            field: err,
            message: [
                handlePrismaErrorsCode(err, exception.code)
            ]
        }
    }) : [
        {
            field: exception?.meta?.modelName || "Unkown",
            message: [
                handlePrismaErrorsCode(exception?.meta?.modelName, exception.code)
            ]
        },
    ];
}

export default handlePrismaExceptionErrors;