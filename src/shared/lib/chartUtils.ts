// import { calculateEMA } from '@/shared';
import type { ChartDataNode, TopicDataItem, EMAItem, PredictionItem } from '../types/types';

export function chartUtils(
    rawData: TopicDataItem[] = [],
    emaData: EMAItem[] = [],
    predictionData: PredictionItem[] = []
): ChartDataNode[] {
    if (!rawData || rawData.length === 0) {
        return [];
    }

    const timeline = new Map<number, { v?: number; e?: number; p?: number }>();

    // // Если данных из API (EMA/Prediction) нет, используем старую логику расчета
    // if (emaData.length === 0 && predictionData.length === 0) {
    //     const localEmaCalculated = calculateEMA(rawData, 7, 2, 2);
        
    //     return localEmaCalculated.map((emaItem, index) => {
    //         const date = new Date(emaItem.time_data);
    //         const formatted = date.toLocaleString('ru-RU', {
    //             day: '2-digit', month: '2-digit', year: 'numeric',
    //             hour: '2-digit', minute: '2-digit', second: '2-digit',
    //             timeZone: 'UTC',
    //         });

    //         return {
    //             time: formatted, // Теперь здесь строка времени
    //             displayTime: formatted,
    //             value: rawData[index] ? parseFloat(rawData[index].value_data) : null,
    //             ema: emaItem.value_data,
    //             prediction: null,
    //         };
    //     });
    // }

    // Обработка данных из API (как на ваших скриншотах)
    rawData.forEach(item => {
        const ts = new Date(item.time_data).getTime();
        timeline.set(ts, { ...timeline.get(ts), v: parseFloat(item.value_data) });
    });

    emaData.forEach(item => {
        const ts = new Date(item.time_ema).getTime();
        timeline.set(ts, { ...timeline.get(ts), e: parseFloat(item.value_ema) });
    });

    predictionData.forEach(item => {
        const ts = new Date(item.time_prediction).getTime();
        timeline.set(ts, { ...timeline.get(ts), p: parseFloat(item.value_prediction) });
    });

    const sortedTimestamps = Array.from(timeline.keys()).sort((a, b) => a - b);

    return sortedTimestamps.map(ts => {
        const date = new Date(ts);
        const data = timeline.get(ts)!;
        const formatted = date.toLocaleString('ru-RU', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            timeZone: 'UTC',
        });

        return {
            displayTime: formatted,
            value: data.v ?? null,
            ema: data.e ?? null,
            prediction: data.p ?? null,
        };
    });
}