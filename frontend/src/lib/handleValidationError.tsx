import { UseFormSetError } from "react-hook-form";
import toast from "react-hot-toast";

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