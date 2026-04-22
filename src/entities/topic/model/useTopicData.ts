import { useQuery } from '@tanstack/react-query';
import { 
    fetchTopicData, 
    fetchTopicPoints, 
    processCoordinatesToHull, 
    processCoordinatesToSquares,
    chartUtils 
} from '@/shared'; 
import type { ChartDataNode, TopicDataResponse } from '@/shared/types/types';
import { useEffect, useMemo, useState, useRef, useCallback } from 'react';

export const useTopicData = (selectedTopicId: number | null, mode: "hull" | "square" = "hull") => {
    const [topicsDataAndPointsRefetchInterval, setTopicsDataAndPointsRefetchInterval] = useState<number | false>(10000);
    const [configCheckInterval, setConfigCheckInterval] = useState(30000);
    const configTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    
    const loadConfig = useCallback(async () => {
        try {
            const response = await fetch(`/config.json?t=${Date.now()}`);
            if (!response.ok) throw new Error("Config not found");
            const config = await response.json();
            
            setTopicsDataAndPointsRefetchInterval(config.TOPIC_FULLDATA_REFETCH_INTERVAL);
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

    const query = useQuery<TopicDataResponse>({
        queryKey: ['topicData', selectedTopicId],
        queryFn: async () => fetchTopicData(selectedTopicId!),
        enabled: !!selectedTopicId,
        refetchInterval: topicsDataAndPointsRefetchInterval,
    });

    const pointsQuery = useQuery<[number, number][]>({
        queryKey: ['topicPoints', selectedTopicId],
        queryFn: async () => fetchTopicPoints(selectedTopicId!),
        enabled: !!selectedTopicId,
        refetchInterval: topicsDataAndPointsRefetchInterval,
    });

    const { refetch: refetchData } = query;
    const { refetch: refetchPoints } = pointsQuery;

    useEffect(() => {
        if (selectedTopicId) {
            refetchData();
            refetchPoints();
        }
    }, [topicsDataAndPointsRefetchInterval, selectedTopicId, refetchData, refetchPoints]);

    // Добавь этот реф в начало хука useTopicData
    const lastLoggedDataRef = useRef<string | null>(null);

    useEffect(() => {
        // 1. Создаем уникальный "отпечаток" текущего состояния данных
        const currentDataFingerprint = JSON.stringify({
            id: selectedTopicId,
            data: query.data,
            points: pointsQuery.data
        });

        // 2. Условия для выхода: данные еще не загружены ИЛИ мы это уже логировали
        if (!query.isSuccess || !pointsQuery.isSuccess || lastLoggedDataRef.current === currentDataFingerprint) {
            return;
        }

        // 3. Логика проверки данных топика и графика
        const isTopicDataEmpty = !query.data || (Array.isArray(query.data) && query.data.length === 0);
        let isChartDataEmpty = false;

        if (!isTopicDataEmpty && query.data) {
            console.log("Данные топика получены: ", query.data);
            try {
                const processed = chartUtils(query.data);
                isChartDataEmpty = !processed || processed.length === 0;
                
                if (!isChartDataEmpty) {
                    console.log("График сформирован: ", processed);
                }
            } catch (e) {
                console.error("Ошибка при расчете графика для лога:", e);
                isChartDataEmpty = true;
            }
        }

        // --- НОВОЕ: Единый warn, если данных нет или график пуст ---
        if (isTopicDataEmpty || isChartDataEmpty) {
            console.warn(`Данные (data) отсутствуют для ID: ${selectedTopicId}`);
        }

        // 4. Логика координат (points)
        if (!pointsQuery.data || pointsQuery.data.length === 0) {
            console.warn(`Данные (points) отсутствуют для ID: ${selectedTopicId}`);
        } else {
            try {
                let displayPoints = pointsQuery.data;
                if (typeof displayPoints === 'string') {
                    displayPoints = JSON.parse(`[${displayPoints}]`);
                }
                console.log('Координаты успешно распарсены: ', displayPoints);
            } catch (e) {
                console.error("Ошибка парсинга координат:", e);
            }
        }

        // Обновляем реф, чтобы заблокировать повторы до изменения данных
        lastLoggedDataRef.current = currentDataFingerprint;

}, [query.data, query.isSuccess, pointsQuery.data, pointsQuery.isSuccess, selectedTopicId]);

    const result = useMemo(() => {
        const data = query.data;
        const pointsData = pointsQuery.data;

        if (!data || !pointsData) {
            return { mergedGeoJSON: null, chartData: [] as ChartDataNode[] };
        }

        let processedChartData: ChartDataNode[] = [];
        let processedGeoJSON = null;

        try {
            processedChartData = chartUtils(data);
        } catch (err) {
            console.error("Ошибка при обработке данных графика:", err);
        }

        try {
            const rawCoords = pointsData;
            let parsedCoords: [number, number][] = [];

            if (Array.isArray(rawCoords)) {
                parsedCoords = rawCoords;
            } else if (typeof rawCoords === 'string') {
                const validJsonString = `[${rawCoords}]`;
                parsedCoords = JSON.parse(validJsonString);
            }

            if (parsedCoords.length > 0) {
                if (mode === "square") {
                    processedGeoJSON = processCoordinatesToSquares(parsedCoords);
                } else {
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
    }, [query.data, pointsQuery.data, mode]);

    useEffect(() => {
        if (query.error) console.error("Ошибка при получении TopicData: ", query.error);
        if (pointsQuery.error) console.error("Ошибка при получении Points: ", pointsQuery.error);
    }, [query.error, pointsQuery.error]);

    return { 
        mergedGeoJSON: result.mergedGeoJSON, 
        loadingTopicData: query.isLoading || pointsQuery.isLoading, 
        chartData: result.chartData,
        error: query.error || pointsQuery.error 
    };
}