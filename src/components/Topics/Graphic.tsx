import { useState } from "react"
import { Box, Flex, HStack, Heading, Text, Center, VStack, IconButton } from "@chakra-ui/react"
import { FiTrendingUp, FiX, FiMinus, FiMaximize2 } from "react-icons/fi"
import type { Topic } from "@/utils/types"
import { Chart, useChart } from "@chakra-ui/charts"
import { Line, LineChart, CartesianGrid, Tooltip, XAxis, YAxis, Legend } from "recharts"
import { motion, AnimatePresence } from "framer-motion"
import { useTopicData } from "@/hooks/useTopicData"

interface TopicChartPanelProps {
    topic: Topic | null
    onClose: () => void
    isListOpen: boolean
    isSidebarOpen: boolean
}

export const TopicChartPanel = ({ topic, onClose, isListOpen, isSidebarOpen }: TopicChartPanelProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false)

    const { chartData } = useTopicData(topic?.ID_Topic || null);

    const chart = useChart({
        data: chartData,
        series: [
            { name: "value", label: "Фактическое значение", color: "#2B6CB0" },
            { name: "ema", label: "Средняя скользящая", color: "#38A169" },
        ],
    });

    const sidebarWidth = isSidebarOpen ? 280 : 80;
    const listWidth = isListOpen ? 400 + 10 : 0;
    const finalLeft = 10 + sidebarWidth + 10 + listWidth;

    if (!topic) return null
    
    const values = chartData
        .map(d => d.value)
        .filter((v): v is number => v !== null);

    const rawMin = values.length > 0 ? Math.min(...values) : 0;
    const rawMax = values.length > 0 ? Math.max(...values) : 120;

    const roundedMin = Math.floor((rawMin - 5) / 5) * 5;
    const roundedMax = Math.ceil((rawMax + 15) / 5) * 5;

    const customTicks = [];
    for (let i = roundedMin; i <= roundedMax; i += 5) {
        customTicks.push(i);
    }

    return (
        <Box
            position="absolute"
            bottom="10px"
            left={`${finalLeft}px`}
            right="10px"
            height={isCollapsed ? "70px" : "350px"} 
            bg="rgba(255, 255, 255, 0.7)"
            backdropFilter="blur(10px) saturate(180%)"
            borderRadius="2xl"
            boxShadow="2xl"
            border="1px solid"
            borderColor="rgba(255, 255, 255, 0.3)"
            zIndex={140}
            display="flex"
            flexDirection="column"
            overflow="hidden"
            transition="height 0.4s cubic-bezier(0.4, 0, 0.2, 1), left 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        >
            <Flex 
                p={4} 
                align="center" 
                justify="space-between"
                borderBottom={isCollapsed ? "none" : "1px solid"} 
                borderColor="rgba(0, 0, 0, 0.05)"
            >
                <HStack gap={3}>
                    <Center bg="blue.500" p={2} borderRadius="lg" color="white">
                        <FiTrendingUp size={16} />
                    </Center>
                    <VStack align="start" gap={0}>
                        <Heading size="xs" textTransform="uppercase" color="gray.800">Уровень воды</Heading>
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <Text fontSize="xs" color="gray.600">{topic.Name_Topic}</Text>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </VStack>
                </HStack>

                <HStack gap={1}>
                    <IconButton
                        bg="white"
                        shadow="xs"
                        aria-label="Collapse"
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        borderRadius="full"
                    >
                        {isCollapsed ? <FiMaximize2 size={16} /> : <FiMinus size={18} />}
                    </IconButton>
                    <IconButton
                        bg="white"
                        shadow="xs"
                        aria-label="Close"
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        borderRadius="full"
                        _hover={{ bg: "rgba(255, 0, 0, 0.1)", color: "red.500" }}
                    >
                        <FiX size={18} />
                    </IconButton>
                </HStack>
            </Flex>

            <Box 
                flex="1" 
                p={4}
                minH="200px"
                position="relative" 
                visibility={isCollapsed ? "hidden" : "visible"}
                opacity={isCollapsed ? 0 : 1}
                transition="opacity 0.2s ease"
                bg="white"
            >
            {!isCollapsed && (
                <Chart.Root chart={chart} height="100%" width="100%">
                    <LineChart data={chart.data} responsive margin={{ top: 0, right: 10, left: 25, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="4 4" stroke="#e6e6e6" />
                        <XAxis
                            axisLine={false}
                            dataKey="time" 
                            tick={{ fontSize: 10 }}
                            angle={-30}
                            textAnchor="end"
                            height={50} 
                            stroke="#A0AEC0" 
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tickMargin={10} 
                            stroke="#A0AEC0"
                            allowDataOverflow={false} 
                            domain={[roundedMin, roundedMax]} 
                            ticks={customTicks}
                        />
                        <Tooltip animationDuration={100} content={<Chart.Tooltip />} />
                        <Legend
                            verticalAlign="top"
                            align="center"
                            content={<Chart.Legend interaction="hover"/>}
                        />
                        
                        <Line
                            name="Фактическое значение"
                            isAnimationActive={true}
                            type="natural"
                            dataKey="value"
                            stroke="#2B6CB0"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                            opacity={chart.getSeriesOpacity("value")}
                        />
                        <Line
                            name="Средняя скользящая"
                            isAnimationActive={true}
                            type="natural"
                            dataKey="ema"
                            stroke="#38A169"
                            strokeDasharray="5 5"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 5 }}
                            opacity={chart.getSeriesOpacity("ema")}
                        />
                    </LineChart>
                </Chart.Root>
            )}
            </Box>
        </Box>
    )
}