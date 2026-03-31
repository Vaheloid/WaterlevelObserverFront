import { useState, useEffect } from 'react'; // Добавили useState и useEffect
import { 
    Badge, Box, Flex, Heading, Spinner, VStack, 
    Text, Button, HStack, Center, Separator, Grid
} from '@chakra-ui/react';
import { 
    FiTrash2, FiActivity, 
    FiDatabase, FiChevronRight 
} from 'react-icons/fi';
import type { TopicsListProps, Topic } from '@/utils/types.ts';

export default function TopicsList({ onTopicSelect, onTopicDelete, selectedTopicId, topics, loading }: TopicsListProps) {
    // Локальное состояние блокировки
    const [isSelectionDisabled, setIsSelectionDisabled] = useState(false);

    // Очистка таймера при размонтировании компонента (хорошая практика)
    useEffect(() => {
        return () => {
            // Если компонент закроется до истечения 5 секунд, таймер не вызовет ошибку
        };
    }, []);

    const handleTopicClick = (topic: Topic) => {
        // 1. Если уже заблокировано — игнорируем клик
        if (isSelectionDisabled) return;

        const isDeselcting = selectedTopicId === topic.ID_Topic;

        if (isDeselcting) {
            console.log("Отмена выбора топика:", topic.Name_Topic);
            onTopicSelect(null);
        } else {
            console.log("Выбран топик: ", topic.Name_Topic);
            onTopicSelect(topic.ID_Topic);

            // 2. Активируем блокировку только при ВЫБОРЕ (не при отмене)
            setIsSelectionDisabled(true);

            // 3. Запускаем таймер на 5 секунд
            setTimeout(() => {
                setIsSelectionDisabled(false);
            }, 5000);
        }
    };

    if (loading && topics.length === 0) {
        return (
            <Center minH="750px" w="full">
                <Spinner borderWidth="3px" animationDuration="0.8s" color="blue.500" size="xl"  />
            </Center>
        );
    }

    return (
        <Box w="full" p={4}>
            <Box maxW="1400px" mx="auto">
                <Flex justify="space-between" align="center" mb={5}>
                    <HStack gap={4}>
                        <Center bg="blue.500" p={2} borderRadius="md" color="white" shadow="0 2px 4px rgba(0,0,0,0.1)">
                            <FiDatabase size="18px" />
                        </Center>
                        <VStack align="start" gap={0}>
                            <Heading size="sm" fontWeight="500" letterSpacing="-0.01em">
                                Управление топиками
                            </Heading>
                        </VStack>
                    </HStack>
                    <Badge variant="subtle" bg="white/50" color="gray.700" borderRadius="full" px={3} py={1}>
                        Всего: {topics.length}
                    </Badge>
                </Flex>

                <VStack align="stretch" gap={4}>
                    <Grid 
                        templateColumns="repeat(auto-fill, minmax(360px, 1fr))" 
                        gap={5}
                        justifyContent="center" 
                    >
                        {topics.map((topic) => {
                            const isSelected = selectedTopicId === topic.ID_Topic;
                            // ЗАМЫЛИВАНИЕ: если выбор заблокирован и это не текущий выбранный топик
                            const shouldBlur = isSelectionDisabled && !isSelected;

                            return (
                                <Box
                                    key={topic.ID_Topic}
                                    p={4}
                                    bg={isSelected ? "white" : "rgba(255, 255, 255, 0.7)"}
                                    borderRadius="xl"
                                    border="1px solid"
                                    borderColor={isSelected ? "blue.500" : "gray.200/60"}
                                    onClick={() => handleTopicClick(topic)}
                                    position="relative"
                                    
                                    // --- ЭФФЕКТ ПРИГЛУШЕНИЯ ---
                                    // Уменьшаем прозрачность до 0.4 для сильного акцента на выбранном
                                    opacity={shouldBlur ? 0.4 : 1}
                                    // Добавляем легкое обесцвечивание, чтобы карточки не отвлекали цветом
                                    filter={shouldBlur ? "grayscale(0.8)" : "none"}
                                    
                                    // Запрещаем взаимодействие с курсором
                                    cursor={isSelectionDisabled ? "not-allowed" : "pointer"}

                                    // --- БЫСТРАЯ АНИМАЦИЯ ---
                                    transition="all 0.15s ease-out" 
                                    
                                    _hover={
                                        isSelectionDisabled 
                                        ? { 
                                            // Стили при наведении во время блокировки
                                            cursor: "not-allowed",
                                            transform: "none", // Убираем подпрыгивание
                                            shadow: "none"     // Убираем появление тени
                                        } 
                                        : { 
                                            // Обычные стили наведения
                                            bg: "white",
                                            borderColor: isSelected ? "blue.600" : "gray.300",
                                            shadow: "0 4px 12px rgba(0,0,0,0.08)",
                                            transform: "translateY(-2px)" 
                                        }
                                    }
                                >
                                    {isSelected && (
                                        <Box position="absolute" left="0" top="25%" bottom="25%" w="3px" bg="blue.500" borderRadius="full" />
                                    )}

                                    <Flex justify="space-between" align="start" mb={3}>
                                        <HStack gap={3}>
                                            <Center bg={isSelected ? "blue.50" : "gray.100"} boxSize="40px" borderRadius="md" color={isSelected ? "blue.600" : "gray.600"}>
                                                <FiActivity size="18px" />
                                            </Center> 
                                            <VStack align="start" gap={0}>
                                                <Text fontWeight="600" fontSize="sm" color="gray.800" lineClamp={1}>
                                                    {topic.Name_Topic}
                                                </Text>
                                                <Text fontSize="11px" color="gray.500" fontFamily="mono">
                                                    #ID:{topic.ID_Topic}
                                                </Text>
                                            </VStack>
                                        </HStack>
                                        <FiChevronRight color="#A0AEC0" />
                                    </Flex>

                                    <Box bg="gray.100/50" px={2} py={1.5} borderRadius="md" mb={4}>
                                        <Text fontSize="sm" color="gray.600" opacity={0.8}>
                                            {topic.Path_Topic}
                                        </Text> 
                                    </Box>

                                    <Grid templateColumns="1fr 1fr 1fr" gap={2} mb={4} justifyItems="center">
                                        <VStack align="center" gap={0}>
                                            <Text fontSize="10px" color="gray.400" fontWeight="600">КООРДИНАТЫ</Text>
                                            <Text fontSize="12px" fontWeight="600" color="gray.700">
                                                {topic.Latitude_Topic}°<br/>{topic.Longitude_Topic}°
                                            </Text>
                                        </VStack>
                                        <VStack align="center" gap={0} borderLeft="1px solid" borderColor="gray.200" w="full">
                                            <Text fontSize="10px" color="gray.400" fontWeight="600">АКТИВАЦИЯ</Text>
                                            <Text fontSize="12px" fontWeight="600" color="teal.600">{topic.Altitude_Topic} м</Text>
                                        </VStack>
                                        <VStack align="center" gap={0} borderLeft="1px solid" borderColor="gray.200" w="full">
                                            <Text fontSize="10px" color="gray.400" fontWeight="600">ДАТЧИК</Text>
                                            <Text fontSize="12px" fontWeight="600" color="blue.600">{topic.AltitudeSensor_Topic} м</Text>
                                        </VStack>
                                    </Grid>

                                    <Separator mb={3} opacity="0.4" />

                                    <Button 
                                        size="sm" variant="ghost" w="full" h="32px"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onTopicDelete(topic.ID_Topic);
                                        }}
                                        _hover={{ bg: "red.50", color: "red.600" }}
                                    >
                                        <FiTrash2 style={{ marginRight: '6px' }} size="14px" /> Удалить
                                    </Button>
                                </Box>
                            );
                        })}
                    </Grid>
                </VStack>
            </Box>
        </Box>
    );
}