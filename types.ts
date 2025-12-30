
export type AppMode = 'dashboard' | 'chat' | 'voice' | 'dictionary' | 'exercises';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface GrammarRule {
  title: string;
  description_en: string;
  description_zh: string;
  example: string;
}

export interface DictionaryEntry {
  word: string;
  phonetic: string;
  pos: string;
  definition_en: string;
  definition_zh: string;
  examples: string[];
}
