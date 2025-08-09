import { useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useLanguage, LANGUAGES } from '@/hooks/use-language';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  className?: string;
  showLabel?: boolean;
}

export function LanguageSelector({ className, showLabel = false }: LanguageSelectorProps) {
  const { language, languageData, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className={cn("flex items-center space-x-2 neu-button", className)}
        >
          <Globe className="h-4 w-4" />
          <span className="text-lg">{languageData.flag}</span>
          {showLabel && <span className="hidden sm:inline">{languageData.name}</span>}
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
            {language === lang.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
