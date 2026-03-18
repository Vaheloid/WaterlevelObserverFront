import { useState } from "react"
import { Box, Flex, HStack, Heading, Text, Center, VStack, IconButton } from "@chakra-ui/react"
import { FiTrendingUp, FiX, FiMinus, FiMaximize2 } from "react-icons/fi"
import type { Topic } from "@/utils/types"
import { Chart, useChart } from "@chakra-ui/charts"
import { Line, LineChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { motion, AnimatePresence } from "framer-motion"

interface TopicChartPanelProps {
    topic: Topic | null
    onClose: () => void
    isListOpen: boolean
}

export const TopicChartPanel = ({ topic, onClose, isListOpen }: TopicChartPanelProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false)

    const chart = useChart({
        data: [
            { temp: -20, month: "January" }, { temp: -10, month: "February" },
            { temp: 80, month: "March" }, { temp: 5, month: "April" },
            { temp: 10, month: "May" }, { temp: 20, month: "June" },
            { temp: 30, month: "July" }, { temp: 4, month: "August" },
            { temp: 35, month: "September" }, { temp: 40, month: "October" },
            { temp: -10, month: "November" }, { temp: -20, month: "December" },
        ],
        series: [{ name: "temp", color: "blue.500" }],
    })

    if (!topic) return null

    return (
        <Box
            position="absolute"
            bottom="10px"
            left={isListOpen ? "420px" : "10px"}
            right="10px"
            height={isCollapsed ? "70px" : "250px"} 
            bg="rgba(255, 255, 255, 0.8)"
            backdropFilter="blur(10px) saturate(180%)"
            
            borderRadius="2xl"
            boxShadow="2xl"
            border="1px solid"
            borderColor="rgba(255, 255, 255, 0.3)"
            zIndex={140}
            display="flex"
            flexDirection="column"
            overflow="hidden"
            transition="height 0.4s cubic-bezier(0.4, 0, 0.2, 1), left 0.4s ease, bg 0.3s ease"
        >
            {/* Шапка */}
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
                        <Heading size="xs" textTransform="uppercase" color="gray.800">Данные уровня воды</Heading>
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
                        aria-label="Collapse"
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        borderRadius="full"
                        _hover={{ bg: "rgba(0, 0, 0, 0.05)" }}
                    >
                        {isCollapsed ? <FiMaximize2 size={16} /> : <FiMinus size={18} />}
                    </IconButton>

                    <IconButton
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

            {/* Контейнер графика */}
            <Box 
                flex="1" 
                p={4}
                minH={0}
                position="relative"
                visibility={isCollapsed ? "hidden" : "visible"}
                bg="rgba(255, 255, 255, 0.8)"
                backdropFilter="blur(10px) saturate(180%)"
                borderRadius="xl"
                opacity={isCollapsed ? 0 : 1}
                transition="opacity 0.2s ease, transform 0.2s ease"
                transform={isCollapsed ? "translateY(10px)" : "translateY(0)"}
            >
                <Chart.Root chart={chart} height="100%" width="100%">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chart.data} margin={{ top: 5, right: 10, left: -5, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis 
                                axisLine={false} 
                                dataKey={chart.key("month")} 
                                tickFormatter={(v) => v.slice(0, 3)} 
                                stroke={chart.color("border")} 
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tickMargin={10} 
                                dataKey={chart.key("temp")} 
                                stroke={chart.color("border")} 
                            />
                            <Tooltip 
                                animationDuration={100} 
                                content={<Chart.Tooltip hideIndicator />} 
                            />
                            
                            {/* Градиент для Area */}
                            <defs>
                                <linearGradient id="uv-gradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3182ce" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3182ce" stopOpacity={0}/>
                                </linearGradient>
                            </defs>


                            <Line
                                isAnimationActive={false}
                                type="monotone"
                                dataKey={chart.key("temp")}
                                stroke="#3182ce"
                                strokeWidth={3}
                                dot={{ r: 4, fill: "#3182ce", strokeWidth: 2, stroke: "white" }}
                                activeDot={{ r: 6, fill: "#3182ce", strokeWidth: 2, stroke: "white" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Chart.Root>
            </Box>
        </Box>
    )
}