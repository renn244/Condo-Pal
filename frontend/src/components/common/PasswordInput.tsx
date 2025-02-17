import { ComponentProps, useState } from "react"
import { Input } from "../ui/input"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"

type InputPasswordProps = {
    className?: string,
    containerClassName?: string,
    eyesClassName?: string,
} & ComponentProps<"input">

const InputPassword = ({
    className,
    containerClassName,
    eyesClassName,
    ...props
}: InputPasswordProps) => {
    const [showPassword, setShowPassword] = useState<boolean>(false)

    return (
        <div className={cn("relative", containerClassName)}>
            <Input {...props} type={showPassword ? "text" : "password"}
            className={cn("pr-9", className)} />
            {
                showPassword ? (
                    <Eye className={cn('absolute right-2 top-2 cursor-pointer', eyesClassName)} 
                    onClick={() => setShowPassword(false)} />
                ) : (
                    <EyeOff className={cn('absolute right-2 top-2 cursor-pointer', eyesClassName)} 
                    onClick={() => setShowPassword(true)} />
                )
            }
        </div>
    )
}

export default InputPassword