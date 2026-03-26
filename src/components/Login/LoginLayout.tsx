// components/Login/LoginLayout.tsx
import { Box, AbsoluteCenter } from "@chakra-ui/react"
import { type ReactNode } from "react"

interface LoginLayoutProps {
    children: ReactNode
}

export const LoginLayout = ({ children }: LoginLayoutProps) => {
    return (
    <Box
        bgGradient="radial(circle at 50% 50%, #4f79f2 0%, #1e3a8a 100%)"
        w="100%"
        h="100vh"
        position="relative"
        overflow="hidden"
    >
        <AbsoluteCenter axis="both" width={{ base: "95%", sm: "400px" }}>
        <Box
            w="100%"
            bg="rgba(255, 255, 255, 0.7)"
            backdropFilter="blur(10px) saturate(180%)"
            borderRadius="xl"
            border="1px solid"
            borderColor="whiteAlpha.400"
            boxShadow="0 8px 32px 0 rgba(0, 0, 0, 0.2)"
            p={{ base: "6", md: "10" }}
        >
            {children}
        </Box>
        </AbsoluteCenter>
    </Box>
    )
}