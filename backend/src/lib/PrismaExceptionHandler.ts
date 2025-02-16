import { Prisma } from "@prisma/client";

type PrismaError = Prisma.PrismaClientKnownRequestError
type ErrorType = {
    field: string;
    message: string[];
}[]

const handlePrismaErrorsCode = (properyName: any, code: PrismaError['code']) => {
    const messageToCode: Record<string, string> = {
        'P2002': `${properyName} already exists`,
        'P2025': `${properyName} not found`,
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
    }) : undefined;
}

export default handlePrismaExceptionErrors;