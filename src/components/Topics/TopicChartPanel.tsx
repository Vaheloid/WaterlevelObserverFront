import { useState } from "react"
import { Box, Flex, HStack, Heading, Text, Center, VStack, IconButton } from "@chakra-ui/react"
import { FiTrendingUp, FiMinus, FiMaximize2 } from "react-icons/fi"
import type { TopicChartPanelProps } from "@/utils/types.ts"
import { Chart, useChart } from "@chakra-ui/charts"
import { Line, LineChart, CartesianGrid, Tooltip, XAxis, YAxis, Legend } from "recharts"
import { motion, AnimatePresence } from "framer-motion"
import { useColorModeValue } from "../ui/color-mode"

export const TopicChartPanel = ({ topic, chartData, isListOpen, isSidebarOpen }: TopicChartPanelProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const gridStroke = useColorModeValue("#e6e6e6", "rgba(255, 255, 255, 0.1)");
    const LineFactGridStroke = useColorModeValue("#2B6CB0", "#016ada");
    const LineAvgGridStroke = useColorModeValue("#38A169", "#32c579");
    const chart = useChart({
        data: chartData,
        series: [
            { name: "value", label: "Фактическое значение", color: LineFactGridStroke },
            { name: "ema", label: "Средняя скользящая", color: LineAvgGridStroke },
        ],
    });

    const sidebarWidth = isSidebarOpen ? 280 : 70;
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
            bg={{ base: "rgba(255, 255, 255, 0.7)", _dark: "rgba(0, 0, 0, 0.7)" }}
            backdropFilter="blur(10px) saturate(180%)"
            borderRadius="2xl"
            
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
                        <Heading size="xs" textTransform="uppercase" color={{ base: "gray.800", _dark: "whiteAlpha.900" }}>Уровень воды</Heading>
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <Text fontSize="xs" color={{ base: "gray.600", _dark: "whiteAlpha.700" }}>{topic.Name_Topic}</Text>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </VStack>
                </HStack>

                <HStack gap={1}>
                    <IconButton
                        bg={{ base: "white", _dark: "whiteAlpha.100" }}
                        shadow="xs"
                        color={{ base: "black", _dark: "white" }}
                        aria-label="Collapse"
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        borderRadius="full"
                        border="0"
                        outline="0"
                        _focus={{
                            outline: "none",
                            border: "none"
                        }}
                        _focusVisible={{
                            outline: "none",
                            border: "none"
                        }}
                        _active={{
                            outline: "none"
                        }}
                        _hover={{ 
                            bg: { base: "gray.100", _dark: "whiteAlpha.300" },
                            border: "none",
                            outline: "none",
                        }}

                        onMouseDown={(e) => e.preventDefault()}
                    >
                        {isCollapsed ? <FiMaximize2 size={16} /> : <FiMinus size={18} />}
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
                bg={{ base: "rgba(255, 255, 255, 0.8)", _dark: "rgba(0, 0, 0, 0.5)" }}
            >
            {!isCollapsed && (
                <Chart.Root chart={chart} height="100%" width="100%" color= {{ base: "black", _dark: "white"}} 
                    css={{
                        "& text": {
                            fill: { base: "gray.500", _dark:"whiteAlpha.800" }
                        },
                        "& .recharts-cartesian-axis-tick-value": {
                            
                        },
                        "& *": {
                            color: { _dark:"whiteAlpha.800" }
                        }
                    }}
                >
                    <LineChart data={chart.data} responsive margin={{ top: 0, right: 10, left: 25, bottom: 20 }} >
                        <CartesianGrid strokeDasharray="4 4" stroke={gridStroke} />
                        <XAxis
                            axisLine={false}
                            dataKey="time"
                            tick={{ fontSize: 10, fill: "#FF0000" }}
                            angle={-30}
                            textAnchor="end"
                            height={50}
                            stroke="#A0AEC0"
                            interval={0}
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
                        <Tooltip animationDuration={100} itemStyle={{ color: '#ffffff' }} labelStyle={{ color: '#ваш_цвет' }} content={<Chart.Tooltip />} />
                        <Legend
                            verticalAlign="top"
                            align="center"
                            wrapperStyle={{ 
                                color: "white", 
                                fill: "white",
                            }}
                            content={<Chart.Legend interaction="hover"
                            />}
                        />
                        
                        <Line
                            name="Фактическое значение"
                            isAnimationActive={true}
                            type="natural"
                            dataKey="value"
                            stroke={LineFactGridStroke}
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
                            stroke={LineAvgGridStroke}
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