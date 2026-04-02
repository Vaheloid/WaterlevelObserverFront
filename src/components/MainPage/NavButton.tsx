import type { NavButtonProps } from "@/utils/types";
import { Button, Center, Text } from "@chakra-ui/react";

export const NavButton = ({ icon, label, isExpanded, isActive, ...props }: NavButtonProps) => {
  // Конфигурация стилей для разных состояний
  const styles = {
    // Основной цвет контента (текст + иконка)
    color: isActive
      ? { base: "blue.600", _dark: "white" }
      : { base: "gray.600", _dark: "whiteAlpha.700" },

    // Фон кнопки
    bg: isActive
      ? { base: "blue.200", _dark: "blue.600" }
      : { base: "rgba(255, 255, 255, 0.8)", _dark: "whiteAlpha.100" },

    // Наведение (Hover)
    hover: {
      bg: isActive
        ? { base: "blue.100", _dark: "blue.500" }
        : { base: "gray.100", _dark: "whiteAlpha.300" },
      color: { base: "gray.800", _dark: "white" },
    },

    // Нажатие (Active/Pressed)
    pressed: {
      bg: isActive
        ? { base: "blue.200", _dark: "blue.700" }
        : { base: "gray.200", _dark: "whiteAlpha.300" },
      transform: "scale(0.98)", // Легкий эффект нажатия
    }
  };

  return (
    <Button
      variant="ghost"
      h="48px"
      w={isExpanded ? "full" : "48px"}
      p={0}
      
      // Применяем цвета
      color={styles.color}
      bg={styles.bg}
      _hover={styles.hover}
      _active={styles.pressed}

      // УБИРАЕМ РАМКИ И ФОКУС
      border="none"
      outline="none"
      boxShadow="none"
	  shadow="xs"
      _focus={{ boxShadow: "none", outline: "none" }}
      _focusVisible={{ boxShadow: "none", outline: "none" }}
      
      // ПРИНУДИТЕЛЬНЫЙ ЦВЕТ ИКОНКИ
      css={{
        "& svg": {
          stroke: "currentColor !important", // Иконка ВСЕГДА будет цвета текста
          transition: "stroke 0.2s ease, transform 0.2s ease",
        },
      }}

      transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
      justifyContent={isExpanded ? "flex-start" : "center"}
      onMouseDown={(e) => e.preventDefault()} // Убирает фокус при клике мышкой
      {...props}
    >
      <Center minW="48px" h="48px" color="inherit">
        {icon}
      </Center>

      {isExpanded && label && (
        <Text
          ml={1}
          whiteSpace="nowrap"
          color="inherit"
          fontWeight="medium"
          fontSize="md"
        >
          {label}
        </Text>
      )}
    </Button>
  );
};