import type { DataPoint, ProcessedDataPoint } from "@/utils/types";

export const calculateEMA = (
    data: DataPoint[], 
    windowSize: number = 7, 
    smoothing: number = 2, 
    slopeFactor: number = 1
): ProcessedDataPoint[] => {
    if (data.length === 0) return [];

    const emaData: ProcessedDataPoint[] = [];
    const alpha: number = smoothing / (windowSize + 1);
    const dataValues: number[] = data.map(item => parseFloat(item.value_data));
    
    let ema: number = dataValues[0];

    // Первая точка
    emaData.push({ value_data: null, time_data: data[0].time_data });

    for (let i = 1; i < dataValues.length; i++) {
        if (i < windowSize - 1) {
            emaData.push({ value_data: null, time_data: data[i].time_data });
        } else {
            ema = alpha * dataValues[i] + (1 - alpha) * ema;
            emaData.push({ value_data: ema, time_data: data[i].time_data });
        }
    }

    // --- РАСЧЕТ ПРЕДСКАЗАНИЯ ---
    const lastSlice = data.slice(-windowSize);
    // Преобразуем строковые даты в числа (timestamp в мс)
    const lastTimesMs: number[] = lastSlice.map(item => new Date(item.time_data).getTime());
    const lastEMA: number = ema;

    if (lastTimesMs.length > 1) {
        // Расчет интервалов теперь работает с числами
        const timeIntervals: number[] = lastTimesMs.slice(1).map((time, index) => time - lastTimesMs[index]);
        const averageTimeInterval: number = timeIntervals.reduce((acc, val) => acc + val, 0) / timeIntervals.length;
        
        const lastValues = dataValues.slice(-windowSize);
        const slope: number = (lastValues[lastValues.length - 1] - lastValues[0]) / (windowSize - 1);

        for (let i = 0; i < 3; i++) {
            const predictedValue: number = lastEMA + (slope * (i + 1) * slopeFactor);
            // Добавляем интервал к последнему числу (timestamp)
            const predictedTimestamp: number = lastTimesMs[lastTimesMs.length - 1] + (averageTimeInterval * (i + 1));
            
            // Сохраняем как число (new Date() в chartUtils это поймет)
            emaData.push({ 
                value_data: predictedValue, 
                time_data: predictedTimestamp // Кастуем к any, так как в типах может быть string
            });
        }
    }

    return emaData;
};