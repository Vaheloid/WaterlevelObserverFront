import { Box, Flex, HStack, Button, Heading } from "@chakra-ui/react"
import { BarChart3, X } from "lucide-react"
import TopicsList from "@/components/Topics/TopicsList"
import type { TopicsPanelProps } from "@/utils/types.ts";

export const TopicsPanel = ({ 
    onClose, 
    onTopicSelect, 
    onTopicDelete,
    selectedTopicId, 
    topics, 
    loading,
    isSidebarOpen,
    isSelectionDisabled,
}: TopicsPanelProps) => {
    const sidebarWidth = isSidebarOpen ? 280 : 70;
    const currentLeft = 10 + sidebarWidth + 10;

    return (
        <Box
            position="absolute"
            top="10px" bottom="10px"
            left={`${currentLeft}px`}
            w="400px"
            bg={{ base: "rgba(255, 255, 255, 0.7)", _dark: "rgba(0, 0, 0, 0.7)" }}
            backdropFilter="blur(10px) saturate(180%)"
            borderRadius="xl"
            zIndex={150}
            display="flex"
            flexDirection="column"
            transition="left 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        >
            <Flex p={4} borderBottom="1px solid" borderColor={{ base: "gray.200", _dark: "whiteAlpha.100" }} align="center" justify="space-between">
                <HStack gap={2}>
                    <Box color={{ base: "blue.500", _dark: "blue.500" }}>
                        <BarChart3 size={18} color="currentColor" />
                    </Box>
                    <Heading fontSize="sm" fontWeight="500" color={{ base: "gray.800", _dark: "whiteAlpha.900" }}>
                        ТОПИКИ
                    </Heading>
                </HStack>
                <Button variant="ghost" shadow="xs" size="sm" onClick={onClose} p={0} color={{ base: "black", _dark: "white" }} bg={{ base: "white", _dark: "whiteAlpha.100" }}
                    border="0"
                    outline="0"
                    _focus={{
                        outline: "none",
                        border: "none"
                    }}
                    _focusVisible={{
                        outline: "none",
                        border: "none"
                    }}
                    _active={{
                        outline: "none"
                    }}
                    _hover={{ 
                        bg: { base: "gray.100", _dark: "whiteAlpha.300" },
                        border: "none",
                        outline: "none",
                    }}

                    onMouseDown={(e) => e.preventDefault()}>
                    <X size={18} color="currentColor"/>
                </Button>
            </Flex>
            <Box p={2} 
                css={{
                    '&::-webkit-scrollbar': { display: 'none' },
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                }}
                overflowY="auto" flex="1">
                <TopicsList 
                    onTopicSelect={onTopicSelect} 
                    onTopicDelete={onTopicDelete} 
                    selectedTopicId={selectedTopicId} 
                    topics={topics} 
                    loading={loading}
                    isSelectionDisabled={isSelectionDisabled}
                />
            </Box>
        </Box>
    )
}