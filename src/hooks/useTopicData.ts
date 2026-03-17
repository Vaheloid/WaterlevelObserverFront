import { useState, useEffect, useCallback } from 'react';
import { fetchTopicData } from '../utils/api';
import { processCoordinatesToHull } from '../utils/geoUtils';
import type { Feature, Polygon, MultiPolygon, GeoJsonProperties } from 'geojson';

export function useTopicData(selectedTopicId: number | null) {
    const [mergedGeoJSON, setMergedGeoJSON] = useState<Feature<Polygon | MultiPolygon, GeoJsonProperties> | null>(null);
    const [loadingTopicData, setLoadingTopicData] = useState<boolean>(false);

    const loadTopicData = useCallback(async () => {
        // Если ID не выбран, очищаем данные и выходим
        if (!selectedTopicId) {
            setMergedGeoJSON(null);
            return;
        }

        try {
            setLoadingTopicData(true);
            const data = await fetchTopicData(selectedTopicId);
            const rawCoordsString = data.Depression_AreaPoints?.[0];

            if (rawCoordsString) {
                const finalResult = processCoordinatesToHull(rawCoordsString);
                setMergedGeoJSON(finalResult);
            } else {
                setMergedGeoJSON(null);
            }
        } catch (err) {
            console.error("Ошибка при загрузке деталей топика:", err);
            setMergedGeoJSON(null);
        } finally {
            setLoadingTopicData(false);
        }
    }, [selectedTopicId]);

    useEffect(() => {
        loadTopicData();
        
        // Устанавливаем интервал обновления только если выбран топик
        if (selectedTopicId) {
            const interval = setInterval(loadTopicData, 10000);
            return () => clearInterval(interval);
        }
    }, [loadTopicData, selectedTopicId]);

    return { mergedGeoJSON, loadingTopicData };
}