import React from 'react';

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  heightClass?: string;
  icon?: React.ReactNode;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  className = "",
  heightClass = "h-32",
  icon
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
        {icon}
        {label}
      </label>
      <textarea
        className={`w-full ${heightClass} p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition-all text-sm leading-relaxed bg-white shadow-sm`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};
