import { useQuery } from '@tanstack/react-query';
import { fetchTopicData } from '@/utils/api.ts';
import { processCoordinatesToHull } from '@/utils/geoUtils.ts';
import { chartUtils } from '@/utils/chartUtils';
import type { ChartDataNode, TopicApiResponse } from '@/utils/types';
import { useEffect, useMemo } from 'react';

export function useTopicData(selectedTopicId: number | null) {
    const query = useQuery<TopicApiResponse>({
        queryKey: ['topicData', selectedTopicId],
        queryFn: async () => {
            return await fetchTopicData(selectedTopicId!);
        },
        enabled: !!selectedTopicId,
        refetchInterval: 10000,
    });

    const result = useMemo(() => {
        const data = query.data;
        if (!data) {
            return { mergedGeoJSON: null, chartData: [] as ChartDataNode[] };
        }

        console.log("Данные топика", data);

        let processedChartData: ChartDataNode[] = [];
        let processedGeoJSON = null;

        try {
            processedChartData = chartUtils(data); 
        } catch (err) {
            console.error("Ошибка при обработке данных графика:", err);
        }

        try {
            const rawCoordsString = data.Depression_AreaPoints?.[0];
            if (rawCoordsString) {
                console.log('Парсинг успешен:', data.Depression_AreaPoints);
                console.log('Полигоны отображены с данными текущего топика');
                processedGeoJSON = processCoordinatesToHull(rawCoordsString);
            } else {
                console.error('Depression_AreaPoints не является массивом после парсинга');
            }
        } catch (err) {
            console.error('Ошибка при парсинге Depression_AreaPoints:', err);
        }

        return {
            mergedGeoJSON: processedGeoJSON,
            chartData: processedChartData
        };
    }, [query.data]);

    useEffect(() => {
        if (query.error) {
            console.error("Ошибка при получении данных: ", query.error);
        }
    }, [query.error]);

    return { 
        mergedGeoJSON: result.mergedGeoJSON, 
        loadingTopicData: query.isLoading, 
        chartData: result.chartData,
        error: query.error 
    };
}