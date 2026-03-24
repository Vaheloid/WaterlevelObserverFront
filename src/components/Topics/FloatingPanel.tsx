import { Box, Flex, HStack, Heading, Button } from "@chakra-ui/react"
import { X, type LucideIcon } from "lucide-react"

interface FloatingPanelProps {
    title: string
    icon: LucideIcon
    onClose: () => void
    children: React.ReactNode
    isSidebarOpen: boolean
}

export const FloatingPanel = ({ 
    title, 
    icon: Icon, 
    onClose, 
    children, 
    isSidebarOpen 
}: FloatingPanelProps) => {
    const sidebarWidth = isSidebarOpen ? 280 : 80;
    const currentLeft = 10 + sidebarWidth + 10;

    return (
        <Box
            position="absolute"
            top="10px"
            left={`${currentLeft}px`}
            w="400px"
            maxH="calc(100vh - 20px)"
            
            bg="rgba(255, 255, 255, 0.7)"
            backdropFilter="blur(10px)"
            borderRadius="xl"
            boxShadow="2xl"
            border="1px solid"
            borderColor="gray.200"
            zIndex={150}
            display="flex"
            flexDirection="column"
            transition="left 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.2s ease"
        >
            {/* Шапка панели */}
            <Flex p={4} borderBottom="1px solid" borderColor="gray.100" align="center" justify="space-between">
                <HStack gap={2}>
                    <Icon size={18} color="blue.500" />
                    <Heading size="xs">{title.toUpperCase()}</Heading>
                </HStack>
                <Button variant="ghost" size="sm" onClick={onClose} p={0}>
                    <X size={18} />
                </Button>
            </Flex>

            {/* Контентная часть (сама форма) */}
            <Box 
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