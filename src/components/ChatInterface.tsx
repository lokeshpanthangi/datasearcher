import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[];
  isTyping?: boolean;
}

interface ChatInterfaceProps {
  initialContext?: {
    query: string;
    sources: any[];
    summary: string;
  };
  onNewSearch?: (query: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  initialContext,
  onNewSearch 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize with context if provided
    if (initialContext && messages.length === 0) {
      const contextMessage: Message = {
        id: '1',
        type: 'assistant',
        content: `I've analyzed your search for "${initialContext.query}" and found ${initialContext.sources.length} relevant sources. Here's what I discovered:\n\n${initialContext.summary}\n\nFeel free to ask me follow-up questions about these findings, request specific details about any source, or explore related topics!`,
        timestamp: new Date(),
        sources: initialContext.sources.map(s => s.id)
      };
      setMessages([contextMessage]);
    }
  }, [initialContext]);

  const generateResponse = async (userQuery: string): Promise<string> => {
    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const responses = [
      `Based on the research sources I've analyzed, here are some key insights about your question: "${userQuery}". The data suggests several important trends that align with current academic consensus. Would you like me to elaborate on any specific aspect?`,
      
      `That's an excellent follow-up question about "${userQuery}". From the sources we reviewed, I can provide you with several perspectives on this topic. The research indicates some fascinating correlations that might interest you further.`,
      
      `Great question! Regarding "${userQuery}", the evidence from our sources points to some compelling conclusions. I notice this connects well with your original research topic. Let me break down the most relevant findings for you.`,
      
      `Interesting angle on "${userQuery}". The academic sources we have provide some nuanced views on this. I can see how this relates to your broader research interests. Would you like me to search for additional sources on this specific aspect?`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      type: 'assistant',
      content: '',
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const response = await generateResponse(userMessage.content);
      
      // Remove typing indicator and add real response
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== 'typing');
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: response,
          timestamp: new Date()
        };
        return [...filtered, assistantMessage];
      });
    } catch (error) {
      setMessages(prev => prev.filter(m => m.id !== 'typing'));
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I apologize, but I encountered an issue processing your question. Please try again or rephrase your query.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const suggestedQuestions = [
    "Can you elaborate on the methodology used in these studies?",
    "What are the limitations of this research?",
    "How does this compare to other research in the field?",
    "What are the practical applications of these findings?",
    "Are there any contradictory findings I should be aware of?",
    "Can you search for more recent studies on this topic?"
  ];

  return (
    <div className="flex flex-col h-[600px] bg-card rounded-lg border shadow-medium">
      {/* Chat Header */}
      <div className="p-4 border-b bg-gradient-secondary rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">Research Assistant</h3>
              <p className="text-xs text-muted-foreground">
                Ask follow-up questions about your research
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            Online
          </Badge>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-sm">Start a conversation about your research!</p>
            <p className="text-xs mt-2">Ask me anything about the sources or explore related topics.</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.type === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.type === 'assistant' && (
              <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
            
            <div className={cn(
              "max-w-[80%] rounded-lg p-3 text-sm",
              message.type === 'user' 
                ? "bg-primary text-primary-foreground ml-12" 
                : "bg-muted"
            )}>
              {message.isTyping ? (
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-muted-foreground">AI is thinking...</span>
                </div>
              ) : (
                <>
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                  
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">Referenced sources:</p>
                      <div className="flex flex-wrap gap-1">
                        {message.sources.map((sourceId, index) => (
                          <Badge key={sourceId} variant="outline" className="text-xs">
                            Source {index + 1}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    
                    {message.type === 'assistant' && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => copyMessage(message.content)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {message.type === 'user' && (
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                <User className="h-4 w-4 text-secondary-foreground" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length > 0 && !isTyping && (
        <div className="px-4 py-2 border-t">
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.slice(0, 3).map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={() => setInput(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a follow-up question..."
            className="flex-1"
            disabled={isTyping}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            size="sm"
            variant="gradient"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send • Ask about methodology, limitations, applications, or request new searches
        </p>
      </div>
    </div>
  );
};