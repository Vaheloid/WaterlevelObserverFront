import { useState, useEffect, useCallback } from 'react';
import { fetchTopics } from '../utils/api';
import type { Topic } from '@/utils/types';

export function useTopics() {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Оборачиваем в useCallback, чтобы ссылку на функцию можно было передавать без лишних рендеров
    const loadData = useCallback(async () => {
        try {
            const data = await fetchTopics();
            setTopics(data);
        } catch (err) {
            console.error("Ошибка загрузки списка топиков:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 10000); // Обновление каждые 10 сек
        return () => clearInterval(interval);
    }, [loadData]);

    return { topics, loading, refresh: loadData };
}