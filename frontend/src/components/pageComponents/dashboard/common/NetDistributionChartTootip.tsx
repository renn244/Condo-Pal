import { ChartConfig } from "@/components/ui/chart"
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"

type NetDistributionChartTootipProps = {
    value: ValueType,
    name: NameType,
    item: any,
    index: number,
    chartConfig: ChartConfig,
    
    // keys // Net = values - minusValues 
    values: string[];
    minusValues: string[];
    NetLabel?: string;

    lastIndex: number;
}

const NetDistributionChartTootip = ({
    value, name,
    item, index, 
    chartConfig,
    values, minusValues, NetLabel,
    lastIndex
}: NetDistributionChartTootipProps) => {
    const color = (chartConfig as any)[name]?.color;

    let net: number | undefined = undefined;
    if(index === lastIndex) {
        net = values.reduce((payload, curr) => item.payload[curr] + payload, 0);
        const minus = minusValues.reduce((payload, curr) => item.payload[curr] + payload, 0);
        net = net - minus;
    }

    return (
       <>
            <div className={`h-2.5 w-2.5 shrink-0 rounded-[2px]`} style={{ backgroundColor: color }} />
            {chartConfig[name as keyof typeof chartConfig]?.label || name}
            <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                {value}
                <span className="font-normal text-muted-foreground">
                    PHP
                </span>
            </div>
            {net && (
                <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
                    {NetLabel ? NetLabel : "Net"}
                    <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground ">
                        {net}
                        <span className="font-normal text-muted-foreground">
                        PHP
                        </span>
                    </div>
                </div>
            )}
        </>
    )
}

export default NetDistributionChartTootip