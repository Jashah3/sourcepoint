// Enhanced AI Service for multiple AI providers
import { SecureStorage, validateApiKey, sanitizeInput, RateLimiter, getSecureHeaders } from '@/utils/securityUtils';
import { APISecurityManager, HealthDataSecurity } from '@/utils/enhancedSecurityUtils';

export interface AIProvider {
  name: string;
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
  error?: string;
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
      // Enhanced security checks
      if (!APISecurityManager.canMakeAPICall(provider)) {
        return {
          content: '',
          error: 'API rate limit exceeded. Please try again later.'
        };
      }

      // Enhanced input sanitization
      const sanitizedRequest = APISecurityManager.sanitizeAPIRequest({
        ...request,
        message: sanitizeInput(request.message),
        context: request.context ? sanitizeInput(request.context) : undefined
      });

      if (!sanitizedRequest.message) {
        return {
          content: '',
          error: 'Invalid input provided.'
        };
      }

      // Select provider and make API call
      let response: AIResponse;
      switch (provider.toLowerCase()) {
        case 'openai':
          response = await this.callOpenAI(sanitizedRequest);
          break;
        case 'anthropic':
          response = await this.callAnthropic(sanitizedRequest);
          break;
        case 'perplexity':
          response = await this.callPerplexity(sanitizedRequest);
          break;
        default:
          return {
            content: '',
            error: `Unsupported AI provider: ${provider}`
          };
      }

      // Validate response for security
      if (response.content && !APISecurityManager.validateAPIResponse(response)) {
        return {
          content: '',
          error: 'Invalid response detected'
        };
      }

      return response;
    } catch (error) {
      console.error(`AI Service error for ${provider}:`, error);
      return {
        content: '',
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      };
    }
  }

  private async callOpenAI(request: AIRequest): Promise<AIResponse> {
    const apiKey = await SecureStorage.getApiKey('openai');
    if (!apiKey) {
      return {
        content: '',
        error: 'OpenAI API key not found. Please configure it in Settings.'
      };
    }

    const validation = validateApiKey('openai', apiKey);
    if (!validation.isValid) {
      return {
        content: '',
        error: validation.error || 'Invalid OpenAI API key'
      };
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        ...getSecureHeaders(),
        'Authorization': `Bearer ${apiKey}`,
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
      const errorText = await response.text();
      return {
        content: '',
        error: `OpenAI API error: ${response.statusText}`
      };
    }

    const data = await response.json();
    return {
      content: data.choices?.[0]?.message?.content || '',
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      },
    };
  }

  private async callAnthropic(request: AIRequest): Promise<AIResponse> {
    const apiKey = await SecureStorage.getApiKey('anthropic');
    if (!apiKey) {
      return {
        content: '',
        error: 'Anthropic API key not found. Please configure it in Settings.'
      };
    }

    const validation = validateApiKey('anthropic', apiKey);
    if (!validation.isValid) {
      return {
        content: '',
        error: validation.error || 'Invalid Anthropic API key'
      };
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        ...getSecureHeaders(),
        'x-api-key': apiKey,
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
      return {
        content: '',
        error: `Anthropic API error: ${response.statusText}`
      };
    }

    const data = await response.json();
    return {
      content: data.content?.[0]?.text || '',
      usage: {
        promptTokens: data.usage?.input_tokens || 0,
        completionTokens: data.usage?.output_tokens || 0,
        totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
      },
    };
  }

  private async callPerplexity(request: AIRequest): Promise<AIResponse> {
    const apiKey = await SecureStorage.getApiKey('perplexity');
    if (!apiKey) {
      return {
        content: '',
        error: 'Perplexity API key not found. Please configure it in Settings.'
      };
    }

    const validation = validateApiKey('perplexity', apiKey);
    if (!validation.isValid) {
      return {
        content: '',
        error: validation.error || 'Invalid Perplexity API key'
      };
    }

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        ...getSecureHeaders(),
        'Authorization': `Bearer ${apiKey}`,
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
      return {
        content: '',
        error: `Perplexity API error: ${response.statusText}`
      };
    }

    const data = await response.json();
    return {
      content: data.choices?.[0]?.message?.content || '',
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: (data.usage?.prompt_tokens || 0) + (data.usage?.completion_tokens || 0),
      },
    };
  }

  getHealthContext(userData?: any): string {
    // This method should be async too, but for now we'll simplify
    try {
      // For now, return a basic context since the health data access is async
      let context = "User's Health Context:\n";
      
      if (userData) {
        // Sanitize additional user data
        const sanitizedUserData = APISecurityManager.sanitizeAPIRequest(userData);
        context += `Additional context: ${JSON.stringify(sanitizedUserData)}\n`;
      }
      
      context += "- Health data integration available\n";
      return context;
    } catch (error) {
      console.error('Error getting health context:', error);
      return "Health context unavailable";
    }
  }

  getAvailableProviders(): string[] {
    // This method should be async too, but we'll keep it simple for now
    const providers: string[] = [];
    // Note: In real implementation, these should be async calls
    // For now, we'll rely on the localStorage temporary storage
    if (localStorage.getItem('secure_api_openai')) providers.push('OpenAI');
    if (localStorage.getItem('secure_api_anthropic')) providers.push('Anthropic');
    if (localStorage.getItem('secure_api_perplexity')) providers.push('Perplexity');
    return providers;
  }
}