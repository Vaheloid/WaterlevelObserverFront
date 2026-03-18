import { useState } from "react"
import { Flex, Box } from "@chakra-ui/react"
import { PlusCircle } from "lucide-react"

import Map from "../Map/Map"
import { useTopics } from "@/hooks/useTopics"
import { Sidebar } from "./Sidebar"
import { TopicsPanel } from "../Topics/TopicsPanel"
import { AddTopicForm } from "../Topics/AddTopicForm"
import { FloatingPanel } from "../Topics/FloatingPanel"
import { TopicChartPanel } from "../Topics/Graphic"

export default function MainPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [activePanel, setActivePanel] = useState<"topics" | "add" | null>(null)
    const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null)
    const [isChartVisible, setIsChartVisible] = useState(false)
    const { topics, loading } = useTopics()

    const handlePanelToggle = (panel: "topics" | "add") => {
        setActivePanel(activePanel === panel ? null : panel)
    }

    const handleTopicSelect = (id: number | null) => {
        setSelectedTopicId(id)
        if (id !== null) {
            setIsChartVisible(true)
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

            {/* Панель списка (открывается/закрывается независимо) */}
            {activePanel === "topics" && (
                <TopicsPanel 
                topics={topics}
                loading={loading}
                selectedTopicId={selectedTopicId}
                onTopicSelect={handleTopicSelect}
                onClose={() => setActivePanel(null)}
                />
            )}

            {/* ПАНЕЛЬ ГРАФИКА: показываем только если isChartVisible true */}
            {isChartVisible && selectedTopicData && (
                <TopicChartPanel 
                topic={selectedTopicData} 
                isListOpen={activePanel === "topics"}
                onClose={() => setIsChartVisible(false)}
                />
            )}

            {activePanel === "add" && (
                <FloatingPanel 
                title="Добавление топика" 
                icon={PlusCircle} 
                onClose={() => setActivePanel(null)}
                >
                <AddTopicForm onSuccess={(data) => {
                    alert(`Топик "${data}" успешно создан!`)
                    setActivePanel(null) 
                }} />
                </FloatingPanel>
            )}

            </Flex>
        </Flex>
    )
}