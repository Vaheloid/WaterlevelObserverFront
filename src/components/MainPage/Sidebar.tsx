import { Box, VStack, Flex, Heading } from "@chakra-ui/react";
import { Menu, BarChart3, Plus, PanelLeftClose } from "lucide-react";
import { NavButton } from "@/components/MainPage/NavButton.tsx";

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    activePanel: string | null;
    onPanelToggle: (panel: "topics" | "add") => void;
}

export const Sidebar = ({
    isOpen,
    onToggle,
    activePanel,
    onPanelToggle,
}: SidebarProps) => {
    return (
        <Box
            as="aside"
            position="absolute"
            top="10px"
            left="10px"
            bottom="10px"
            w={isOpen ? "280px" : "80px"}
            bg="rgba(255, 255, 255, 0.7)"
            backdropFilter="blur(10px) saturate(180%)"
            border="1px solid"
            borderColor="rgba(255, 255, 255, 0.3)"
            borderRadius="10px"
            boxShadow="2xl"
            transition="width 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            zIndex={200}
            p={4}
        >
            <VStack align="center" gap={6}>
                {/* Шапка сайдбара с бургером */}
                <Flex
                    w="full"
                    align="center"
                    justify={isOpen ? "space-between" : "center"}
                    h="48px"
                    
                >
                    {isOpen && (
                        <Heading size="sm" color="blue.600" ml={2} whiteSpace="nowrap">
                            НАВИГАЦИЯ 
                        </Heading>
                    )}
                    <NavButton
                        icon={isOpen ? <PanelLeftClose /> : <Menu size={24} />}
                        isExpanded={false}
                        onClick={onToggle}
                        aria-label="Toggle Sidebar"
                    />      
                </Flex>
                
                {/* Кнопки навигации */}
                <VStack w="full" gap={2}>
                    <NavButton
                        icon={<BarChart3 size={24} />}
                        label="Топики"
                        isExpanded={isOpen}
                        isActive={activePanel === "topics"}
                        onClick={() => onPanelToggle("topics")}
                    />
                    <NavButton
                        icon={<Plus size={24} />}
                        label="Добавить топик"
                        isExpanded={isOpen}
                        isActive={activePanel === "add"}
                        onClick={() => onPanelToggle("add")}
                    />
                </VStack>
            </VStack>
        </Box>
    );
};