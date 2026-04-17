import { useQuery } from '@tanstack/react-query';
import { fetchTopicData, fetchTopicPoints } from '@/utils/api.ts'; 
import { processCoordinatesToHull } from '@/utils/geoUtils.ts';
import { chartUtils } from '@/utils/chartUtils';
import type { ChartDataNode, TopicDataResponse } from '@/utils/types';
import { useEffect, useMemo, useState, useRef, useCallback } from 'react';

export function useTopicData(selectedTopicId: number | null) {
    // Состояния для динамического конфига
    const [topicsDataAndPointsRefetchInterval, setTopicsDataAndPointsRefetchInterval] = useState<number | false>(10000);
    const [configCheckInterval, setConfigCheckInterval] = useState(30000);
    const configTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Загрузка конфига
    const loadConfig = useCallback(async () => {
        try {
            const response = await fetch(`/config.json?t=${Date.now()}`);
            if (!response.ok) throw new Error("Config not found");
            const config = await response.json();
            
            setTopicsDataAndPointsRefetchInterval(config.TOPICS_FULLDATA_REFETCH_INTERVAL);
            setConfigCheckInterval(config.CONFIG_CHECK_INTERVAL);
        } catch (error) {
            console.error("Ошибка загрузки конфига в useTopicData:", error);
        } finally {
            configTimerRef.current = setTimeout(loadConfig, configCheckInterval);
        }
    }, [configCheckInterval]);

    useEffect(() => {
        loadConfig();
        return () => {
            if (configTimerRef.current) clearTimeout(configTimerRef.current);
        };
    }, [loadConfig]);

    // 1. Основной запрос (график + старые поля)
    const query = useQuery<TopicDataResponse>({
        queryKey: ['topicData', selectedTopicId],
        queryFn: async () => {
            return await fetchTopicData(selectedTopicId!);
        },
        enabled: !!selectedTopicId,
        refetchInterval: topicsDataAndPointsRefetchInterval,
    });

    // 2. Новый запрос для точек (координаты)
    const pointsQuery = useQuery<[number, number][]>({
        queryKey: ['topicPoints', selectedTopicId],
        queryFn: async () => {
            return await fetchTopicPoints(selectedTopicId!);
        },
        enabled: !!selectedTopicId,
        refetchInterval: topicsDataAndPointsRefetchInterval,
    });

    const { refetch: refetchData } = query;
    const { refetch: refetchPoints } = pointsQuery;

    // Мгновенное обновление при смене интервала
    useEffect(() => {
        if (selectedTopicId) {
            refetchData();
            refetchPoints();
        }
    }, [topicsDataAndPointsRefetchInterval, selectedTopicId, refetchData, refetchPoints]);

    const result = useMemo(() => {
        const data = query.data;
        const pointsData = pointsQuery.data;

        if (!data || !pointsData) {
            return { mergedGeoJSON: null, chartData: [] as ChartDataNode[] };
        }

        console.log("Данные топика: ", data);

        let processedChartData: ChartDataNode[] = [];
        let processedGeoJSON = null;

        try {
            processedChartData = chartUtils(data); 
        } catch (err) {
            console.error("Ошибка при обработке данных графика:", err);
        }

        try {
            const rawCoords = pointsQuery.data;
            
            if (rawCoords) {
                let parsedCoords: [number, number][] = [];

                if (Array.isArray(rawCoords)) {
                    parsedCoords = rawCoords;
                } else if (typeof rawCoords === 'string') {
                    const validJsonString = `[${rawCoords}]`;
                    parsedCoords = JSON.parse(validJsonString);
                }

                if (parsedCoords.length > 0) {
                    console.log('Координаты точек затопления успешно распарсены:', parsedCoords);
                    processedGeoJSON = processCoordinatesToHull(parsedCoords);
                }
            }
        } catch (err) {
            console.error('Ошибка при парсинге геометрии:', err);
        }

        return {
            mergedGeoJSON: processedGeoJSON,
            chartData: processedChartData
        };
    }, [query.data, pointsQuery.data]);

    useEffect(() => {
        if (query.error) {
            console.error("Ошибка при получении TopicData: ", query.error);
        }
        if (pointsQuery.error) {
            console.error("Ошибка при получении Points: ", pointsQuery.error);
        }
    }, [query.error, pointsQuery.error]);

    return { 
        mergedGeoJSON: result.mergedGeoJSON, 
        loadingTopicData: query.isLoading || pointsQuery.isLoading, 
        chartData: result.chartData,
        error: query.error || pointsQuery.error 
    };
}