import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { useTheme } from "../../context/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500" />;
      case "dark":
        return <Moon className="h-[1.2rem] w-[1.2rem] text-blue-400" />;
      default:
        return <Monitor className="h-[1.2rem] w-[1.2rem] text-gray-500" />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      default:
        return "System";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative transition-all duration-200 hover:scale-105 hover:shadow-md border-2 hover:border-bg-1/50"
        >
          <div className="transition-transform duration-200 hover:rotate-12">
            {getIcon()}
          </div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <div className="px-2 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 mb-1">
          Current: {getThemeLabel()}
        </div>
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={`cursor-pointer transition-colors duration-150 ${
            theme === "light"
              ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300"
              : "hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          <Sun className="mr-2 h-4 w-4 text-yellow-500" />
          Light
          {theme === "light" && (
            <span className="ml-auto text-yellow-500">✓</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={`cursor-pointer transition-colors duration-150 ${
            theme === "dark"
              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
              : "hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          <Moon className="mr-2 h-4 w-4 text-blue-400" />
          Dark
          {theme === "dark" && (
            <span className="ml-auto text-blue-400">✓</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={`cursor-pointer transition-colors duration-150 ${
            theme === "system"
              ? "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              : "hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          <Monitor className="mr-2 h-4 w-4 text-gray-500" />
          System
          {theme === "system" && (
            <span className="ml-auto text-gray-500">✓</span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}