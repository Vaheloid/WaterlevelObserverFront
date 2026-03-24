import { Button, Center, Text, type ButtonProps } from "@chakra-ui/react"
import { type ReactElement } from "react"

interface NavButtonProps extends ButtonProps {
  icon: ReactElement
  label?: string
  isExpanded: boolean
  isActive?: boolean
}

export const NavButton = ({ icon, label, isExpanded, isActive, ...props }: NavButtonProps) => (
  <Button
    variant="ghost"
    h="48px"
    w={isExpanded ? "full" : "48px"}
    p={0}
    shadow="xs"
    bg={isActive ? "blue.50" : "white"}
    borderColor="rgba(255, 255, 255, 0.3)"
    color={isActive ? "blue.600" : "gray.600"}
    borderRadius="md"
    _hover={{ bg: "gray.200" }}
    _active={{ bg: "gray.300" }}
    justifyContent={isExpanded ? "flex-start" : "center"}
    {...props}
  >
    <Center minW="48px" h="48px">
      {icon}
    </Center>
    {isExpanded && label && (
      <Text fontWeight="bold" ml={1} whiteSpace="nowrap">
        {label}
      </Text>
    )}
  </Button>
)