import { Box, Flex, HStack, Button, Heading } from "@chakra-ui/react"
import { BarChart3, X } from "lucide-react"
import { motion } from "framer-motion"
import type { TopicsPanelProps } from "@/shared/types/types";
import { TopicsList } from "@/widgets";

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
        <motion.div
            initial={{ 
                opacity: 0, 
                left: `${currentLeft - 40}px`, 
                scale: 0.98 
            }}
            animate={{ 
                opacity: 1, 
                x: 0, 
                scale: 1,
                left: `${currentLeft}px`
            }}
            exit={{ 
                opacity: 0, 
                left: `${currentLeft - 20}px`, 
                scale: 0.98,
                transition: { duration: 0.2, ease: "easeIn" } 
            }}
            transition={{ 
                type: "tween",
                ease: "easeInOut",
                duration: 0.3,
            }}
            style={{
                position: "absolute",
                top: "10px",
                left: 0,
                bottom: "10px",
                width: "400px",
                zIndex: 150,
                display: "flex",
                pointerEvents: "auto"
            }}
        >
            <Box
                w="full"
                h="full"
                bg={{ base: "rgba(255, 255, 255, 0.7)", _dark: "rgba(0, 0, 0, 0.7)" }}
                backdropFilter="blur(16px) saturate(180%)"
                borderRadius="xl"
                display="flex"
                flexDirection="column"
                border="1px solid"
                borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
                overflow="hidden"
            >
                {/* Шапка панели */}
                <Flex 
                    p={4} 
                    borderBottom="1px solid" 
                    borderColor={{ base: "gray.100", _dark: "whiteAlpha.100" }} 
                    align="center" 
                    justify="space-between"
                >
                <HStack gap={2}>
                    <Box color={{ base: "blue.500", _dark: "blue.500" }}>
                        <BarChart3 size={18} color="currentColor" />
                    </Box>
                    <Heading fontSize="sm" fontWeight="500" color={{ base: "gray.800", _dark: "whiteAlpha.900" }}>
                    ТОПИКИ
                    </Heading>
                </HStack>
                <Button 
                    borderRadius="lg" 
                    variant="ghost" 
                    shadow="xs" 
                    size="sm" 
                    onClick={onClose} 
                    p={0} 
                    color={{ base: "black", _dark: "white" }} 
                    bg={{ base: "white", _dark: "whiteAlpha.100" }}
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

                {/* Список */}
                <Box 
                    p={2} 
                    overflowY="auto" 
                    flex="1"
                    css={{
                        '&::-webkit-scrollbar': { width: '4px' },
                        '&::-webkit-scrollbar-thumb': { background: 'rgba(0,0,0,0.1)', borderRadius: '10px' },
                        scrollbarWidth: 'none',
                    }}
                >
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
        </motion.div>
    )
}