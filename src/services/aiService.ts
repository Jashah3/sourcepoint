// Enhanced AI Service for multiple AI providers
export interface AIProvider {
  name: string;
  apiKey: string;
  baseUrl?: string;
}

export interface AIRequest {
  message: string;
  context?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export class AIService {
  private static instance: AIService;

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async generateResponse(provider: string, request: AIRequest): Promise<AIResponse> {
    try {
      switch (provider.toLowerCase()) {
        case 'openai':
          return await this.callOpenAI(request);
        case 'anthropic':
          return await this.callAnthropic(request);
        case 'perplexity':
          return await this.callPerplexity(request);
        default:
          throw new Error(`Unsupported AI provider: ${provider}`);
      }
    } catch (error) {
      console.error(`AI Service error for ${provider}:`, error);
      throw error;
    }
  }

  private async callOpenAI(request: AIRequest): Promise<AIResponse> {
    const apiKey = localStorage.getItem('openai_api_key');
    if (!apiKey) {
      throw new Error('OpenAI API key not found. Please configure it in Settings.');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'You are a health and wellness AI assistant. Provide helpful, accurate advice about nutrition, fitness, and wellness. Always recommend consulting healthcare professionals for medical concerns.'
          },
          {
            role: 'user',
            content: request.context ? `Context: ${request.context}\n\nQuestion: ${request.message}` : request.message
          }
        ],
        max_tokens: request.maxTokens || 1000,
        temperature: request.temperature || 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      usage: {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
      },
    };
  }

  private async callAnthropic(request: AIRequest): Promise<AIResponse> {
    const apiKey = localStorage.getItem('anthropic_api_key');
    if (!apiKey) {
      throw new Error('Anthropic API key not found. Please configure it in Settings.');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: request.maxTokens || 1000,
        messages: [
          {
            role: 'user',
            content: request.context 
              ? `Context: ${request.context}\n\nAs a health and wellness AI assistant, please help with: ${request.message}`
              : `As a health and wellness AI assistant, please help with: ${request.message}`
          }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.content[0].text,
      usage: {
        promptTokens: data.usage.input_tokens,
        completionTokens: data.usage.output_tokens,
        totalTokens: data.usage.input_tokens + data.usage.output_tokens,
      },
    };
  }

  private async callPerplexity(request: AIRequest): Promise<AIResponse> {
    const apiKey = localStorage.getItem('perplexity_api_key');
    if (!apiKey) {
      throw new Error('Perplexity API key not found. Please configure it in Settings.');
    }

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a health and wellness AI assistant with access to current information. Provide evidence-based advice about nutrition, fitness, and wellness.'
          },
          {
            role: 'user',
            content: request.context ? `Context: ${request.context}\n\nQuestion: ${request.message}` : request.message
          }
        ],
        temperature: request.temperature || 0.2,
        max_tokens: request.maxTokens || 1000,
        top_p: 0.9,
        return_images: false,
        return_related_questions: false,
        search_domain_filter: ['pubmed.ncbi.nlm.nih.gov', 'who.int', 'mayoclinic.org'],
        search_recency_filter: 'month',
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      usage: {
        promptTokens: data.usage.prompt_tokens || 0,
        completionTokens: data.usage.completion_tokens || 0,
        totalTokens: (data.usage.prompt_tokens || 0) + (data.usage.completion_tokens || 0),
      },
    };
  }

  getHealthContext(userData?: any): string {
    const healthData = localStorage.getItem('health_data');
    const userGoals = localStorage.getItem('user_goals');
    
    let context = 'Current user health context:\n';
    
    if (healthData) {
      try {
        const data = JSON.parse(healthData);
        context += `- Steps today: ${data.steps || 'N/A'}\n`;
        context += `- Calories burned: ${data.calories || 'N/A'}\n`;
        if (data.heartRate) context += `- Heart rate: ${data.heartRate} bpm\n`;
        if (data.weight) context += `- Weight: ${data.weight} kg\n`;
      } catch (error) {
        console.error('Error parsing health data:', error);
      }
    }
    
    if (userGoals) {
      try {
        const goals = JSON.parse(userGoals);
        context += `- Health goals: ${goals.join(', ')}\n`;
      } catch (error) {
        console.error('Error parsing user goals:', error);
      }
    }
    
    return context;
  }

  getAvailableProviders(): string[] {
    const providers = [];
    if (localStorage.getItem('openai_api_key')) providers.push('OpenAI');
    if (localStorage.getItem('anthropic_api_key')) providers.push('Anthropic');
    if (localStorage.getItem('perplexity_api_key')) providers.push('Perplexity');
    return providers;
  }
}