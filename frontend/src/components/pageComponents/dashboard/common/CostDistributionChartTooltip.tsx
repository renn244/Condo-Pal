import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"
import { ChartConfig } from "@/components/ui/chart"

type CostDistributionChartTooltipProps = {
    value: ValueType
    name: NameType
    item: any
    index: number,
    chartConfig: ChartConfig,
    payloads: string[];
}

const CostDistributionChartTooltip = ({
    value,
    name,
    item,
    index,
    chartConfig,
    payloads,
}: CostDistributionChartTooltipProps) => {
    const color = (chartConfig as any)[name]?.color;

    const total = payloads.reduce((payload, curr) => item.payload[curr] + payload, 0);

    return (
        <>
            <div className={`h-2.5 w-2.5 shrink-0 rounded-[2px]`} style={{ backgroundColor: color }} />
            {chartConfig[name as keyof typeof chartConfig]?.label || name}
            <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                <span className="font-normal text-muted-foreground">
                    PHP
                </span>
                {value}
            </div>
            {index === 1 && (
                <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
                    Total
                    <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground ">
                        <span className="font-normal text-muted-foreground">
                            PHP
                        </span>
                        {total}
                    </div>
                </div>
            )}
        </>
    )
} 

export default CostDistributionChartTooltip;