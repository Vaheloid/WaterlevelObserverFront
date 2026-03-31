import { useQuery } from '@tanstack/react-query';
import { fetchTopics } from '@/utils/api.ts';
import type { Topic } from '@/utils/types.ts';
import { useEffect } from 'react';

export const useTopics = (enabled: boolean = false) => {
    const query = useQuery<Topic[]>({
        queryKey: ['topics'],
        queryFn: fetchTopics,
        enabled: enabled,
        refetchInterval: 10000,
    });

    useEffect(() => {
        if (query.data) {
            console.log("Список топиков: ", query.data);
        }
    }, [query.data]);

    useEffect(() => {
        if (query.error) {
            console.error("Ошибка при получении данных: ", query.error);
        }
    }, [query.error]);

    return { 
        topics: query.data ?? [], 
        loading: query.isLoading, 
        loadData: query.refetch 
    };
};