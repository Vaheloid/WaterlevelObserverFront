import { calculateEMA } from '@/utils/other_scripts.ts';
import type { ChartDataNode, TopicApiResponse } from '@/utils/types.ts';

export function chartUtils(data: TopicApiResponse): ChartDataNode[] {
    const rawDataFromApi = data.Data;

    const emaCalculated = calculateEMA(rawDataFromApi, 7, 2, 2);

    const chartDataWithEMA: ChartDataNode[] = emaCalculated.map((emaItem, index) => {
        const date = new Date(emaItem.Time_Data * 1000);

        const formattedDate = date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
        const formattedTime = date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });

        const originalValue = rawDataFromApi[index] 
            ? parseFloat(rawDataFromApi[index].Value_Data) 
            : null;

        return {
            time: `${formattedDate} ${formattedTime}`,
            value: originalValue,
            ema: emaItem.Value_Data,
        };
    });

    if (!data.Depression_AreaPoints || data.Depression_AreaPoints.length === 0) {
        console.warn("Нет данных для текущего топика");
    } else {
        console.log("Данные топика", data);
        console.log("Средняя скользящая", emaCalculated);
        console.log("Диаграмма отображена с данными текущего топика");
    }

    return chartDataWithEMA;
}