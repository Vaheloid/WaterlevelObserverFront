import { useState, useRef, useLayoutEffect } from "react"
import { Box, Flex, HStack, Heading, Text, Center, VStack, IconButton } from "@chakra-ui/react"
import { FiTrendingUp, FiMinus, FiMaximize2 } from "react-icons/fi"
import type { TopicChartPanelProps } from "@/utils/types.ts"
import { Chart, useChart } from "@chakra-ui/charts"
import { Line, LineChart, CartesianGrid, Tooltip, XAxis, YAxis, Legend } from "recharts"
import { motion } from "framer-motion"
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
            window.requestAnimationFrame(() => {
                for (const entry of entries) {
                    const { width, height } = entry.contentRect;
                    if (width > 0 && height > 0) {
                        setDimensions({ width, height });
                    }
                }
            });
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
    const totalOffset = sidebarWidth + listWidth + 20;

    if (!topic) return null;

    const values = chartData.map(d => d.value).filter((v): v is number => v !== null);
    const roundedMin = Math.floor(((values.length > 0 ? Math.min(...values) : 0) - 5) / 5) * 5;
    const roundedMax = Math.ceil(((values.length > 0 ? Math.max(...values) : 120) + 15) / 5) * 5;
    const customTicks = Array.from({ length: (roundedMax - roundedMin) / 5 + 1 }, (_, i) => roundedMin + i * 5);

    return (
        <motion.div
            custom={totalOffset}
            initial={{ opacity: 0, x: totalOffset, scale: 0.95 }}
            animate={{ 
                opacity: 1, 
                x: totalOffset, 
                scale: 1,
            }}
            exit={{ opacity: 0, x: totalOffset - 20, scale: 0.95 }}
            transition={{ 
                type: "spring", 
                stiffness: 180, 
                damping: 40,
                mass: 0.8
            }}
            style={{
                position: "absolute",
                bottom: "10px",
                left: 0,
                width: `calc(100vw - ${totalOffset + 30}px)`, 
                zIndex: 140,
                display: "flex",
                flexDirection: "column",
                pointerEvents: "auto",
                willChange: "transform, opacity",
                backdropFilter: "blur(10px) saturate(180%)",
                borderRadius: "12px",
            }}
        >
            <Box
                w="full"
                overflow="hidden"
                transition="height 0.3s ease-in-out"
                height={isCollapsed ? "70px" : "350px"}
                bg={{ base: "rgba(255, 255, 255, 0.7)", _dark: "rgba(0, 0, 0, 0.7)" }}
                backdropFilter="blur(10px) saturate(180%)"
                borderRadius="2xl"
                display="flex"
                flexDirection="column"
                border="1px solid"
                borderColor="whiteAlpha.200"
            >
                {/* Header */}
                <Flex p={4} align="center" justify="space-between" borderBottom={isCollapsed ? "none" : "1px solid"} borderColor="rgba(0, 0, 0, 0.05)">
                    <HStack gap={3}>
                        <Center bg="blue.500" p={2} borderRadius="lg" color="white">
                            <FiTrendingUp size={16} />
                        </Center>
                        <VStack align="start" gap={0}>
            
                            <Heading size="xs" textTransform="uppercase" color={{ base: "gray.800", _dark: "whiteAlpha.900" }}>Уровень воды</Heading>
                            
                                {!isCollapsed && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                                        <Text fontSize="xs" color={{ base: "gray.600", _dark: "whiteAlpha.700" }}>{topic.Name_Topic}</Text>
                                    </motion.div>
                                )}
                            
                        </VStack>
                    </HStack>

                    <IconButton
                        aria-label="Collapse"
                        variant="ghost"
                        size="sm"
                        shadow="xs"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        borderRadius="full"
                        color={{ base: "black", _dark: "white" }} bg={{ base: "white", _dark: "whiteAlpha.100" }}
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
                        >
                        {isCollapsed ? <FiMaximize2 /> : <FiMinus />}
                    </IconButton>
                </Flex>

                {/* Chart Container */}
                <Box 
                    ref={containerRef} 
                    flex="1" 
                    p={4} 
                    position="relative" 
                    opacity={isCollapsed ? 0 : 1}
                    visibility={isCollapsed ? "hidden" : "visible"}
                    transition="opacity 0.2s"
                    bg={{ base: "rgba(255, 255, 255, 0.8)", _dark: "rgba(0, 0, 0, 0.5)" }}
                >
                    {!isCollapsed && dimensions.width > 0 && (
                        <Box position="absolute" inset={0} p={4} style={{ transform: 'translateZ(0)' }}>
                            <Chart.Root chart={chart} height="100%" width="100%"css={{
                                "& text": {
                                    fill: { base: "gray.500", _dark:"whiteAlpha.800" }
                                },
                                
                                "& *": {
                                    color: { base: "gray.800",_dark:"whiteAlpha.800" }
                                },

                            }}>
                                <LineChart 
                                    width={dimensions.width} 
                                    height={dimensions.height} 
                                    data={chartData} 
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
                                    />
                                    <YAxis 
                                        domain={[roundedMin, roundedMax]} 
                                        ticks={customTicks} 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 10 }}
                                    />
                                    <Tooltip content={<Chart.Tooltip />} isAnimationActive={false} cursor={false} />
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