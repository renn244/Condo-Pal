import { Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { UseMutateFunction } from "@tanstack/react-query"
import LoadingSpinner from "./LoadingSpinner"

type PricingCardProps = {
    title: string,
    description: string,
    monthlyPrice: number,
    features: string[],
    mostPopular?: boolean,
    buttonText: string,
    onButtonClick: UseMutateFunction<void, Error, string, unknown>,
    isLoading?: boolean,
}

const PricingCard = ({
    title,
    description,
    monthlyPrice,
    features,
    buttonText,
    mostPopular=false,
    onButtonClick,
    isLoading=false,
}: PricingCardProps) => {
    return (
        <Card className={`relative ${mostPopular ? 'border-blue-200 bg-blue-50' : ''}`}>
            {mostPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-sm rounded-full">
                    Most Popular
                </div>
            )}
            <CardHeader>
                <CardTitle className="text-2xl">
                    {title}
                </CardTitle>
                <CardDescription>
                    {description}
                </CardDescription>
                <div className="mt-4">
                    <span className="text-4xl font-bold">${monthlyPrice}</span>
                    <span className="text-muted-foreground">/month</span>
                </div>
            </CardHeader>
            <CardContent className="h-auto md:h-full max-h-[228px]">
                <ul className="space-y-3">
                    {features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-blue-500" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
                <Button disabled={isLoading} onClick={() => onButtonClick(title)} className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer">
                    {isLoading ? <LoadingSpinner /> : buttonText}
                </Button>  
            </CardFooter>
        </Card>
    )
}

export default PricingCard