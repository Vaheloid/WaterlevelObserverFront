import type { DataPoint, ProcessedDataPoint } from "@/utils/types";



export const calculateEMA = (
    data: DataPoint[], 
    windowSize: number = 7, 
    smoothing: number = 2, 
    slopeFactor: number = 1
): ProcessedDataPoint[] => {
    if (data.length === 0) {
        return [];
    }

    const emaData: ProcessedDataPoint[] = [];
    const alpha: number = smoothing / (windowSize + 1);
    const dataValues: number[] = data.map(item => parseFloat(item.Value_Data));
    
    let ema: number = dataValues[0];

    emaData.push({ Value_Data: null, Time_Data: data[0].Time_Data });

    for (let i = 1; i < dataValues.length; i++) {
        if (i < windowSize - 1) {
            emaData.push({ Value_Data: null, Time_Data: data[i].Time_Data });
        } else {
            ema = alpha * dataValues[i] + (1 - alpha) * ema;
            emaData.push({ Value_Data: ema, Time_Data: data[i].Time_Data });
        }
    }

    const lastValues: number[] = dataValues.slice(-windowSize);
    const lastTimes: number[] = data.slice(-windowSize).map(item => item.Time_Data);
    const lastEMA: number = ema;

    if (lastTimes.length > 1) {
        const timeIntervals: number[] = lastTimes.slice(1).map((time, index) => time - lastTimes[index]);
        const averageTimeInterval: number = timeIntervals.reduce((acc, val) => acc + val, 0) / timeIntervals.length;
        
        const slope: number = (lastValues[lastValues.length - 1] - lastValues[0]) / (windowSize - 1);

        for (let i = 0; i < 3; i++) {
            const predictedValue: number = lastEMA + slope * ((i + 1) * slopeFactor);
            const predictedTime: number = lastTimes[lastTimes.length - 1] + averageTimeInterval * (i + 1);
            emaData.push({ Value_Data: predictedValue, Time_Data: predictedTime });
        }
    }

    return emaData;
};