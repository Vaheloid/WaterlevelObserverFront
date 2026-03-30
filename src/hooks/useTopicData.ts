import { useState, useEffect, useCallback } from 'react';
import { fetchTopicData } from '@/utils/api.ts';
import { processCoordinatesToHull } from '@/utils/geoUtils.ts';
import type { Feature, Polygon, MultiPolygon, GeoJsonProperties } from 'geojson';
import { chartUtils } from '@/utils/chartUtils'; // Импортируем тип из утилит
import type { ChartDataNode, TopicApiResponse } from '@/utils/types';


export function useTopicData(selectedTopicId: number | null) {
    const [mergedGeoJSON, setMergedGeoJSON] = useState<Feature<Polygon | MultiPolygon, GeoJsonProperties> | null>(null);
    const [loadingTopicData, setLoadingTopicData] = useState<boolean>(false);
    const [chartData, setChartData] = useState<ChartDataNode[]>([]);

    const loadTopicData = useCallback(async () => {
        if (!selectedTopicId) {
            setMergedGeoJSON(null);
            setChartData([]);
            return;
        }

        const fetchData = async (): Promise<TopicApiResponse | null> => {
            try {
                setLoadingTopicData(true);
                return await fetchTopicData(selectedTopicId);
            } catch (err) {
                console.error("Ошибка при загрузке данных топика:", err);
                setLoadingTopicData(false);
                return null;
            }
        };

        const data = await fetchData();

        if (!data) return;

        try {
            const chartDataWithEMA = chartUtils(data);
            setChartData(chartDataWithEMA);
        } catch (err) {
            console.error("Ошибка при расчете данных для графика:", err);
        } finally {
            setLoadingTopicData(false);
        }

        try {
            const rawCoordsString = data.Depression_AreaPoints?.[0];
            if (rawCoordsString) {
                console.log('Парсинг успешен:', data.Depression_AreaPoints);
                console.log('Полигоны отображены с данными текущего топика');
                const finalResult = processCoordinatesToHull(rawCoordsString);
                setMergedGeoJSON(finalResult);
            } else {
                setMergedGeoJSON(null);
                console.error('Depression_AreaPoints не является массивом после парсинга');
            }
        } catch (err) {
            console.error('Ошибка при парсинге Depression_AreaPoints:', err);
            setMergedGeoJSON(null);
        }
    }, [selectedTopicId]);

    useEffect(() => {
        loadTopicData();

        if (selectedTopicId) {
            const interval = setInterval(loadTopicData, 10000);
            return () => clearInterval(interval);
        }
    }, [loadTopicData, selectedTopicId]);

    return { mergedGeoJSON, loadingTopicData, chartData };
}