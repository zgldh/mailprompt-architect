export type Language = 'en' | 'zh';

export interface EmailStyle {
  id: string;
  name: string;
  promptInstruction: string;
}

export interface PromptState {
  history: string;
  intent: string;
  styleId: string;
}

export interface Translation {
  appTitle: string;
  historyLabel: string;
  historyPlaceholder: string;
  intentLabel: string;
  intentPlaceholder: string;
  styleLabel: string;
  newStyle: string;
  cancel: string;
  addStyle: string;
  styleNamePlaceholder: string;
  styleInstrPlaceholder: string;
  generatedLabel: string;
  copy: string;
  copied: string;
  readyTitle: string;
  readyDesc: string;
  autoSave: string;
  deleteStyle: string;
  confirmDelete: string;
  confirmCancel: string;
}