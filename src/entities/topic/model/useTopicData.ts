import { useQuery } from '@tanstack/react-query';
import { 
    fetchTopicData, 
    fetchTopicEma, 
    fetchTopicPrediction, 
    fetchTopicPoints, 
    processCoordinatesToHull, 
    processCoordinatesToSquares,
    chartUtils 
} from '@/shared'; 
import type { ChartDataNode, TopicDataResponse, EMAItem, PredictionItem } from '@/shared/types/types';
import { useEffect, useMemo, useState, useRef, useCallback } from 'react';

export const useTopicData = (selectedTopicId: number | null, mode: "hull" | "square" = "hull") => {
    // Состояние интервалов из второй версии
    const [topicsDataAndPointsRefetchInterval, setTopicsDataAndPointsRefetchInterval] = useState<number | false>(10000);
    const [configCheckInterval, setConfigCheckInterval] = useState(30000);
    const configTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    
    // Загрузка конфига
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

    // Запросы из первой версии, адаптированные под динамический интервал
    const query = useQuery<TopicDataResponse>({
        queryKey: ['topicData', selectedTopicId],
        queryFn: async () => fetchTopicData(selectedTopicId!),
        enabled: !!selectedTopicId,
        refetchInterval: topicsDataAndPointsRefetchInterval,
    });

    const emaQuery = useQuery<EMAItem[]>({
        queryKey: ['topicEma', selectedTopicId],
        queryFn: async () => fetchTopicEma(selectedTopicId!),
        enabled: !!selectedTopicId,
        refetchInterval: topicsDataAndPointsRefetchInterval,
    });

    const predictionQuery = useQuery<PredictionItem[]>({
        queryKey: ['topicPrediction', selectedTopicId],
        queryFn: async () => fetchTopicPrediction(selectedTopicId!),
        enabled: !!selectedTopicId,
        refetchInterval: topicsDataAndPointsRefetchInterval,
    });

    const pointsQuery = useQuery<[number, number][]>({
        queryKey: ['topicPoints', selectedTopicId],
        queryFn: async () => fetchTopicPoints(selectedTopicId!),
        enabled: !!selectedTopicId,
        refetchInterval: topicsDataAndPointsRefetchInterval,
    });

    // Ручной рефетч при смене ID или интервала
    useEffect(() => {
        if (selectedTopicId) {
            query.refetch();
            emaQuery.refetch();
            predictionQuery.refetch();
            pointsQuery.refetch();
        }
    }, [topicsDataAndPointsRefetchInterval, selectedTopicId, query, emaQuery, predictionQuery, pointsQuery]);

    // Логирование из второй версии
    const lastLoggedDataRef = useRef<string | null>(null);

    useEffect(() => {
        const currentDataFingerprint = JSON.stringify({
            id: selectedTopicId,
            data: query.data,
            points: pointsQuery.data,
            ema: emaQuery.data,
            prediction: predictionQuery.data
        });

        if (!query.isSuccess || !pointsQuery.isSuccess || lastLoggedDataRef.current === currentDataFingerprint) {
            return;
        }

        const isTopicDataEmpty = !query.data || (Array.isArray(query.data) && query.data.length === 0);
        let isChartDataEmpty = false;

        if (!isTopicDataEmpty && query.data) {
            console.log("Данные топика получены: ", query.data);
            try {
                // Передаем все три массива для проверки формирования графика в логах
                const processed = chartUtils(query.data, emaQuery.data, predictionQuery.data);
                isChartDataEmpty = !processed || processed.length === 0;
                
                if (!isChartDataEmpty) {
                    console.log("График сформирован: ", processed);
                }
            } catch (e) {
                console.error("Ошибка при расчете графика для лога:", e);
                isChartDataEmpty = true;
            }
        }

        if (isTopicDataEmpty || isChartDataEmpty) {
            console.warn(`Данные (data) отсутствуют для ID: ${selectedTopicId}`);
        }

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

        lastLoggedDataRef.current = currentDataFingerprint;
    }, [query.data, query.isSuccess, pointsQuery.data, pointsQuery.isSuccess, emaQuery.data, predictionQuery.data, selectedTopicId]);

    // Объединенный useMemo
    const result = useMemo(() => {
        const data = query.data;
        const emaData = emaQuery.data;
        const predData = predictionQuery.data;
        const pointsData = pointsQuery.data;

        // Если нет никаких данных для графика, возвращаем пустоту
        if (!data && !emaData && !predData) {
            return { mergedGeoJSON: null, chartData: [] as ChartDataNode[] };
        }

        let processedChartData: ChartDataNode[] = [];
        let processedGeoJSON = null;

        try {
            // Используем chartUtils с тремя аргументами
            processedChartData = chartUtils(data || [], emaData || [], predData || []);
        } catch (err) {
            console.error("Ошибка при обработке данных графика:", err);
        }

        try {
            if (pointsData) {
                const rawCoords = pointsData;
                let parsedCoords: [number, number][] = [];

                if (Array.isArray(rawCoords)) {
                    parsedCoords = rawCoords;
                } else if (typeof rawCoords === 'string') {
                    const validJsonString = `[${rawCoords}]`;
                    parsedCoords = JSON.parse(validJsonString);
                }

                if (parsedCoords.length > 0) {
                    processedGeoJSON = mode === "square" 
                        ? processCoordinatesToSquares(parsedCoords) 
                        : processCoordinatesToHull(parsedCoords);
                }
            }
        } catch (err) {
            console.error('Ошибка при парсинге геометрии:', err);
        }

        return {
            mergedGeoJSON: processedGeoJSON,
            chartData: processedChartData
        };
    }, [query.data, emaQuery.data, predictionQuery.data, pointsQuery.data, mode]);

    // Ошибки
    useEffect(() => {
        if (query.error) console.error("Ошибка при получении TopicData: ", query.error);
        if (emaQuery.error) console.error("Ошибка при получении EMA: ", emaQuery.error);
        if (predictionQuery.error) console.error("Ошибка при получении Prediction: ", predictionQuery.error);
        if (pointsQuery.error) console.error("Ошибка при получении Points: ", pointsQuery.error);
    }, [query.error, emaQuery.error, predictionQuery.error, pointsQuery.error]);

    return { 
        mergedGeoJSON: result.mergedGeoJSON, 
        loadingTopicData: query.isLoading || emaQuery.isLoading || predictionQuery.isLoading || pointsQuery.isLoading, 
        chartData: result.chartData,
        error: query.error || emaQuery.error || predictionQuery.error || pointsQuery.error 
    };
}