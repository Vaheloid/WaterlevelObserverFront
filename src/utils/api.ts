import axios from "axios";
import type { Topic, FormValues, LoginResponse, TopicDeleteProps, TopicApiResponse } from "@/utils/types.ts";

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
});

export const loginUser = async (data: FormValues): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/login', data);
    return response.data;
};

export const fetchTopics = async (): Promise<Topic[]> => {
    const response = await api.get<Topic[]>('/topics');
    return response.data;
};

export const fetchTopicData = async (id: number, limit: number = 25): Promise<TopicApiResponse> => {
    const response = await api.get<TopicApiResponse>(`/topic_data?id_topic=${id}&limit=${limit}`);
    return response.data;
};

export const addTopic = async (topic: Topic): Promise<{ message: string }> => {
    const payload = {
        name_topic: topic.Name_Topic,
        path_topic: topic.Path_Topic,
        latitude_topic: topic.Latitude_Topic,
        longitude_topic: topic.Longitude_Topic,
        altitude_topic: topic.Altitude_Topic,
        altitude_sensor_topic: topic.AltitudeSensor_Topic,
    };

    const response = await api.post<{ message: string }>('/add_topic', payload);
    return response.data;
};

export const deleteTopic = async (id: number): Promise<TopicDeleteProps> => {
    const response = await api.post('/delete_topic', { id_topic: id });
    return response.data;
};