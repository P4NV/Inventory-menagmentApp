import { createContext, useContext, useState } from "react";

// 1. Define the type for context
interface ThemeContextType {
    darkMode: boolean;
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

// 2. Pass a default value to createContext
const ThemeContext = createContext<ThemeContextType>({
    darkMode: false,
    setDarkMode: () => {},
});

// 3. Fix the children prop syntax
export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [darkMode, setDarkMode] = useState(false);

    return (
        <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}