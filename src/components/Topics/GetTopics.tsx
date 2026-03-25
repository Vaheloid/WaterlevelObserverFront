import { 
    Badge, Box, Flex, Heading, Spinner, VStack, 
    Text, Button, HStack, Center, Separator, Grid
} from '@chakra-ui/react';
import { 
    FiTrash2, FiActivity, 
    FiDatabase, FiChevronRight 
} from 'react-icons/fi';
import type { GetTopicsProps, Topic } from '@/utils/types';

export default function TopicsList({ onTopicSelect, onTopicDelete, selectedTopicId, topics, loading }: GetTopicsProps) {
    const handleTopicClick = (topic: Topic) => {
        onTopicSelect(selectedTopicId === topic.ID_Topic ? null : topic.ID_Topic);
    };

    if (loading && topics.length === 0) {
        return (
            <Center minH="750px" w="full">
                <Spinner borderWidth="3px" animationDuration="0.8s" color="blue.500" size="xl"  />
            </Center>
        );
    }

    return (
        <Box w="full" p={6} bg="gray.50/30">
            <Box maxW="1400px" mx="auto">
                
                <VStack align="stretch" gap={4}>
                    <Flex justify="space-between" align="center" mb={2} px={1}>
                        <HStack gap={4}>
                            <Center bg="blue.500" p={2} borderRadius="md" color="white" shadow="0 2px 4px rgba(0,0,0,0.1)">
                                <FiDatabase size="18px" />
                            </Center>
                            <VStack align="start" gap={0}>
                                <Heading size="md" fontWeight="600" letterSpacing="-0.01em">
                                    Управление топиками
                                </Heading>
                            </VStack>
                        </HStack>
                        <Badge 
                            variant="subtle" 
                            bg="gray.200/50" 
                            color="gray.700" 
                            borderRadius="full" 
                            px={3} 
                            py={1}
                            textTransform="none"
                            fontWeight="500"
                        >
                            Всего: {topics.length}
                        </Badge>
                    </Flex>

                    <Grid 
                        templateColumns="repeat(auto-fill, minmax(360px, 1fr))" 
                        gap={5}
                        justifyContent="center" 
                    >
                        {topics.map((topic) => {
                            const isSelected = selectedTopicId === topic.ID_Topic;
                            
                            return (
                                <Box
                                    key={topic.ID_Topic}
                                    p={4}
                                    bg={isSelected ? "white" : "rgba(255, 255, 255, 0.7)"}
                                    backdropFilter="blur(20px) saturate(180%)"
                                    borderRadius="xl"
                                    border="1px solid"
                                    borderColor={isSelected ? "blue.500" : "gray.200/60"}
                                    boxShadow={isSelected ? "0 8px 15px rgba(0,0,0,0.08)" : "0 2px 4px rgba(0,0,0,0.02)"}
                                    onClick={() => handleTopicClick(topic)}
                                    cursor="pointer"
                                    position="relative"
                                    transition="all 0.15s ease-in-out"
                                    _hover={{ 
                                        bg: "white",
                                        borderColor: isSelected ? "blue.600" : "gray.300",
                                        shadow: "0 4px 12px rgba(0,0,0,0.05)",
                                        transform: "scale(1.01)"
                                    }}
                                >
                                    {isSelected && (
                                        <Box 
                                            position="absolute" 
                                            left="0" 
                                            top="25%" 
                                            bottom="25%" 
                                            w="3px" 
                                            bg="blue.500" 
                                            borderRadius="full" 
                                        />
                                    )}

                                    <Flex justify="space-between" align="start" mb={3}>
                                        <HStack gap={3}>
                                            <Center 
                                                bg={isSelected ? "blue.50" : "gray.100"} 
                                                boxSize="40px" 
                                                borderRadius="md" 
                                                color={isSelected ? "blue.600" : "gray.600"}
                                            >
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

                                    <Box 
                                        bg="gray.100/50" 
                                        px={2} 
                                        py={1.5} 
                                        borderRadius="md" 
                                        mb={4} 
                                        border="1px solid" 
                                        borderColor="gray.200/40"
                                    >
                                        <Text fontSize="sm" color="gray.600" fontFamily="Segoe UI, system-ui" opacity={0.8}>
                                            {topic.Path_Topic}
                                        </Text> 
                                    </Box>

                                    <Grid templateColumns="1fr 1fr 1fr" gap={2} mb={4} justifyItems="center">
                                        {/* Секция Координаты */}
                                        <VStack align="center" gap={0}>
                                            <Text fontSize="10px" color="gray.400" fontWeight="600" textTransform="uppercase">
                                                Координаты
                                            </Text>
                                            <Text fontSize="13px" fontWeight="600" color="gray.700" textAlign="center">
                                                {topic.Latitude_Topic.toFixed(2)}°, {topic.Longitude_Topic.toFixed(2)}°
                                            </Text>
                                        </VStack>

                                        {/* Секция Датчик */}
                                        <VStack 
                                            align="center" 
                                            gap={0} 
                                            borderLeft="1px solid" 
                                            borderColor="gray.200" 
                                            width="100%" 
                                        >
                                            <Text fontSize="10px" color="gray.400" fontWeight="600" textTransform="uppercase">
                                                Датчик
                                            </Text>
                                            <Text fontSize="13px" fontWeight="600" color="blue.600" textAlign="center">
                                                {topic.AltitudeSensor_Topic} м
                                            </Text>
                                        </VStack>

                                        {/* Секция Порог */}
                                        <VStack 
                                            align="center" 
                                            gap={0} 
                                            borderLeft="1px solid" 
                                            borderColor="gray.200" 
                                            width="100%"
                                        >
                                            <Text fontSize="10px" color="gray.400" fontWeight="600" textTransform="uppercase">
                                                Порог
                                            </Text>
                                            <Text fontSize="13px" fontWeight="600" color="teal.600" textAlign="center">
                                                {topic.Altitude_Topic} м
                                            </Text>
                                        </VStack>
                                    </Grid>

                                    <Separator mb={3} opacity="0.4" />

                                    <Button 
                                        size="sm" 
                                        variant="ghost"  
                                        w="full"
                                        h="32px"
                                        borderRadius="md"
                                        fontSize="sm"
                                        color="gray.600"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onTopicDelete(topic.ID_Topic);
                                            console.log('Delete', topic.ID_Topic);
                                        }}
                                        _hover={{ bg: "red.50", color: "red.600" }}
                                    >
                                        <FiTrash2 style={{ marginRight: '6px' }} size="14px" /> 
                                        Удалить топик
                                    </Button>
                                </Box>
                            );
                        })}
                    </Grid>
                </VStack>
            </Box>
        </Box>
    );
};