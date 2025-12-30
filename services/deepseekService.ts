
import { SYSTEM_PROMPT } from "../constants";

// Netlify Functions 的标准相对路径
const PROXY_URL = '/.netlify/functions/chat';

export const chatWithDeepSeek = async (message: string, history: {role: string, content: string}[]) => {
  try {
    const response = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...history,
          { role: 'user', content: message }
        ]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `Server responded with ${response.status}`);
    }

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response content from DeepSeek');
    }

    return data.choices[0].message.content;
  } catch (error: any) {
    console.error('Chat Service Error:', error);
    throw error;
  }
};

export const dictionaryLookup = async (word: string) => {
  try {
    const response = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { 
            role: 'system', 
            // 重要：DeepSeek 要求使用 JSON 模式时，prompt 中必须包含 "json" 单词
            content: 'You are a dictionary service. You MUST respond with a valid JSON object. Do not include any other text.' 
          },
          { 
            role: 'user', 
            content: `Provide a dictionary entry for the word: "${word}". Output the result as a raw JSON object following this exact schema: {"word": string, "phonetic": string, "pos": string, "definition_en": string, "definition_zh": string, "examples": string[]}` 
          }
        ],
        response_format: { type: 'json_object' }
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Dictionary service failed');
    }

    const content = data.choices[0].message.content;
    return JSON.parse(content);
  } catch (error: any) {
    console.error('Dictionary Service Error:', error);
    throw error;
  }
};
