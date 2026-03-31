import { useColorMode } from "@/components/ui/color-mode";

export const useTheme = () => {
  const { colorMode, toggleColorMode, setColorMode } = useColorMode();

  return {
    mode: colorMode,
    isDark: colorMode === "dark",
    isLight: colorMode === "light",
    toggle: toggleColorMode,
    setTheme: setColorMode,
    // Цвета-константы для графиков или карт
    colors: {
      brand: "#3182ce",
      bg: colorMode === "dark" ? "rgba(23, 25, 35, 0.7)" : "rgba(255, 255, 255, 0.7)",
      text: colorMode === "dark" ? "#f5f5f5" : "#1a202c",
    }
  };
};