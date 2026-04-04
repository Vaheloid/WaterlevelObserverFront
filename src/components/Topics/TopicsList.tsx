import { 
    Badge, Box, Flex, Spinner, VStack, 
    Text, Button, HStack, Center, Separator, Grid,
    Heading
} from '@chakra-ui/react';
import { 
    FiTrash2, FiActivity, 
    FiDatabase, FiChevronRight 
} from 'react-icons/fi';
import type { TopicsListProps, Topic } from '@/utils/types.ts';
import { motion } from 'framer-motion';

export default function TopicsList({ onTopicSelect, onTopicDelete, selectedTopicId, topics, loading, isSelectionDisabled }: TopicsListProps & { isSelectionDisabled: boolean }) {

    const handleTopicClick = (topic: Topic) => {
        const isDeselcting = selectedTopicId === topic.ID_Topic;
        if (isSelectionDisabled) return;

        if (isDeselcting) {
            console.log("Отмена выбора топика:", topic.Name_Topic);
            onTopicSelect(null);
        } else {
            console.log("Выбран топик: ", topic.Name_Topic);
            onTopicSelect(topic.ID_Topic);
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
                <Flex justify="space-between" align="center" mb={5} px={0}>
                    <HStack gap={3}>
                        <Center bg="blue.500" p={2} borderRadius="md" color="white" shadow="0 2px 4px rgba(0,0,0,0.1)">
                            <FiDatabase size="18px" />
                        </Center>
                        <VStack align="start" gap={0}>
                            <Heading fontSize="15px" fontWeight="500" color={{ base: "gray.800", _dark: "whiteAlpha.900" }}>
                                Управление топиками
                            </Heading>
                        </VStack>
                    </HStack>
                    <Badge variant="subtle" bg={{ base: "white/50", _dark: "whiteAlpha.200" }} color={{ base: "gray.800", _dark: "whiteAlpha.900" }} borderRadius="full" px={3} py={1} textTransform="none" fontWeight="500" >
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
                            const shouldBlur = isSelectionDisabled && !isSelected;
                            
                            return (
                                <Box
                                as={motion.div}
                                    key={topic.ID_Topic}
                                    p={4}
                                    position="relative"
                                    borderRadius="xl"
                                    backdropFilter="blur(10px)"

                                    bg={isSelected 
                                        ? { base: "white", _dark: "whiteAlpha.200" } 
                                        : { base: "rgba(255, 255, 255, 0.7)", _dark: "whiteAlpha.200" }}
                                    
                                    transitionProperty="all"
                                    transitionDuration="0.4s"
                                    transitionTimingFunction="cubic-bezier(0.25, 1, 0.5, 1)"

                                    _hover={!isSelectionDisabled ? {
                                        bg: isSelected 
                                            ? { base: "white", _dark: "whiteAlpha.200" } 
                                            : { base: "white", _dark: "whiteAlpha.200" },
                                        shadow: "0 12px 24px rgba(0,0,0,0.15)",
                                        transform: "translateY(-5px)",
                                    } : {}}

                                    _active={!isSelectionDisabled ? { transform: "scale(0.97)" } : {}}
                                    
                                    border={{ base: "1px solid", _dark: "none" }}
                                    borderColor={{ base: "gray.200", _dark: "none" }}
                                    outline="none"
                                    boxShadow="none"
                                    
                                    css={{
                                        "&:focus": { boxShadow: "none !important", outline: "none !important" },
                                        "&:active": { boxShadow: "none !important", outline: "none !important" },
                                        WebkitTapHighlightColor: "transparent"
                                    }}

                                    onClick={() => handleTopicClick(topic)}
                                    onMouseDown={(e) => e.preventDefault()}
                                    
                                    opacity={shouldBlur ? 0.4 : 1}
                                    filter={shouldBlur ? "grayscale(0.8) blur(1px)" : "none"}
                                    cursor={isSelectionDisabled ? "not-allowed" : "pointer"}
                                >
                                    {isSelected && (
                                        <Box 
                                            position="absolute" 
                                            left="0" 
                                            top="20%" 
                                            bottom="20%" 
                                            w="4px" 
                                            bg={{ base: "blue.500", _dark: "white" }} 
                                            borderRadius="full" 
                                        />
                                    )}

                                    <Flex justify="space-between" align="start" mb={3}>
                                        <HStack gap={3}>
                                            <Center 
                                                transition="all 0.3s ease"
                                                bg={isSelected ? { base: "blue.50", _dark: "whiteAlpha.300" } : { base: "gray.100", _dark: "whiteAlpha.50" }} 
                                                boxSize="40px" 
                                                borderRadius="md" 
                                                color={isSelected ? { base: "blue.600", _dark: "white" } : { base: "gray.600", _dark: "whiteAlpha.800" }}
                                            >
                                                <FiActivity size="18px" />
                                            </Center> 
                                            <VStack align="start" gap={0}>
                                                <Text fontWeight="600" fontSize="sm" color={isSelected ? { base: "gray.800", _dark: "white" } : { base: "gray.800", _dark: "whiteAlpha.900" }} lineClamp={1}>
                                                    {topic.Name_Topic}
                                                </Text>
                                                <Text fontSize="11px" color={isSelected ? { base: "gray.500", _dark: "whiteAlpha.700" } : "gray.500"} fontFamily="mono">
                                                    #ID:{topic.ID_Topic}
                                                </Text>
                                            </VStack>
                                        </HStack>
                                        <FiChevronRight color={isSelected ? "white" : "#A0AEC0"} />
                                    </Flex>

                                    <Box bg={isSelected ? { base: "gray.100/50", _dark: "whiteAlpha.200" } : { base: "gray.100/50", _dark: "blackAlpha.300" }} px={2} py={1.5} borderRadius="md" mb={4}>
                                        <Text fontSize="sm" color={isSelected ? { base: "gray.600", _dark: "whiteAlpha.900" } : { base: "gray.600", _dark: "whiteAlpha.700" }} fontFamily="Segoe UI, system-ui">
                                            {topic.Path_Topic}
                                        </Text> 
                                    </Box>

                                    <Grid templateColumns="1fr 1fr 1fr" gap={2} mb={4} justifyItems="center">
                                        <VStack align="center" gap={0}>
                                            <Text fontSize="10px" color="gray.400" fontWeight="600" textTransform="uppercase">Координаты</Text>
                                            <Text fontSize="13px" fontWeight="600" color={{ base: "gray.700", _dark: "whiteAlpha.900" }} textAlign="center">
                                                {topic.Latitude_Topic}° <br/> {topic.Longitude_Topic}°
                                            </Text>
                                        </VStack>
                                        
                                        <VStack align="center" gap={0} borderLeft="1px solid" borderColor="gray.200" width="100%">
                                            <Text fontSize="10px" color="gray.400" fontWeight="600" textTransform="uppercase">Высота активации</Text>
                                            <Text fontSize="13px" fontWeight="600" color={isSelected ? { base: "teal.500", _dark: "whiteAlpha.900"} : "teal.500"} textAlign="center" marginTop="1">
                                                {topic.Altitude_Topic} м
                                            </Text>
                                        </VStack>

                                        <VStack align="center" gap={0} borderLeft="1px solid" borderColor="gray.200" width="100%" >
                                            <Text fontSize="10px" color="gray.400" fontWeight="600" textTransform="uppercase">Высота <br/> датчика</Text>
                                            <Text fontSize="13px" fontWeight="600" color={isSelected ? { base: "blue.500", _dark: "whiteAlpha.900"} : "blue.500"} textAlign="center" marginTop="1">
                                                {topic.AltitudeSensor_Topic} м
                                            </Text>
                                        </VStack>
                                    </Grid>

                                    <Separator mb={3} opacity={isSelected ? "0.6" : "0.2"} borderColor="whiteAlpha.400" />

                                    <Button 
                                        size="sm" 
                                        variant="ghost"  
                                        w="full"
                                        h="32px"
                                        borderRadius="md"
                                        fontSize="sm"
                                        bg={{ base: "gray.50", _dark: "whiteAlpha.100" }}
                                        color={{ base: "gray.600", _dark: "whiteAlpha.900" }}
                                        
                                        transition="all 0.3s ease"
                                        
                                        disabled={isSelectionDisabled} 
                                        cursor={isSelectionDisabled ? "not-allowed" : "pointer"}
                                        
                                        _hover={!isSelectionDisabled ? { 
                                            bg: "red.50",
                                            color: "red.600",
                                            transform: "scale(1.02)"
                                        } : {
                                            cursor: "not-allowed",
                                            bg: { base: "gray.50", _dark: "whiteAlpha.100" }
                                        }}

                                        _focus={{ outline: "none", boxShadow: "none" }}
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!isSelectionDisabled) {
                                                onTopicDelete(topic.ID_Topic);
                                            }
                                        }}
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
}