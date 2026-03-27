import { useState, useEffect, useCallback } from 'react';
import { fetchTopicData } from '@/utils/api.ts';
import { processCoordinatesToHull } from '@/utils/geoUtils.ts';
import type { Feature, Polygon, MultiPolygon, GeoJsonProperties } from 'geojson';
import { calculateEMA } from '@/utils/other_scripts.ts';

export interface ChartDataNode {
    time: string;
    value: number | null;
    ema: number | null;
}

export function useTopicData(selectedTopicId: number | null) {
    const [mergedGeoJSON, setMergedGeoJSON] = useState<Feature<Polygon | MultiPolygon, GeoJsonProperties> | null>(null);
    const [loadingTopicData, setLoadingTopicData] = useState<boolean>(false);
    const [chartData, setChartData] = useState<ChartDataNode[]>([]);
    const loadTopicData = useCallback(async () => {
        if (!selectedTopicId) {
            setMergedGeoJSON(null);
            return;
        }

        try {
            setLoadingTopicData(true);
            const data = await fetchTopicData(selectedTopicId);
            
            const rawDataFromApi = data.Data; 

            const emaCalculated = calculateEMA(rawDataFromApi, 7, 2, 2);

            const chartDataWithEMA = emaCalculated.map((emaItem, index) => {
                const date = new Date(emaItem.Time_Data * 1000);
                
                const formattedDate = date.toLocaleDateString('ru-RU', { 
                    day: '2-digit', month: '2-digit', year: 'numeric' 
                });
                const formattedTime = date.toLocaleTimeString('ru-RU', { 
                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                });

                return {
                    time: `${formattedDate} ${formattedTime}`,
                    value: rawDataFromApi[index] ? parseFloat(rawDataFromApi[index].Value_Data) : null,
                    ema: emaItem.Value_Data 
                };
            });

            setChartData(chartDataWithEMA);

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
        
        if (selectedTopicId) {
            const interval = setInterval(loadTopicData, 10000);
            return () => clearInterval(interval);
        }
    }, [loadTopicData, selectedTopicId]);

    return { mergedGeoJSON, loadingTopicData, chartData };
}