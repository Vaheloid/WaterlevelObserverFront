import { Box, VStack, Flex, Heading, Spacer } from "@chakra-ui/react";
import { Menu, BarChart3, Plus, PanelLeftClose, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence, type Transition } from "framer-motion";
import { NavButton } from "@/components/MainPage/NavButton.tsx";
import type { SidebarProps } from "@/utils/types";
import { useColorMode } from "../ui/color-mode";

export const Sidebar = ({ isOpen, onToggle, activePanel, onPanelToggle }: SidebarProps) => {
    const { colorMode, toggleColorMode } = useColorMode();
    const iconColor = { base: "gray.800", _dark: "white" };

    const sidebarTransition: Transition = {
        type: "tween",
        ease: "easeInOut",
        duration: 0.3,
    };

    return (
        <motion.aside
            layout
            animate={{ width: isOpen ? 280 : 70 }}
            transition={sidebarTransition}
            style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                bottom: "10px",
                zIndex: 200,
                display: "flex",
                overflow: "hidden",
                willChange: "width", 
                borderRadius: "12px"
            }}
        >
            <Box
                as="div"
                w="full"
                h="full"
                bg={{ base: "rgba(255, 255, 255, 0.7)", _dark: "rgba(0, 0, 0, 0.7)" }}
                backdropFilter="blur(12px) saturate(180%)"
                borderRadius="xl"
                p={4}
                display="flex"
                flexDirection="column"
                border="1px solid"
                borderColor={{ base: "whiteAlpha.300", _dark: "whiteAlpha.100" }}
                boxShadow="xl"
            >
                <VStack align="center" gap={6} flex={1} h="full">
                    <Flex w="full" align="center" justify={isOpen ? "space-between" : "center"} h="48px">
                        <AnimatePresence mode="wait">
                            {isOpen && (
                                <motion.div
                                    key="title"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                    style={{ overflow: "hidden", whiteSpace: "nowrap" }}
                                >
                                    <Heading size="sm" color={{ base: "blue.600", _dark: "whiteAlpha.900" }} ml={2} whiteSpace="nowrap">
                                        НАВИГАЦИЯ 
                                    </Heading>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        <NavButton
                            icon={isOpen ? <PanelLeftClose size={24} color="currentColor" /> : <Menu size={24} />}
                            color={iconColor}
                            isExpanded={false}
                            onClick={onToggle}
                            aria-label="Toggle Sidebar"
                        />      
                    </Flex>
                    
                    <VStack w="full" gap={2} align={isOpen ? "stretch" : "center"}>
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
                        icon={colorMode === "light" ? <Moon size={24} color="currentColor" /> : <Sun size={24} color="currentColor" />}
                        color={iconColor}
                        label={colorMode === "light" ? "Темная тема" : "Светлая тема"}
                        isExpanded={isOpen}
                        onClick={toggleColorMode}
                    />
                </VStack>
            </Box>
        </motion.aside>
    );
};