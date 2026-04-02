import type { TopicAddPanelProps } from "@/utils/types";
import { Box, Flex, HStack, Heading, Button} from "@chakra-ui/react"
import { Plus, X } from "lucide-react"

export const TopicAddPanel = ({  
    onClose, 
    children, 
    isSidebarOpen 
}: TopicAddPanelProps) => {
    const sidebarWidth = isSidebarOpen ? 280 : 70;
    const currentLeft = 10 + sidebarWidth + 10;

    return (
        <Box
            position="absolute"
            top="10px"
            left={`${currentLeft}px`}
            w="400px"
            maxH="calc(100vh - 20px)"
            
            borderRadius="xl"
            borderColor="gray.200"
            zIndex={150}
            display="flex"
            flexDirection="column"
            transition="left 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.2s ease"
        >
            {/* Шапка панели */}
            <Flex p={4} borderTopRadius="xl" borderBottom="1px solid" borderColor={{ base: "gray.200", _dark: "whiteAlpha.100" }} align="center" justify="space-between" bg={{ base: "rgba(255, 255, 255, 0.7)", _dark: "rgba(0, 0, 0, 0.7)" }}
            backdropFilter="blur(10px) saturate(180%)">
                <HStack gap={2}>
                    <Plus size={18} color="var(--chakra-colors-blue-500)"/>
                    <Heading fontSize="sm" fontWeight="500" color={{ base: "gray.800", _dark: "whiteAlpha.900" }}>ДОБАВЛЕНИЕ ТОПИКА</Heading>
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
                        bg: "gray.100",
                        border: "none",
                        outline: "none",
                    }}

                    onMouseDown={(e) => e.preventDefault()}>
                    <X size={18} color="currentColor"/>
                </Button>
            </Flex>

            {/* Контентная часть (сама форма) */}
            <Box
                bg={{ base: "rgba(255, 255, 255, 0.9)", _dark: "rgba(0, 0, 0, 0.8)" }}
                backdropFilter="blur(10px) saturate(180%)"
                borderBottomRadius="xl"
                p={4} 
                overflowY="auto" 
                css={{
                    '&::-webkit-scrollbar': { width: '4px' },
                    '&::-webkit-scrollbar-track': { background: 'transparent' },
                    '&::-webkit-scrollbar-thumb': { background: '#E2E8F0', borderRadius: '10px' },
                }}
            >
                {children}
            </Box>
        </Box>
    )
}