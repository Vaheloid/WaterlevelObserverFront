import type { TopicAddPanelProps } from "@/utils/types";
import { Box, Flex, HStack, Heading, Button } from "@chakra-ui/react"
import { Plus, X } from "lucide-react"
import { motion } from "framer-motion"

export const TopicAddPanel = ({  
    onClose, 
    children, 
    isSidebarOpen 
}: TopicAddPanelProps) => {
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
                width: "400px",
                zIndex: 150,
                display: "flex",
                flexDirection: "column",
                pointerEvents: "auto",
                willChange: "left, transform, opacity",
                backdropFilter: "blur(10px) saturate(180%)",
                borderRadius: "12px"
            }}
        >
            <Box
                w="full"
                display="flex"
                flexDirection="column"
                borderRadius="xl"
                borderColor="gray.200"
                maxH="calc(100vh - 20px)"
                overflow="hidden"
            >
                {/* Шапка панели */}
                <Flex 
                    p={4} 
                    borderTopRadius="xl" 
                    borderBottom="1px solid" 
                    borderColor={{ base: "gray.200", _dark: "whiteAlpha.100" }} 
                    align="center" 
                    justify="space-between" 
                    bg={{ base: "rgba(255, 255, 255, 0.7)", _dark: "rgba(0, 0, 0, 0.7)" }}
                    backdropFilter="blur(16px) saturate(180%)"
                >
                    <HStack gap={2}>
                        <Box color="blue.500">
                            <Plus size={18} color="currentColor"/>
                        </Box>
                        <Heading fontSize="sm" fontWeight="500" color={{ base: "gray.800", _dark: "whiteAlpha.900" }}>
                            ДОБАВЛЕНИЕ ТОПИКА
                        </Heading>
                    </HStack>
                    
                    <Button 
                        variant="ghost" 
                        shadow="xs" 
                        size="sm" 
                        onClick={onClose} 
                        p={0} 
                        color={{ base: "black", _dark: "white" }} 
                        bg={{ base: "white", _dark: "whiteAlpha.100" }}
                        _hover={{ 
                            bg: { base: "gray.100", _dark: "whiteAlpha.300" },
                        }}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        <X size={18} color="currentColor"/>
                    </Button>
                </Flex>

                {/* Контентная часть */}
                <Box
                    bg={{ base: "rgba(255, 255, 255, 0.9)", _dark: "rgba(0, 0, 0, 0.8)" }}
                    backdropFilter="blur(16px) saturate(180%)"
                    borderBottomRadius="xl"
                    p={4} 
                    overflowY="auto" 
                    css={{
                        '&::-webkit-scrollbar': { width: '4px' },
                        '&::-webkit-scrollbar-track': { background: 'transparent' },
                        '&::-webkit-scrollbar-thumb': { background: 'rgba(0,0,0,0.1)', borderRadius: '10px' },
                    }}
                >
                    {children}
                </Box>
            </Box>
        </motion.div>
    )
}