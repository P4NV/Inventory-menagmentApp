import { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
    darkMode: boolean;
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const ThemeContext = createContext<ThemeContextType>({
    darkMode: false,
    setDarkMode: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) return savedTheme === 'dark';
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    useEffect(() => {
        const root = document.documentElement;
        if (darkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    return (
        <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
