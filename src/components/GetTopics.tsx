import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
	Badge, Box, Flex, Heading, Spinner, VStack, 
	Text, Button, HStack, Center, Separator, Grid
} from '@chakra-ui/react';
import { FiMapPin, FiHash, FiTrash2, FiActivity, FiTarget, FiDatabase } from 'react-icons/fi';

interface Topic {
	ID_Topic: number;
	Name_Topic: string;
	Path_Topic: string;	
	Latitude_Topic: number;
	Longitude_Topic: number;
	Altitude_Topic: number; 
	AltitudeSensor_Topic: number;
}

export default function TopicsList() {
	const [topics, setTopics] = useState<Topic[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const api = axios.create({
		baseURL: '/api',
		withCredentials: true,
	});

	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true);
				const response = await api.get<Topic[]>('/topics');
				setTopics(response.data);
				console.log("Список топиков:", response.data);
			} catch (err) {
				console.error("Ошибка загрузки:", err);
			} finally {
				setLoading(false);
			}
		};

		// 1. Вызываем сразу при монтировании
		loadData();

		// Вызов в интервале:
		setInterval(() => loadData(), 10000);
	}, []); // Эффект перезапустится только если изменится объект api // Пустой массив означает, что запрос выполнится один раз при монтировании

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
			borderColor="gray.100"
			boxShadow="sm"
			_focusVisible={{ boxShadow: "outline" }} _focus={{ boxShadow: "none" }}
			_hover={{ outline: "none", shadow: "xl", transform: "translateY(-2px)" }}
			transition="all 0.3s ease"
			>
			{/* ШАПКА: Имя и ID */}
			<Flex justify="space-between" align="start" mb={4}>
				<HStack gap={3}>
					<Center bg="blue.50" boxSize="38px" borderRadius="xl" color="blue.600">
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

			{/* ПУТЬ: Технический блок */}
			<Box bg="gray.50" p={2.5} borderRadius="lg" mb={5} border="1px solid" borderColor="gray.100">
				<Text fontSize="xs" color="blue.700" fontFamily="mono" lineClamp={1}>
				{topic.Path_Topic}
			</Text>	
			</Box>

			{/* ОСНОВНЫЕ ДАННЫЕ: Координаты | Датчик | Активация */}
			<Grid templateColumns="1.2fr 0.9fr 0.9fr" gap={0} mb={6} position="relative">
				{/* Координаты */}
				<VStack align="center" gap={0} pr={2}> {/* Изменено align="start" на align="center" */}
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

				{/* Высота датчика */}
				<VStack align="center" gap={0} borderLeft="1px solid" borderColor="gray.100">
				<Text fontSize="9px" color="gray.400" textTransform="uppercase" fontWeight="bold" mb={1}>
					Высота <br /> датчика
				</Text>
				<Text fontSize="sm" fontWeight="black" color="blue.600">
					{topic.AltitudeSensor_Topic}
				</Text>
				</VStack>

			  	{/* Высота активации */}
				<VStack align="center" gap={0} borderLeft="1px solid" borderColor="gray.100">
				<Text fontSize="9px" color="gray.400" textTransform="uppercase" fontWeight="bold" mb={1}>
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

			{/* КНОПКА */}
			<Button 
				size="sm" 
				variant="subtle"  
				w="full"
				borderRadius="xl"
				onClick={() => console.log('Delete', topic.ID_Topic)}
				_hover={{ bg: "red.200", outline: "none", }}
				_focusVisible={{ boxShadow: "outline" }} _focus={{ boxShadow: "none" }}
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