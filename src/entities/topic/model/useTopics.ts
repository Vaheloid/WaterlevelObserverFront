import { useState, useEffect, useRef, useCallback } from 'react'; // Добавлен useCallback
import { useQuery } from '@tanstack/react-query';
import { fetchTopics } from '@/shared';
import type { Topic } from '@/shared/types/types';

export const useTopics = (enabled: boolean = false) => {
    const [topicsInterval, setTopicsInterval] = useState<number | false>(10000);
    const [configCheckInterval, setConfigCheckInterval] = useState(30000);
    
    const configTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // 1. Объявляем загрузку конфига
    const loadConfig = useCallback(async () => {
        try {
            const response = await fetch(`/config.json?t=${Date.now()}`);
            if (!response.ok) throw new Error("Config not found");
            const config = await response.json();
            
            setTopicsInterval(config.TOPICS_REFETCH_INTERVAL);
            setConfigCheckInterval(config.CONFIG_CHECK_INTERVAL);
        } catch (error) {
            console.error("Ошибка загрузки конфига:", error);
        } finally {
            // Рекурсивный таймер
            configTimerRef.current = setTimeout(loadConfig, configCheckInterval);
        }
    }, [configCheckInterval]);

    // 2. Запускаем цикл проверки конфига
    useEffect(() => {
        loadConfig();
        return () => {
            if (configTimerRef.current) clearTimeout(configTimerRef.current);
        };
    }, [loadConfig]);

    // 3. Объявляем основной запрос (ВАЖНО: до использования в useEffect ниже)
    const query = useQuery<Topic[]>({
        queryKey: ['topics'],
        queryFn: fetchTopics,
        enabled: enabled,
        refetchInterval: topicsInterval,
        refetchOnMount: true,
        refetchOnWindowFocus: true
    });
    // Извлекаем refetch, чтобы использовать его как стабильную зависимость
    const { refetch } = query;

    // 4. Эффект для мгновенного обновления при смене интервала в конфиге
    useEffect(() => {
        if (enabled) {
            refetch(); 
        }
        // Теперь все зависимости на месте и линтер будет молчать
    }, [topicsInterval, enabled, refetch]);

    // Логи для отладки
    useEffect(() => {
        if (query.data) {
            console.log("Данные списка топиков обновлены:", query.data);
        }
    }, [query.data]);

    return { 
        topics: query.data ?? [], 
        loading: query.isLoading || query.isFetching, 
        loadData: query.refetch
    };
};