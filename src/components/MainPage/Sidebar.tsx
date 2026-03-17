// components/MainPage/Sidebar.tsx
import { Box, VStack, Flex, Heading } from "@chakra-ui/react";
import { Menu, X, BarChart3, PlusCircle } from "lucide-react";
import { NavButton } from "./NavButton";

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
        w={isOpen ? "280px" : "80px"}
        bg="white"
        borderRight="1px solid"
        borderColor="gray.200"
        transition="width 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        zIndex={200}
        h="full"
        p={4}
        position="relative"
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
            icon={isOpen ? <X size={24} /> : <Menu size={24} />}
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
            icon={<PlusCircle size={24} />}
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
