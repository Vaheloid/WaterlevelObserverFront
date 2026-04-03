import { useState } from "react"
import { Flex, Box } from "@chakra-ui/react"
import axios from "axios"

import Map from "@/components/Map/Map.tsx"
import { useTopics } from "@/hooks/useTopics.ts"
import { Sidebar } from "@/components/MainPage/Sidebar.tsx"
import { TopicsPanel } from "@/components/Topics/TopicsPanel.tsx"
import { TopicAddForm } from "@/components/Topics/TopicAddForm"
import { TopicAddPanel } from "@/components/Topics/TopicAddPanel"
import { TopicChartPanel } from "@/components/Topics/TopicChartPanel"
import { deleteTopic } from "@/utils/api.ts"
import { useTopicData } from "@/hooks/useTopicData.ts"
import { AnimatePresence } from "framer-motion"

export default function MainPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [activePanel, setActivePanel] = useState<"topics" | "add" | null>(null)
    const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null)
    const [isChartVisible, setIsChartVisible] = useState(false)
    const [clickedCoords, setClickedCoords] = useState<{lat: number, lng: number} | null>(null);
    const [isSelectionDisabled, setIsSelectionDisabled] = useState(false); // НОВОЕ
    const { topics, loading, loadData } = useTopics(activePanel === "topics")
    const { chartData, mergedGeoJSON, } = useTopicData(selectedTopicId);

    const handleMapClick = (lat: number, lng: number) => {
        if (activePanel === "add") {
            setClickedCoords({ 
            lat: Number(lat.toFixed(6)), 
            lng: Number(lng.toFixed(6)) 
        });
        }
    };

    const handlePanelToggle = (panel: "topics" | "add") => {
        if (activePanel === panel) {
            setActivePanel(null);
            setClickedCoords(null);
        } else {
            setActivePanel(panel);
        }
    };

    const handleTopicSelect = (id: number | null) => {
        if (isSelectionDisabled) return;
        setSelectedTopicId(id)
        
        if (id !== null) {
            setIsChartVisible(true);

            setIsSelectionDisabled(true);
            setTimeout(() => {
                setIsSelectionDisabled(false);
            }, 5000);
        } else {
            setIsChartVisible(false);
        }
    }

    /**
     * Обработчик удаления
     */
    const handleTopicDelete = async (id: number) => {
        try {
            deleteTopic(id);
            await loadData();
            console.log(`Топик удален: ${id}`);
            

            if (selectedTopicId === id) {
                setSelectedTopicId(null);
                setIsChartVisible(false);
            }

        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                const errorMsg = error.response?.data?.error || 'Неизвестная ошибка';

                console.error('Ошибка удаления:', errorMsg);

                if (status === 401) {
                    alert('Ошибка: Необходимо авторизоваться');
                } else if (status === 403) {
                    alert('Ошибка: Нет прав на удаление');
                } else {
                    alert('Ошибка удаления: ' + errorMsg);
                }
            } else {
                console.error(error);
            }
        }
    }

    const selectedTopicData = topics.find(t => t.ID_Topic === selectedTopicId) || null

    return (
        <Flex h="100vh" w="100vw" overflow="hidden" bg="gray.50">
            <Sidebar
                isOpen={isSidebarOpen} 
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                activePanel={activePanel}
                onPanelToggle={handlePanelToggle}
            />

            <Flex direction="column" flex="1" position="relative">
                <Box w="full" h="full" zIndex={1}>
                    <Map 
                        selectedTopicId={selectedTopicId} 
                        topics={topics} 
                        onMapClick={handleMapClick}
                        isAdding={activePanel === "add"}
                        mergedGeoJSON={mergedGeoJSON}
                    />
                </Box>
                <AnimatePresence>
                {activePanel === "topics" && (
                    <TopicsPanel
                        topics={topics}
                        loading={loading}
                        selectedTopicId={selectedTopicId}
                        onTopicSelect={handleTopicSelect}
                        onTopicDelete={handleTopicDelete} 
                        onClose={() => setActivePanel(null)}
                        isSidebarOpen={isSidebarOpen}
                        isSelectionDisabled={isSelectionDisabled}
                    />
                )}

                {isChartVisible && selectedTopicData && (
                    <TopicChartPanel 
                        key={selectedTopicData.ID_Topic}
                        topic={selectedTopicData} 
                        chartData={chartData}
                        isListOpen={activePanel === "topics"}
                        isSidebarOpen={isSidebarOpen}
                        onClose={() => setIsChartVisible(false)}
                    />
                )}

                {activePanel === "add" && (
                    <TopicAddPanel
                        onClose={() => {
                            setActivePanel(null);
                            setClickedCoords(null);
                        }}
                        isSidebarOpen={isSidebarOpen}
                    >
                        <TopicAddForm
                            onSuccess={() => {
                                setActivePanel(null);
                                setClickedCoords(null);
                                loadData();
                            }} 
                            initialCoords={clickedCoords || undefined}
                        />
                    </TopicAddPanel>
                )}
                </AnimatePresence>
            </Flex>
        </Flex>
    )
}