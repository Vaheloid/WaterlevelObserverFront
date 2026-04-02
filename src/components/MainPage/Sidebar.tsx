import { Box, VStack, Flex, Heading, Spacer } from "@chakra-ui/react";
import { Menu, BarChart3, Plus, PanelLeftClose, Sun, Moon } from "lucide-react";
import { NavButton } from "@/components/MainPage/NavButton.tsx";
import type { SidebarProps } from "@/utils/types";
import { useColorMode } from "../ui/color-mode";

// ... (импорты те же)

export const Sidebar = ({ isOpen, onToggle, activePanel, onPanelToggle }: SidebarProps) => {
    const { colorMode, toggleColorMode } = useColorMode();

    // Определяем цвет иконки: в светлой теме — серый/черный, в темной — белый
    const iconColor = { base: "gray.800", _dark: "white" };

    return (
        <Box
            as="aside"
            position="absolute"
            top="10px"
            left="10px"
            bottom="10px"
            w={isOpen ? "280px" : "70px"}
            bg={{ base: "rgba(255, 255, 255, 0.7)", _dark: "rgba(0, 0, 0, 0.7)" }}
            backdropFilter="blur(10px) saturate(180%)"
            borderRadius="10px"
            transition="width 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            zIndex={200}
            p={4}
            display="flex"
            flexDirection="column"
        >
            <VStack align="center" gap={6} flex={1} h="full">
                <Flex w="full" align="center" justify={isOpen ? "space-between" : "center"} h="48px">
                    {isOpen && (
                        <Heading size="sm" color={{ base: "blue.600", _dark: "whiteAlpha.900" }} ml={2} whiteSpace="nowrap">
                            НАВИГАЦИЯ 
                        </Heading>
                    )}
                    <NavButton
                        // Применяем динамический цвет к иконкам Menu / PanelLeftClose
                        icon={isOpen ? <PanelLeftClose size={24} color="currentColor" /> : <Menu size={24} style={{ stroke: 'currentColor' }} />}
                        color={iconColor} // Chakra прокинет этот цвет в иконку через currentColor
                        isExpanded={false}
                        onClick={onToggle}
                        aria-label="Toggle Sidebar"
                    />      
                </Flex>
                
                <VStack w="full" gap={2}>
                    <NavButton
                        icon={<BarChart3 size={24} color="currentColor" />}
                        color={iconColor}
                        label="Топики"
                        isExpanded={isOpen}
                        isActive={activePanel === "topics"}
                        onClick={() => onPanelToggle("topics")}
                    />
                    <NavButton
                        icon={<Plus size={24} color="currentColor" />}
                        color={iconColor}
                        label="Добавить топик"
                        isExpanded={isOpen}
                        isActive={activePanel === "add"}
                        onClick={() => onPanelToggle("add")}
                    />
                </VStack>

                <Spacer />

                <NavButton
                    // Иконки луны и солнца тоже будут менять цвет
                    icon={colorMode === "light" ? <Moon size={24} color="currentColor" /> : <Sun size={24} color="currentColor" />}
                    color={iconColor}
                    label={colorMode === "light" ? "Темная тема" : "Светлая тема"}
                    isExpanded={isOpen}
                    onClick={toggleColorMode}
                />
            </VStack>
        </Box>
    );
};