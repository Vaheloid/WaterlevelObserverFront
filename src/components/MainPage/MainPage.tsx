import { useState } from "react";
import { 
    Box, 
    Flex, 
    Heading, 
    Text, 
    VStack, 
    Button,
    Center,
    HStack,
  type ButtonProps // Импортируем типы для корректной типизации
} from "@chakra-ui/react";
import { Menu, X, BarChart3 } from "lucide-react";
import Map from "../Map/Map";
import GetTopics from "../Topics/GetTopics";

export default function MainPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showTopicsPanel, setShowTopicsPanel] = useState(false);

    const sidebarWidth = isSidebarOpen ? "280px" : "80px";
    const panelLeftPosition = "10px"; 
    const panelTopPosition = "10px";
    const iconSize = 24;

    const commonTransition = "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)";

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Явно указываем тип ButtonProps, чтобы избежать ошибки variant: string
    const commonBtnProps: ButtonProps = {
    variant: "ghost",
    h: "48px",
    w: "48px",
    p: 0,
    bg: "gray.100",
    borderRadius: "md",
    _hover: { bg: "gray.200" },
    _active: { bg: "gray.300" },
    };

    return (
    <Flex h="100vh" w="100vw" overflow="hidden" bg="gray.50">
        
      {/* --- SIDEBAR --- */}
        <Box
        as="aside"
        w={sidebarWidth}
        bg="white"
        borderRight="1px solid"
        borderColor="gray.200"
        transition={commonTransition}
        zIndex={200}
        h="full"
        p={4}
        position="relative"
        style={{ willChange: "width" }}
    >
        <VStack align="center" gap={6}>
          {/* КНОПКА 1: БУРГЕР */}
        <Flex w="full" align="center" h="48px" justify={isSidebarOpen ? "space-between" : "center"}>
            {isSidebarOpen && 
            (
                <Heading size="sm" color="blue.600" ml={2} whiteSpace="nowrap">
                    НАВИГАЦИЯ
                </Heading>
            )}
            <Button
            {...commonBtnProps}
              // Принудительно фиксируем размеры, чтобы они не гуляли
                w="48px"
                minW="48px"
                maxW="48px"
                onClick={toggleSidebar}
                aria-label="Toggle Sidebar"
                style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
            >
                <Center w="48px" h="48px">
                    {isSidebarOpen ? <X size={iconSize} /> : <Menu size={iconSize} />}
                </Center>
            </Button>
    </Flex>

          {/* КНОПКА 2: ТОПИКИ */}
        <Box w="full" display="flex" justifyContent="center">
            <Button
            {...commonBtnProps}
              // В закрытом виде — строго 48px, как и кнопка выше
            w={isSidebarOpen ? "full" : "48px"}
            minW={isSidebarOpen ? "full" : "48px"}
            maxW={isSidebarOpen ? "full" : "48px"}
            onClick={() => setShowTopicsPanel(!showTopicsPanel)}
            color={showTopicsPanel ? "blue.600" : "gray.600"}
            justifyContent={isSidebarOpen ? "flex-start" : "center"}
            style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
            >
            <Center minW="48px" h="48px">
                <BarChart3 size={iconSize} />
            </Center>
            {isSidebarOpen && (
                <Text fontWeight="bold" ml={1} whiteSpace="nowrap">
                Топики
                </Text>
            )}
            </Button>
        </Box>
        </VStack>
    </Box>

      {/* --- MAIN CONTENT (MAP) --- */}
    <Flex direction="column" flex="1" position="relative">
        <Box w="full" h="full" zIndex={1}>
            <Map />
        </Box>

        {showTopicsPanel && (
            <Box
                position="absolute"
                top={panelTopPosition}
                left={panelLeftPosition} 
                w="400px"
                // Изменяем расчет высоты: 100vh - отступ сверху - 10px (промежуток снизу)
                maxH={`calc(100vh - ${panelTopPosition} - 10px)`} 
                bg="rgba(255, 255, 255, 0.8)"
                backdropFilter="blur(10px)"
                borderRadius="xl" 
                boxShadow="2xl"
                border="1px solid"
                borderColor="gray.200"
                zIndex={150}
                display="flex"
                flexDirection="column"
                // Добавляем margin-bottom для надежности визуального зазора
                mb="10px" 
            >
                <Flex p={4} borderBottom="1px solid" borderColor="gray.100" align="center" justify="space-between">
                    <HStack gap={2}>
                    <BarChart3 size={18} color="var(--chakra-colors-blue-500)" />
                    <Heading size="xs">ТОПИКИ</Heading>
                    </HStack>
                    <Button {...commonBtnProps} size="sm" onClick={() => setShowTopicsPanel(false)} p={0}>
                    <X size={18} />
                    </Button>
                </Flex>
                <Box p={2} overflowY="auto" flex="1">
                <GetTopics />
                </Box>
            </Box>
            )}
        </Flex>
    </Flex>
    );
}