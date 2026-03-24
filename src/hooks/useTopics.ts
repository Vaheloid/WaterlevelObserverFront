import { fetchTopics } from '@/utils/api';
import type { Topic } from '@/utils/types';
import { useState, useEffect, useCallback } from 'react';


export const useTopics = (enabled: boolean = false) => {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(false);

    const loadData = useCallback(async (isInitial = false) => {
        if (isInitial) setLoading(true);
        try {
            const data = await fetchTopics();
            setTopics(data);
        } catch (error) {
            console.error("Ошибка при обновлении топиков:", error);
        } finally {
            if (isInitial) setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!enabled) return;
        loadData(true);
        const intervalId = setInterval(() => {
            loadData(false);
        }, 10000);

        return () => {
            clearInterval(intervalId);
        };
    }, [enabled, loadData]);

    return { topics, loading };
};