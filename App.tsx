import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Copy, CheckCheck, History, PenTool, Sparkles, Languages } from 'lucide-react';
import { STYLES_BY_LANG, TRANSLATIONS, PROMPT_TEMPLATES, STORAGE_KEYS } from './constants';
import { EmailStyle, Language } from './types';
import { TextAreaField } from './components/TextAreaField';
import { StylePicker } from './components/StylePicker';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export default function App() {
  // --- State ---
  const [language, setLanguage] = useState<Language>('en');
  const [styles, setStyles] = useState<EmailStyle[]>(STYLES_BY_LANG['en']);
  const [emailHistory, setEmailHistory] = useState('');
  const [intent, setIntent] = useState('');
  const [selectedStyleId, setSelectedStyleId] = useState<string>('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // --- Derived ---
  const t = TRANSLATIONS[language];

  // --- Initialization ---
  
  // 1. Load Language
  useEffect(() => {
    const savedLang = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'zh')) {
      setLanguage(savedLang);
    }
  }, []);

  // 2. Load Styles & State for current language
  useEffect(() => {
    const savedStylesKey = `mailprompt_styles_custom`;
    const savedStateKey = `mailprompt_state`;

    // Start with default styles for current language
    let currentStyles = STYLES_BY_LANG[language];
    
    // Load custom styles that should be available in all languages
    const savedStyles = localStorage.getItem(savedStylesKey);
    if (savedStyles) {
      try {
        const customStyles = JSON.parse(savedStyles);
        // Append custom styles to default styles
        currentStyles = [...STYLES_BY_LANG[language], ...customStyles];
      } catch (e) {
        console.error("Failed to parse custom styles", e);
      }
    }
    setStyles(currentStyles);

    // Load State
    const savedState = localStorage.getItem(savedStateKey);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setEmailHistory(parsed.history || '');
        setIntent(parsed.intent || '');
        // Validate style ID exists
        const styleExists = currentStyles.find(s => s.id === parsed.styleId);
        setSelectedStyleId(styleExists ? parsed.styleId : currentStyles[0].id);
      } catch (e) {
        console.error("Failed to parse last state", e);
        setSelectedStyleId(currentStyles[0].id);
      }
    } else {
      setSelectedStyleId(currentStyles[0].id);
      setEmailHistory('');
      setIntent('');
    }
  }, [language]);

  // 3. Save State on Change
  useEffect(() => {
    const savedStylesKey = `mailprompt_styles_custom`;
    const savedStateKey = `mailprompt_state`;

    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
    // Only save custom styles (those with numeric IDs)
    const customStyles = styles.filter(s => !isNaN(Number(s.id)));
    if (customStyles.length > 0) {
      localStorage.setItem(savedStylesKey, JSON.stringify(customStyles));
    } else {
      localStorage.removeItem(savedStylesKey);
    }
    localStorage.setItem(savedStateKey, JSON.stringify({
      history: emailHistory,
      intent,
      styleId: selectedStyleId
    }));
  }, [language, styles, emailHistory, intent, selectedStyleId]);

  // --- Logic ---
  
  // Combine inputs for debounce
  const inputState = useMemo(() => ({
    history: emailHistory,
    intent,
    styleId: selectedStyleId,
    lang: language // Include language in dependency
  }), [emailHistory, intent, selectedStyleId, language]);

  const debouncedInput = useDebounce(inputState, 500);

  // Prompt Generation Logic
  const generatePromptText = useCallback((hist: string, intnt: string, styleId: string, allStyles: EmailStyle[], lang: Language) => {
    if (!intnt.trim() && !hist.trim()) return "";

    const styleObj = allStyles.find(s => s.id === styleId) || allStyles[0];
    
    // Use localized template
    return PROMPT_TEMPLATES[lang](hist, intnt, styleObj.name, styleObj.promptInstruction);
  }, []);

  // Effect to update prompt
  useEffect(() => {
    const prompt = generatePromptText(
      debouncedInput.history, 
      debouncedInput.intent, 
      debouncedInput.styleId, 
      styles,
      debouncedInput.lang
    );
    setGeneratedPrompt(prompt);
  }, [debouncedInput, styles, generatePromptText]);


  // --- Handlers ---

  const handleCopy = async () => {
    if (!generatedPrompt) return;
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  // Simple token estimation function
  const estimateTokens = (text: string): number => {
    if (!text) return 0;
    
    // Based on research, 1 token ≈ 4 characters for English text
    // For mixed languages like English + Chinese, we'll use a blended approach
    const charCount = text.length;
    const whitespaceCount = (text.match(/\s/g) || []).length;
    
    // Estimate token count:
    // - Non-whitespace characters: 1 token per ~4 chars 
    // - Whitespace: 1 token per 2 whitespaces (as they often separate tokens)
    const nonSpaceChars = charCount - whitespaceCount;
    const estimatedTokens = Math.ceil(nonSpaceChars / 4) + Math.floor(whitespaceCount / 2);
    
    return estimatedTokens;
  };

  const handleAddStyle = (newStyle: EmailStyle) => {
    setStyles(prev => [...prev, newStyle]);
    setSelectedStyleId(newStyle.id);
  };

  const handleDeleteStyle = (id: string) => {
    setStyles(prev => prev.filter(s => s.id !== id));
    // If deleted current selection, reset to first available
    if (selectedStyleId === id) {
      const remaining = styles.filter(s => s.id !== id);
      if (remaining.length > 0) {
        setSelectedStyleId(remaining[0].id);
      }
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-slate-50 text-slate-800 font-sans">
      
      {/* --- LEFT PANEL (Inputs) --- */}
      <div className="w-full md:w-[45%] lg:w-[40%] flex flex-col border-r border-slate-200 bg-white h-1/2 md:h-full shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <PenTool size={18} />
            </div>
            <h1 className="font-bold text-lg text-slate-800 tracking-tight">{t.appTitle}</h1>
          </div>
          
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-slate-200 text-slate-600 text-xs font-bold uppercase transition-colors"
            title="Switch Language"
          >
            <Languages size={14} />
            {language === 'en' ? 'EN' : '中文'}
          </button>
        </div>

        {/* Scrollable Form Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* 1. History */}
          <TextAreaField 
            label={t.historyLabel}
            icon={<History size={14} />}
            value={emailHistory}
            onChange={setEmailHistory}
            placeholder={t.historyPlaceholder}
            heightClass="h-40"
            className="animate-in fade-in slide-in-from-left-4 duration-500"
          />

          {/* 2. Styles */}
          <div className="animate-in fade-in slide-in-from-left-4 duration-500 delay-75">
            <StylePicker 
              styles={styles}
              selectedId={selectedStyleId}
              onSelect={setSelectedStyleId}
              onAddStyle={handleAddStyle}
              onDeleteStyle={handleDeleteStyle}
              labels={t}
            />
          </div>

          {/* 3. Intent */}
          <TextAreaField 
            label={t.intentLabel}
            icon={<PenTool size={14} />}
            value={intent}
            onChange={setIntent}
            placeholder={t.intentPlaceholder}
            heightClass="h-32"
            className="animate-in fade-in slide-in-from-left-4 duration-500 delay-150"
          />

        </div>
        
        {/* Footer/Status */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-400 text-center">
          {t.autoSave}
        </div>
      </div>

      {/* --- RIGHT PANEL (Output) --- */}
      <div className="flex-1 flex flex-col bg-slate-100 h-1/2 md:h-full relative">
        
        {/* Toolbar */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200/50 bg-white/50 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-2 text-slate-500">
            <Sparkles size={16} className={generatedPrompt ? "text-indigo-500" : "text-slate-300"} />
            <span className="font-semibold text-sm uppercase tracking-wide">{t.generatedLabel}</span>
          </div>
          
          <div className="flex items-center gap-3">
            {generatedPrompt && (
              <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                ~{estimateTokens(generatedPrompt)} tokens
              </div>
            )}
            
            <button
              onClick={handleCopy}
              disabled={!generatedPrompt}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 shadow-sm
                ${!generatedPrompt 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : isCopied 
                    ? 'bg-green-100 text-green-700 ring-2 ring-green-500 ring-offset-1' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'
                }
              `}
            >
              {isCopied ? <CheckCheck size={16} /> : <Copy size={16} />}
              {isCopied ? t.copied : t.copy}
            </button>
          </div>
        </div>

        {/* Output Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {generatedPrompt ? (
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-in zoom-in-95 duration-300">
              <pre className="whitespace-pre-wrap font-mono text-sm text-slate-700 leading-relaxed">
                {generatedPrompt}
              </pre>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
              <Sparkles size={48} className="mb-4 text-slate-300" />
              <p className="text-lg font-medium">{t.readyTitle}</p>
              <p className="text-sm">{t.readyDesc}</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}