import { useEffect, useState } from 'react';
import { 
    Badge, Box, Flex, Heading, Spinner, VStack, 
    Text, Button, HStack, Center, Separator, Grid 
} from '@chakra-ui/react';
import { FiMapPin, FiHash, FiTrash2, FiActivity, FiTarget, FiDatabase } from 'react-icons/fi';
import { api } from '../../utils/api';

interface Topic {
    ID_Topic: number;
    Name_Topic: string;
    Path_Topic: string; 
    Latitude_Topic: number;
    Longitude_Topic: number;
    Altitude_Topic: number; 
    AltitudeSensor_Topic: number;
}

// 1. Добавляем selectedTopicId в пропсы
interface GetTopicsProps {
    onTopicSelect: (id: number) => void;
    selectedTopicId: number | null; // Теперь мы получаем это снаружи
}

export default function TopicsList({ onTopicSelect, selectedTopicId }: GetTopicsProps) {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // 2. Локальный selectedId больше не нужен

    const handleTopicClick = (topic: Topic) => {
        // 3. Просто сообщаем родителю о выборе
        onTopicSelect(topic.ID_Topic);
        console.log("Выбран топик:", topic.Name_Topic, "ID:", topic.ID_Topic);
    };

    const loadData = async () => {
        try {
            const response = await api.get<Topic[]>('/topics');
            setTopics(response.data);
            console.log("Список топиков: ", response.data);
        } catch (err) {
            console.error("Ошибка загрузки:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        const interval = setInterval(() => loadData(), 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading && topics.length === 0) {
        return (
            <Center h="250px" w="full">
                <Spinner borderWidth="3px" animationDuration="0.8s" color="blue.500" size="xl" />
            </Center>
        );
    }

    return (
        <VStack align="stretch" gap={6} w="full" p={2}>
            <Flex justify="space-between" align="center" px={1}>
                <HStack gap={3}>
                    <FiDatabase size="20px" color="var(--chakra-colors-blue-500)" />
                    <Heading size="md" fontWeight="bold">Управление топиками</Heading>
                </HStack>
                <Badge variant="subtle" colorPalette="blue" borderRadius="full" px={3}>
                    Устройств: {topics.length} 
                </Badge>
            </Flex>

            <Grid templateColumns="repeat(auto-fill, minmax(340px, 1fr))" gap={5}>
                {topics.map((topic) => (
                    <Box
                        key={topic.ID_Topic}
                        p={5}
                        bg="white"
                        borderRadius="2xl"
                        borderWidth="1px"
                        // 4. Используем selectedTopicId из пропсов для стилизации
                        borderColor={selectedTopicId === topic.ID_Topic ? "blue.400" : "gray.100"}
                        boxShadow={selectedTopicId === topic.ID_Topic ? "md" : "sm"}
                        onClick={() => handleTopicClick(topic)}
                        cursor="pointer"
                        _hover={{ 
                            shadow: "xl", 
                            transform: "translateY(-4px)",
                            borderColor: "blue.200" 
                        }}
                        _active={{ transform: "scale(0.98)" }}
                        transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
                        position="relative"
                    >
                        {/* ШАПКА: Имя и ID */}
                        <Flex justify="space-between" align="start" mb={4}>
                            <HStack gap={3}>
                                <Center 
                                    // 5. И здесь тоже используем пропс
                                    bg={selectedTopicId === topic.ID_Topic ? "blue.500" : "blue.50"} 
                                    boxSize="38px" 
                                    borderRadius="xl" 
                                    color={selectedTopicId === topic.ID_Topic ? "white" : "blue.600"}
                                    transition="all 0.2s"
                                >
                                    <FiActivity size="18px" />
                                </Center>   
                                <VStack align="start" gap={0}>
                                    <Text fontWeight="bold" fontSize="md" color="gray.800" lineClamp={1}>
                                        {topic.Name_Topic}
                                    </Text>
                                    <HStack gap={1} color="gray.400">
                                        <FiHash size="10px" />
                                        <Text fontSize="10px" fontWeight="bold">
                                            ID: {topic.ID_Topic}
                                        </Text>
                                    </HStack>
                                </VStack>
                            </HStack>
                        </Flex>

                        {/* ПУТЬ */}
                        <Box bg="gray.50" p={2.5} borderRadius="lg" mb={5} border="1px solid" borderColor="gray.100">
                            <Text fontSize="xs" color="blue.700" fontFamily="mono" lineClamp={1}>
                                {topic.Path_Topic}
                            </Text> 
                        </Box>

                        {/* ОСНОВНЫЕ ДАННЫЕ */}
                        <Grid templateColumns="1.2fr 0.9fr 0.9fr" gap={0} mb={6}>
                            <VStack align="center" gap={0} pr={2}>
                                <Text fontSize="9px" color="gray.400" textTransform="uppercase" fontWeight="bold" mb={1}>
                                    Координаты
                                </Text>
                                <HStack gap={1}>
                                    <FiMapPin size="11px" color="var(--chakra-colors-red-400)" />
                                    <Text fontSize="md" fontWeight="bold" color="gray.700">
                                        {topic.Latitude_Topic.toFixed(2)}, {topic.Longitude_Topic.toFixed(2)}
                                    </Text>
                                </HStack>
                            </VStack>

                            <VStack align="center" gap={0} borderLeft="1px solid" borderColor="gray.100">
                                <Text fontSize="9px" color="gray.400" textTransform="uppercase" fontWeight="bold" mb={1} textAlign="center">
                                    Высота <br /> датчика
                                </Text>
                                <Text fontSize="sm" fontWeight="black" color="blue.600">
                                    {topic.AltitudeSensor_Topic}м
                                </Text>
                            </VStack>

                            <VStack align="center" gap={0} borderLeft="1px solid" borderColor="gray.100">
                                <Text fontSize="9px" color="gray.400" textTransform="uppercase" fontWeight="bold" mb={1} textAlign="center">
                                    Высота <br />активации
                                </Text>
                                <HStack gap={1}>
                                    <FiTarget size="11px" color="var(--chakra-colors-teal-500)" />
                                    <Text fontSize="sm" fontWeight="black" color="teal.600">
                                        {topic.Altitude_Topic}м
                                    </Text>
                                </HStack>
                            </VStack>
                        </Grid>

                        <Separator mb={4} opacity="0.7" />

                        {/* КНОПКА (Важно: stopPropagation, чтобы клик по кнопке не вызывал клик по карточке) */}
                        <Button 
                            size="sm" 
                            variant="subtle"  
                            w="full"
                            borderRadius="xl"
                            onClick={(e) => {
                                e.stopPropagation();
                                console.log('Delete', topic.ID_Topic);
                            }}
                            _hover={{ bg: "red.100", color: "red.600" }}
                        >
                            <FiTrash2 style={{ marginRight: '8px' }} /> 
                            Удалить топик
                        </Button>
                    </Box>
                ))}
            </Grid>
        </VStack>
    );
};