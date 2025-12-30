
import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  // 预检请求处理 (CORS)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const API_KEY = process.env.DEEPSEEK_API_KEY;
  
  if (!API_KEY) {
    console.error('[Error] DEEPSEEK_API_KEY is missing in environment variables');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API Key not configured on server.' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { messages, response_format } = body;

    console.log('[Info] Calling DeepSeek API with model: deepseek-chat');
    
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        response_format: response_format || undefined,
        stream: false,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[DeepSeek Error] Status: ${response.status}, Body: ${errorText}`);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `DeepSeek API returned ${response.status}: ${errorText}` }),
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    };
  } catch (error: any) {
    console.error('[Fatal Error] Proxy function failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
