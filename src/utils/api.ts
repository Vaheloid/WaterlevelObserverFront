import axios from "axios";

export const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
});

// Описываем структуру ответа от сервера
export interface TopicDataResponse {
    Depression_AreaPoints?: string[]; // Массив строк с JSON координатами
    // Добавь сюда другие поля, если они приходят в response.data
}

/**
 * Получает данные топика по его ID
 * @param id ID выбранного топика
 * @param limit Лимит записей
 */
export const fetchTopicData = async (id: number, limit: number = 25): Promise<TopicDataResponse> => {
    const response = await api.get<TopicDataResponse>(`/topic_data?id_topic=${id}&limit=${limit}`);
    return response.data;
};