/**
 * Auth Types
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

export interface TopicsPanelProps {
    onClose: () => void
    onTopicSelect: (id: number | null) => void
    onTopicDelete: (id: number) => Promise<void> // Добавлено
    selectedTopicId: number | null
    topics: Topic[]
    loading: boolean
    isSidebarOpen: boolean
}

export interface TopicDataItem {
    ID_Data: number;
    Time_Data: number;
    Value_Data: string;
}

export interface fetchTopicDataResponse {
    Depression_AreaPoints?: string[];
    Data: TopicDataItem[];
}

/**
 * Component Props
 */
export interface GetTopicsProps {
    topics: Topic[];
    loading: boolean;
    selectedTopicId: number | null;
    onTopicSelect: (id: number | null) => void;
    onTopicDelete: (id: number) => Promise<void>; // Добавлено
}

export interface MapProps {
    selectedTopicId: number | null;
    topics: Topic[];
}

export interface TopicDeleteProps {
    onTopicDelete: (id: number) => Promise<void>;
    message: string;
}