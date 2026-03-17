// components/MainPage/TopicsPanel.tsx
import { Box, Flex, HStack, Heading, Button } from "@chakra-ui/react"
import { BarChart3, X } from "lucide-react"
import GetTopics from "./GetTopics"
import type { Topic } from "@/utils/types"

interface TopicsPanelProps {
  onClose: () => void
  onTopicSelect: (id: number | null) => void
  selectedTopicId: number | null
  topics: Topic[]
  loading: boolean
}

export const TopicsPanel = ({ onClose, onTopicSelect, selectedTopicId, topics, loading }: TopicsPanelProps) => (
  <Box
    position="absolute"
    top="10px"
    left="10px"
    w="400px"
    maxH="calc(100vh - 20px)"
    bg="rgba(255, 255, 255, 0.8)"
    backdropFilter="blur(10px)"
    borderRadius="xl"
    boxShadow="2xl"
    border="1px solid"
    borderColor="gray.200"
    zIndex={150}
    display="flex"
    flexDirection="column"
  >
    <Flex p={4} borderBottom="1px solid" borderColor="gray.100" align="center" justify="space-between">
      <HStack gap={2}>
        <BarChart3 size={18} color="var(--chakra-colors-blue-500)" />
        <Heading size="xs">ТОПИКИ</Heading>
      </HStack>
      <Button variant="ghost" size="sm" onClick={onClose} p={0}>
        <X size={18} />
      </Button>
    </Flex>
    <Box p={2} overflowY="auto" flex="1">
      <GetTopics 
        onTopicSelect={onTopicSelect} 
        selectedTopicId={selectedTopicId} 
        topics={topics} 
        loading={loading} 
      />
    </Box>
  </Box>
)