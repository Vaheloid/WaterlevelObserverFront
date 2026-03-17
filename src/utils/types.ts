/**
 * Auth Types (Login.tsx)
 */
export interface FormValues {
    login_user: string;
    password_user: string;
}

export interface LoginResponse {
    user_id: number;
}

export interface LoginFormProps {
    onSubmit: (data: FormValues) => Promise<void>;
    isSubmitting: boolean;
    loginError: string | null;
}

/**
 * Data Types
 */
export interface Topic {
    ID_Topic: number;
    Name_Topic: string;
    Path_Topic: string; 
    Latitude_Topic: number;
    Longitude_Topic: number;
    Altitude_Topic: number; 
    AltitudeSensor_Topic: number;
}

// Структура ответа для детальных данных (полигона)
export interface fetchTopicDataResponse {
    Depression_AreaPoints?: string[]; 
}

/**
 * Component Props (для реализации "единого источника данных")
 */

export interface GetTopicsProps {
    // Список топиков теперь приходит сверху
    topics: Topic[];
    // Состояние загрузки тоже передаем, чтобы показать Spinner
    loading: boolean;
    // ID может быть числом или null (если выбор снят)
    selectedTopicId: number | null;
    // Функция уведомляет родителя об изменении ID
    onTopicSelect: (id: number | null) => void;
}

export interface MapProps {
    // Карте нужен ID для загрузки полигона
    selectedTopicId: number | null;
    // И список всех топиков для отрисовки маркеров и поиска координат
    topics: Topic[];
}