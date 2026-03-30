import { fetchTopics } from '@/utils/api.ts';
import type { Topic } from '@/utils/types.ts';
import { useState, useEffect, useCallback } from 'react';


export const useTopics = (enabled: boolean = false) => {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(false);

    const loadData = useCallback(async (isInitial = false) => {

        if (isInitial) setLoading(true);

        try {
            const data = await fetchTopics();
            setTopics(data);
            console.log("Список топиков: ", data);
        } catch (error) {
            console.error("Ошибка при получении данных: ", error);
        } finally {
            if (isInitial) setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!enabled) return;
        loadData(true);
        const intervalId = setInterval(() => {
            loadData(false);
            console.log("Список топиков обновлен");
        }, 10000);

        return () => {
            clearInterval(intervalId);
        };
    }, [enabled, loadData]);

    return { topics, loading, loadData };
};