import axios from "axios";
// Не забудь импортировать FormValues из типов
import type { fetchTopicDataResponse, Topic, FormValues, LoginResponse } from "./types";

export const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
});

/**
 * Авторизация пользователя
 */
export const loginUser = async (data: FormValues): Promise<LoginResponse> => {
    // Так как baseURL уже содержит '/api', путь будет просто '/login'
    const response = await api.post<LoginResponse>('/login', data);
    return response.data;
};

/**
 * Получает список всех топиков
 */
export const fetchTopics = async (): Promise<Topic[]> => {
    const response = await api.get<Topic[]>('/topics');
    return response.data;
};

/**
 * Получает данные топика по его ID
 */
export const fetchTopicData = async (id: number, limit: number = 25): Promise<fetchTopicDataResponse> => {
    const response = await api.get<fetchTopicDataResponse>(`/topic_data?id_topic=${id}&limit=${limit}`);
    return response.data;
};