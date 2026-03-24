import { Box, Flex, HStack, Heading, Button } from "@chakra-ui/react"
import { BarChart3, X } from "lucide-react"
import GetTopics from "./GetTopics"
import type { TopicsPanelProps } from "@/utils/types";

export const TopicsPanel = ({ 
    onClose, 
    onTopicSelect, 
    selectedTopicId, 
    topics, 
    loading,
    isSidebarOpen 
}: TopicsPanelProps) => {
    const sidebarWidth = isSidebarOpen ? 280 : 80;
    const currentLeft = 10 + sidebarWidth + 10;

    return (
        <Box
            position="absolute"
            top="10px"
            bottom="10px"
            left={`${currentLeft}px`}
            w="400px"
            maxH="calc(100vh - 20px)"
            bg="rgba(255, 255, 255, 0.7)"
            backdropFilter="blur(10px)"
            borderRadius="xl"
            boxShadow="2xl"
            border="1px solid"
            borderColor="rgba(255, 255, 255, 0.3)"
            zIndex={150}
            display="flex"
            flexDirection="column"
            transition="left 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
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
            <Box p={2} 
                css={{
                    '&::-webkit-scrollbar': { display: 'none' },
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                }}
                overflowY="auto" flex="1">
                <GetTopics 
                    onTopicSelect={onTopicSelect} 
                    selectedTopicId={selectedTopicId} 
                    topics={topics} 
                    loading={loading} 
                />
            </Box>
        </Box>
    )
}