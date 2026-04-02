import type { ButtonProps } from '@chakra-ui/react';
import type { Feature, Polygon, MultiPolygon, GeoJsonProperties } from 'geojson';
import type { ReactElement, ReactNode } from 'react';
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

export interface LoginLayoutProps {
    children: ReactNode
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

export interface TopicAddFormProps {
    onSuccess: (data: Topic) => void;
    initialCoords?: { lat: number; lng: number };
}

export interface TopicAddPanelProps {
    onClose: () => void
    children: React.ReactNode
    isSidebarOpen: boolean
}

export interface TopicChartPanelProps {
    topic: Topic | null
    chartData: ChartDataNode[];
    onClose: () => void
    isListOpen: boolean
    isSidebarOpen: boolean
}

export interface TopicApiResponse {
    Data: TopicDataItem[];
    Depression_AreaPoints?: string[];
}

export interface ChartDataNode {
    time: string;
    value: number | null;
    ema: number | null;
}

export interface TopicsPanelProps {
    onClose: () => void
    onTopicSelect: (id: number | null) => void
    onTopicDelete: (id: number) => Promise<void>
    selectedTopicId: number | null
    topics: Topic[]
    loading: boolean
    isSidebarOpen: boolean
    isSelectionDisabled: boolean
}

export interface TopicDataItem {
    ID_Data: number;
    Time_Data: number;
    Value_Data: string;
}

/**
 * Component Props
 */
export interface TopicsListProps {
    topics: Topic[];
    loading: boolean;
    selectedTopicId: number | null;
    onTopicSelect: (id: number | null) => void;
    onTopicDelete: (id: number) => Promise<void>;
    isSelectionDisabled: boolean;
}

export type MergedGeoJSON = Feature<Polygon | MultiPolygon, GeoJsonProperties> | null;

export interface MapProps {
    selectedTopicId: number | null;
    topics: Topic[];
    onMapClick?: (lat: number, lng: number) => void;
    isAdding?: boolean;
    mergedGeoJSON: MergedGeoJSON;
}

export interface TopicDeleteProps {
    onTopicDelete: (id: number) => Promise<void>;
    message: string;
}

export interface NavButtonProps extends ButtonProps {
    icon: ReactElement
    label?: string
    isExpanded: boolean
    isActive?: boolean
}

export interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    activePanel: string | null;
    onPanelToggle: (panel: "topics" | "add") => void;
}

export interface DataPoint {
    Value_Data: string;
    Time_Data: number;
}

export interface ProcessedDataPoint {
    Value_Data: number | null;
    Time_Data: number;
}

export type Point = [number, number];