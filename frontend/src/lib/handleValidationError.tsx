import { AxiosResponse } from "axios";
import { UseFormSetError } from "react-hook-form";
import toast from "react-hot-toast";

export class ValidationError extends Error {
    response: AxiosResponse<any, any>
    constructor(response: AxiosResponse<any, any>) {
        super(response.data.messag)
        this.response = response;
    }
}

const handleValidationError = (response: any, errors: any, setError: UseFormSetError<any>) => {
    if(!errors) {
        toast.error(response.data.message)
        return
    }

    response.data.errors.forEach((error: any) => {
        setError(error.field, {
            type: "manual",
            message: error.message?.[0]
        })
    })
    
    return
}

export default handleValidationError