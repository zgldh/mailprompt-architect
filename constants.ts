import { EmailStyle, Language, Translation } from './types';

export const STYLES_BY_LANG: Record<Language, EmailStyle[]> = {
  en: [
    {
      id: 'formal',
      name: 'Professional & Formal',
      promptInstruction: 'Use a strictly professional, polite, and formal tone. Avoid slang. Use proper salutations and sign-offs.',
    },
    {
      id: 'friendly',
      name: 'Friendly & Casual',
      promptInstruction: 'Use a warm, friendly, and conversational tone. You can be slightly casual but remain professional.',
    },
    {
      id: 'concise',
      name: 'Direct & Concise',
      promptInstruction: 'Be extremely direct and brief. Get straight to the point. Minimize fluff and pleasantries.',
    },
    {
      id: 'persuasive',
      name: 'Persuasive & Sales',
      promptInstruction: 'Use persuasive language. Focus on benefits and call to action. The tone should be enthusiastic and convincing.',
    },
    {
      id: 'apologetic',
      name: 'Apologetic & Empathetic',
      promptInstruction: 'Express sincere apology and empathy. Validate the recipient\'s feelings and offer a clear solution.',
    }
  ],
  zh: [
    {
      id: 'formal',
      name: '专业正式 (Professional)',
      promptInstruction: '使用严格的专业、礼貌和正式的语气。避免使用俚语。使用得体的称呼和落款。',
    },
    {
      id: 'friendly',
      name: '友好随和 (Friendly)',
      promptInstruction: '使用温暖、友好和对话式的语气。可以稍微随意一些，但保持专业性。',
    },
    {
      id: 'concise',
      name: '直接简练 (Direct)',
      promptInstruction: '非常直接和简短。直奔主题。尽量减少客套话和废话。',
    },
    {
      id: 'persuasive',
      name: '推销说服 (Persuasive)',
      promptInstruction: '使用具有说服力的语言。强调利益点和行动号召。语气应充满热情和感染力。',
    },
    {
      id: 'apologetic',
      name: '诚挚道歉 (Apologetic)',
      promptInstruction: '表达真诚的歉意和同理心。认同对方的感受并提供明确的解决方案。',
    }
  ]
};

export const TRANSLATIONS: Record<Language, Translation> = {
  en: {
    appTitle: "MailPrompt Architect",
    historyLabel: "Email History / Context",
    historyPlaceholder: "Paste the email thread here...",
    intentLabel: "Your Intent (Draft Notes)",
    intentPlaceholder: "e.g., Tell them I accept the offer but need to start 2 weeks later...",
    styleLabel: "Tone & Style",
    newStyle: "New Style",
    cancel: "Cancel",
    addStyle: "Add Style",
    styleNamePlaceholder: "Style Name (e.g., Angry Customer)",
    styleInstrPlaceholder: "Instructions (e.g., Be firm but polite...)",
    generatedLabel: "Generated Prompt",
    copy: "Copy Prompt",
    copied: "Copied!",
    readyTitle: "Ready to generate",
    readyDesc: "Fill in the details on the left to see the magic.",
    autoSave: "Inputs auto-save to local storage",
    deleteStyle: "Delete custom style"
  },
  zh: {
    appTitle: "邮件提示词工匠",
    historyLabel: "邮件历史 / 上下文",
    historyPlaceholder: "在此粘贴已有的邮件对话内容...",
    intentLabel: "您的意图 (草稿大意)",
    intentPlaceholder: "例如：告诉他们我接受offer，但需要晚两周入职...",
    styleLabel: "语气与风格",
    newStyle: "新建风格",
    cancel: "取消",
    addStyle: "添加风格",
    styleNamePlaceholder: "风格名称 (例如：愤怒的客户)",
    styleInstrPlaceholder: "指令 (例如：语气强硬但保持礼貌...)",
    generatedLabel: "生成的提示词",
    copy: "复制提示词",
    copied: "已复制!",
    readyTitle: "准备生成",
    readyDesc: "在左侧填写详细信息以生成提示词。",
    autoSave: "输入内容会自动保存",
    deleteStyle: "删除自定义风格"
  }
};

export const PROMPT_TEMPLATES = {
  en: (hist: string, intnt: string, styleName: string, styleInstr: string) => `
# Role
You are an expert professional email copywriter.

# Task
Draft an email reply based on the provided context, intent, and style guidelines.

${hist.trim() ? `
# Context (Previous Email History)
"""
${hist.trim()}
"""
` : ''}

# User Intent (What needs to be said)
"""
${intnt.trim() || "(No specific intent provided, please draft a generic reply based on history)"}
"""

# Style & Tone Guidelines
- Style: ${styleName}
- Instructions: ${styleInstr}
- Formatting: Use clear paragraphs. If action items are needed, use bullet points.
- Structure: Professional greeting -> Body -> Clear Call to Action (if applicable) -> Professional Sign-off.

# Output
Provide ONLY the email body text. Do not include introductory text like "Here is the email draft".
`.trim(),
  zh: (hist: string, intnt: string, styleName: string, styleInstr: string) => `
# 角色
你是一位专业的邮件撰写专家。

# 任务
根据提供的背景、意图和风格指南起草一封回复邮件。

${hist.trim() ? `
# 背景 (历史邮件)
"""
${hist.trim()}
"""
` : ''}

# 用户意图 (需要表达的内容)
"""
${intnt.trim() || "(未提供具体意图，请根据历史记录起草通用的回复)"}
"""

# 风格与语气指南
- 风格: ${styleName}
- 指导: ${styleInstr}
- 格式: 分段清晰。如有行动项，请使用项目符号。
- 结构: 专业称呼 -> 正文 -> 明确的行动号召 (如适用) -> 专业落款。

# 输出
仅提供邮件正文内容。不要包含"这是一封邮件草稿"之类的开场白。
`.trim()
};

export const STORAGE_KEYS = {
  LANGUAGE: 'mailprompt_language',
  // Dynamic keys are handled in App.tsx logic
};