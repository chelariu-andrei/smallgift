import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Language = 'ro' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('ro');
    const [translations, setTranslations] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        fetch(`${import.meta.env.BASE_URL}locales/${language}/translation.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load translations for ${language}`);
                }
                return response.json();
            })
            .then(data => {
                setTranslations(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Submission error:", error);
                setIsLoading(false);
            });
    }, [language]);

    const t = (key: string): any => {
        const keys = key.split('.');
        let value: any = translations;

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k as keyof typeof value];
            } else {
                return key; // Fallback to key
            }
        }
        return value;
    };

    if (isLoading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-[#fffcf5] text-rose-500 font-medium">
                Loading translations...
            </div>
        );
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
