import React, { useState } from 'react';
import { Plus, X, Check } from 'lucide-react';
import { EmailStyle, Translation } from '../types';

interface StylePickerProps {
  styles: EmailStyle[];
  selectedId: string;
  onSelect: (id: string) => void;
  onAddStyle: (style: EmailStyle) => void;
  onDeleteStyle: (id: string) => void;
  labels: Translation;
}

export const StylePicker: React.FC<StylePickerProps> = ({
  styles,
  selectedId,
  onSelect,
  onAddStyle,
  onDeleteStyle,
  labels,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newStyleName, setNewStyleName] = useState('');
  const [newStylePrompt, setNewStylePrompt] = useState('');
  const [styleToDelete, setStyleToDelete] = useState<string | null>(null);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStyleName.trim() || !newStylePrompt.trim()) return;

    onAddStyle({
      id: Date.now().toString(),
      name: newStyleName,
      promptInstruction: newStylePrompt,
    });
    setNewStyleName('');
    setNewStylePrompt('');
    setIsAdding(false);
  };

  const confirmDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStyleToDelete(id);
  };

  const handleDeleteConfirm = () => {
    if (styleToDelete) {
      onDeleteStyle(styleToDelete);
      setStyleToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setStyleToDelete(null);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center mb-1">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
          {labels.styleLabel}
        </label>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          {isAdding ? <><X size={14} /> {labels.cancel}</> : <><Plus size={14} /> {labels.newStyle}</>}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddSubmit} className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 mb-3 animate-fade-in">
          <input
            type="text"
            placeholder={labels.styleNamePlaceholder}
            className="w-full mb-2 p-2 text-xs border rounded focus:ring-1 focus:ring-indigo-500 outline-none"
            value={newStyleName}
            onChange={(e) => setNewStyleName(e.target.value)}
            autoFocus
          />
          <textarea
            placeholder={labels.styleInstrPlaceholder}
            className="w-full mb-2 p-2 text-xs border rounded focus:ring-1 focus:ring-indigo-500 outline-none resize-none h-16"
            value={newStylePrompt}
            onChange={(e) => setNewStylePrompt(e.target.value)}
          />
          <button
            type="submit"
            disabled={!newStyleName || !newStylePrompt}
            className="w-full py-1 bg-indigo-600 text-white text-xs font-bold rounded hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {labels.addStyle}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
        {styles.map((style) => {
          const isSelected = style.id === selectedId;
          const isCustom = !isNaN(Number(style.id)); // Simple check based on ID generation strategy

          return (
            <div
              key={style.id}
              onClick={() => onSelect(style.id)}
              className={`
                relative cursor-pointer p-3 rounded-lg border transition-all duration-200 group
                ${isSelected
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-slate-50'
                }
              `}
            >
              <div className="flex justify-between items-start">
                <span className="text-sm font-semibold truncate block w-full pr-4">{style.name}</span>
                {isSelected && <Check size={16} className="text-indigo-200 absolute right-2 top-3" />}
              </div>
              <p className={`text-xs mt-1 line-clamp-2 ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                {style.promptInstruction}
              </p>
              
              {isCustom && !isSelected && (
                <>
                  <button
                    onClick={(e) => confirmDelete(style.id, e)}
                    className="absolute top-1 right-1 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title={labels.deleteStyle}
                  >
                    <X size={12} />
                  </button>
                  
                  {styleToDelete === style.id && (
                    <div 
                      className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center gap-2 z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={handleDeleteConfirm}
                        className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                      >
                        {labels.confirmDelete}
                      </button>
                      <button
                        onClick={handleDeleteCancel}
                        className="px-2 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 transition-colors"
                      >
                        {labels.confirmCancel}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
