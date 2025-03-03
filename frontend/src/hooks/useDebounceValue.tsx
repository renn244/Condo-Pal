import { useEffect, useState } from "react"

const useDebounceValue = (value: any, delay: number) => {
    const [debounceValue, setDebounceValue] = useState<any>()

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debounceValue
}

export default useDebounceValue