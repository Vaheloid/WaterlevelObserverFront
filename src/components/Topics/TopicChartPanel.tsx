import { useState, useRef, useLayoutEffect } from "react"
import { Box, Flex, HStack, Heading, Text, Center, VStack, IconButton } from "@chakra-ui/react"
import { FiTrendingUp, FiMinus, FiMaximize2 } from "react-icons/fi"
import type { TopicChartPanelProps } from "@/utils/types.ts"
import { Chart, useChart } from "@chakra-ui/charts"
import { Line, LineChart, CartesianGrid, Tooltip, XAxis, YAxis, Legend } from "recharts"
import { motion, AnimatePresence } from "framer-motion"
import { useColorModeValue } from "@/components/ui/color-mode"

export const TopicChartPanel = ({ topic, chartData, isListOpen, isSidebarOpen }: TopicChartPanelProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

    const gridStroke = useColorModeValue("#e6e6e6", "rgba(255, 255, 255, 0.1)");
    const LineFactGridStroke = useColorModeValue("#2B6CB0", "#016ada");
    const LineAvgGridStroke = useColorModeValue("#38A169", "#32c579");

    useLayoutEffect(() => {
        if (!containerRef.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                if (width > 0 && height > 0) {
                    setDimensions({ width, height });
                }
            }
        });

        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    const chart = useChart({
        data: chartData,
        series: [
            { name: "value", label: "Фактическое значение", color: LineFactGridStroke },
            { name: "ema", label: "Средняя скользящая", color: LineAvgGridStroke },
        ],
    });

    const sidebarWidth = isSidebarOpen ? 280 : 70;
    const listWidth = isListOpen ? 410 : 0;
    const finalX = 10 + sidebarWidth + listWidth + 10;

    if (!topic) return null;

    const values = chartData.map(d => d.value).filter((v): v is number => v !== null);
    const rawMin = values.length > 0 ? Math.min(...values) : 0;
    const rawMax = values.length > 0 ? Math.max(...values) : 120;
    const roundedMin = Math.floor((rawMin - 5) / 5) * 5;
    const roundedMax = Math.ceil((rawMax + 15) / 5) * 5;
    const customTicks = [];
    for (let i = roundedMin; i <= roundedMax; i += 5) { customTicks.push(i); }

    return (
        <motion.div
            initial={false}
            animate={{ 
                x: finalX,
                height: isCollapsed ? "70px" : "350px",
            }}
            transition={{ type: "tween", ease: [0.4, 0, 0.2, 1], duration: 0.3 }}
            style={{
                position: "absolute",
                bottom: "10px",
                left: 0,
                width: `calc(100vw - ${finalX + 10}px)`, 
                zIndex: 140,
                willChange: "transform", 
            }}
        >
            <Box
                w="full"
                h="full"
                bg={{ base: "rgba(255, 255, 255, 0.7)", _dark: "rgba(0, 0, 0, 0.7)" }}
                backdropFilter="blur(10px) saturate(180%)"
                borderRadius="2xl"
                display="flex"
                flexDirection="column"
                overflow="hidden"
                border="1px solid"
                borderColor="whiteAlpha.200"
            >
                <Flex p={4} align="center" justify="space-between" borderBottom={isCollapsed ? "none" : "1px solid"} borderColor="rgba(0, 0, 0, 0.05)">
                    <HStack gap={3}>
                        <Center bg="blue.500" p={2} borderRadius="lg" color="white">
                            <FiTrendingUp size={16} />
                        </Center>
                        <VStack align="start" gap={0}>
                            <Heading size="xs" textTransform="uppercase" color={{ base: "gray.800", _dark: "whiteAlpha.900" }}>Уровень воды</Heading>
                            <AnimatePresence>
                                {!isCollapsed && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                                        <Text fontSize="xs" color={{ base: "gray.600", _dark: "whiteAlpha.700" }}>{topic.Name_Topic}</Text>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </VStack>
                    </HStack>

                    <IconButton
                        bg={{ base: "white", _dark: "whiteAlpha.100" }}
                        shadow="xs" color={{ base: "black", _dark: "white" }}
                        aria-label="Collapse" variant="ghost" size="sm"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        borderRadius="full"
                        _hover={{ bg: { base: "gray.100", _dark: "whiteAlpha.300" } }}
                    >
                        {isCollapsed ? <FiMaximize2 size={16} /> : <FiMinus size={18} />}
                    </IconButton>
                </Flex>

                <Box 
                    ref={containerRef} 
                    flex="1" 
                    p={4}
                    position="relative"
                    display={isCollapsed ? "none" : "block"}
                    bg={{ base: "rgba(255, 255, 255, 0.8)", _dark: "rgba(0, 0, 0, 0.5)" }}
                >
                    {!isCollapsed && dimensions.width > 0 && (
                        <Box 
                            position="absolute" 
                            top="0" 
                            left="0" 
                            right="0" 
                            bottom="0" 
                            p={4}
                        >
                            <Chart.Root chart={chart} height="100%" width="100%">
                                <LineChart 
                                    width={dimensions.width}
                                    height={dimensions.height} 
                                    data={chart.data} 
                                    margin={{ top: 0, right: 10, left: 25, bottom: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="4 4" stroke={gridStroke} vertical={true} />
                                    <XAxis 
                                        dataKey="time" 
                                        axisLine={false} 
                                        tick={{ fontSize: 10 }} 
                                        angle={-30} 
                                        textAnchor="end" 
                                        height={50}
                                        interval={0}
                                        stroke={chart.color("border")}
                                    />
                                    <YAxis 
                                        domain={[roundedMin, roundedMax]} 
                                        ticks={customTicks} 
                                        axisLine={false} 
                                        tickLine={false}
                                        tick={{ fontSize: 10 }}
                                        tickMargin={10}
                                        stroke={chart.color("border")}
                                    />
                                    <Tooltip 
                                        content={<Chart.Tooltip />} 
                                        isAnimationActive={false} 
                                        cursor={false}
                                        animationDuration={100}
                                    />
                                    <Legend verticalAlign="top" content={<Chart.Legend interaction="hover" />} />
                                    
                                    {chart.series.map((item) => (
                                        <Line
                                            key={item.name}
                                            type="natural"
                                            dataKey={chart.key(item.name)}
                                            stroke={chart.color(item.color)}
                                            strokeWidth={2}
                                            dot={item.name === "value" ? { r: 3 } : false}
                                            strokeDasharray={item.name === "ema" ? "5 5" : undefined}
                                            opacity={chart.getSeriesOpacity(item.name)}
                                            isAnimationActive={true}
                                        />
                                    ))}
                                </LineChart>
                            </Chart.Root>
                        </Box>
                    )}
                </Box>
            </Box>
        </motion.div>
    )
}