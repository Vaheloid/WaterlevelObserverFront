import { useState } from "react"
import { Flex, Box } from "@chakra-ui/react"
import axios from "axios" // Для проверки ошибок

import Map from "../Map/Map"
import { useTopics } from "@/hooks/useTopics"
import { Sidebar } from "./Sidebar"
import { TopicsPanel } from "../Topics/TopicsPanel"
import { AddTopicForm } from "../Topics/AddTopicForm"
import { FloatingPanel } from "../Topics/FloatingPanel"
import { TopicChartPanel } from "../Topics/Graphic"
import { deleteTopic } from "@/utils/api"

export default function MainPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [activePanel, setActivePanel] = useState<"topics" | "add" | null>(null)
    const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null)
    const [isChartVisible, setIsChartVisible] = useState(false)
    const { topics, loading } = useTopics(activePanel === "topics")

    const handlePanelToggle = (panel: "topics" | "add") => {
        setActivePanel(activePanel === panel ? null : panel)
    }

    const handleTopicSelect = (id: number | null) => {
        setSelectedTopicId(id)
        if (id !== null) {
            setIsChartVisible(true)
        }
    }

    /**
     * Обработчик удаления
     */
    const handleTopicDelete = async (id: number) => {
        try {
            const response = await deleteTopic(id);
            console.log(response.message); 
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
                    <Map selectedTopicId={selectedTopicId} topics={topics} />
                </Box>

                {activePanel === "topics" && (
                    <TopicsPanel 
                        topics={topics}
                        loading={loading}
                        selectedTopicId={selectedTopicId}
                        onTopicSelect={handleTopicSelect}
                        onTopicDelete={handleTopicDelete} 
                        onClose={() => setActivePanel(null)}
                        isSidebarOpen={isSidebarOpen}
                    />
                )}

                {isChartVisible && selectedTopicData && (
                    <TopicChartPanel 
                        topic={selectedTopicData} 
                        isListOpen={activePanel === "topics"}
                        isSidebarOpen={isSidebarOpen}
                        onClose={() => setIsChartVisible(false)}
                    />
                )}

                {activePanel === "add" && (
                    <FloatingPanel
                        onClose={() => setActivePanel(null)}
                        isSidebarOpen={isSidebarOpen}
                    >
                        <AddTopicForm onSuccess={() => {
                            setActivePanel(null);
                        }} />
                    </FloatingPanel>
                )}
            </Flex>
        </Flex>
    )
}