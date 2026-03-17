// components/MainPage/FloatingPanel.tsx
import { Box, Flex, HStack, Heading, Button } from "@chakra-ui/react"
import { X, type LucideIcon } from "lucide-react"

interface FloatingPanelProps {
  title: string
  icon: LucideIcon
  onClose: () => void
  children: React.ReactNode
}

export const FloatingPanel = ({ title, icon: Icon, onClose, children }: FloatingPanelProps) => (
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
        <Icon size={18} color="blue.500" />
        <Heading size="xs">{title.toUpperCase()}</Heading>
      </HStack>
      <Button variant="ghost" size="sm" onClick={onClose}>
        <X size={18} />
      </Button>
    </Flex>
    <Box p={4} overflowY="auto">{children}</Box>
  </Box>
)