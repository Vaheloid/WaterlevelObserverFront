// MainPage.tsx
import { useState } from "react"
import { Flex, Box } from "@chakra-ui/react"
import { PlusCircle } from "lucide-react"

// Импорт ваших компонентов
import Map from "../Map/Map"
import { useTopics } from "@/hooks/useTopics"
import { Sidebar } from "./Sidebar"
import { TopicsPanel } from "../Topics/TopicsPanel"
import { AddTopicForm } from "../Topics/AddTopicForm"
import { FloatingPanel } from "../Topics/FloatingPanel"

export default function MainPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activePanel, setActivePanel] = useState<"topics" | "add" | null>(null)
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null)
  const { topics, loading } = useTopics()

  const handlePanelToggle = (panel: "topics" | "add") => {
    setActivePanel(activePanel === panel ? null : panel)
  }

  return (
    <Flex h="100vh" w="100vw" overflow="hidden" bg="gray.50">
      
      {/* 1. SIDEBAR (Боковая панель) */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        activePanel={activePanel}
        onPanelToggle={handlePanelToggle}
      />

      {/* 2. MAIN CONTENT (Карта и всплывающие панели) */}
      <Flex direction="column" flex="1" position="relative">
        
        {/* Слой карты */}
        <Box w="full" h="full" zIndex={1}>
          <Map selectedTopicId={selectedTopicId} topics={topics} />
        </Box>

        {/* Панель СПИСКА топиков */}
        {activePanel === "topics" && (
          <TopicsPanel 
            topics={topics}
            loading={loading}
            selectedTopicId={selectedTopicId}
            onTopicSelect={setSelectedTopicId}
            onClose={() => setActivePanel(null)}
          />
        )}

        {/* Панель ДОБАВЛЕНИЯ топика */}
        {activePanel === "add" && (
          <FloatingPanel 
            title="Добавление топика" 
            icon={PlusCircle} 
            onClose={() => setActivePanel(null)}
          >
            <AddTopicForm onSuccess={(data) => {
              alert(`Топик "${data}" успешно создан!`)
              setActivePanel(null) 
              // Здесь можно добавить логику обновления списка topics
            }} />
          </FloatingPanel>
        )}

      </Flex>
    </Flex>
  )
}