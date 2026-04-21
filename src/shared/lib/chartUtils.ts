import { calculateEMA } from '@/shared';
import type { ChartDataNode, TopicDataItem } from '@/shared/types/types';

/**
 * Преобразует сырые данные из API в формат, понятный библиотеке графиков,
 * с расчетом экспоненциальной скользящей средней (EMA).
 */
export function chartUtils(data: TopicDataItem[]): ChartDataNode[] {
    const rawDataFromApi = data;

    if (!rawDataFromApi || rawDataFromApi.length === 0) {
        return [];
    }

    // Расчет EMA
    const emaCalculated = calculateEMA(rawDataFromApi, 7, 2, 2);

    // Маппинг данных
    const chartDataWithEMA: ChartDataNode[] = emaCalculated.map((emaItem, index) => {
        // Конвертируем из наносекунд в миллисекунды
        const timestampMs = emaItem.time_data;
        const date = new Date(timestampMs);

        const formattedDate = date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });

        // ВАЖНО: Добавляем миллисекунды (fractionalSecondDigits), 
        // чтобы Recharts видел разные значения времени
        const formattedTime = date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'UTC',
        });

        // Берем оригинальное значение. 
        // Для предсказанных точек (которых нет в rawDataFromApi) будет null
        const originalValue = rawDataFromApi[index] 
            ? parseFloat(rawDataFromApi[index].value_data) 
            : null;

        const fullUniqueTime = `${formattedDate} ${formattedTime}`; 

        // А это создаем ТОЛЬКО для подписей (без даты и мс)
        const displayTime = date.toLocaleTimeString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'UTC',
        });

        return {
            time: fullUniqueTime, // Recharts использует это для связи точек
            displayTime: displayTime, // Это мы выведем на экран
            value: originalValue,
            ema: emaItem.value_data,
        };
    });

    console.log("График сформирован по текущим данным топика: ", chartDataWithEMA);
    return chartDataWithEMA;
}