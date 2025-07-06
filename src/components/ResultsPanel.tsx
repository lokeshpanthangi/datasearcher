import React from 'react';
import { ExternalLink, FileText, Globe, Quote, Bookmark, Download, MessageCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChatInterface } from '@/components/ChatInterface';
import { cn } from '@/lib/utils';

interface Source {
  id: string;
  title: string;
  type: 'document' | 'web' | 'academic';
  url?: string;
  snippet: string;
  relevanceScore: number;
  credibilityScore: number;
  author?: string;
  publishedDate?: string;
  citations?: number;
}

interface ResultsPanelProps {
  sources?: Source[];
  query?: string;
  aiSummary?: string;
  isLoading?: boolean;
}

const mockSources: Source[] = [
  {
    id: '1',
    title: 'Machine Learning in Climate Science: A Comprehensive Review',
    type: 'academic',
    url: 'https://journal.example.com/ml-climate',
    snippet: 'Recent advances in machine learning have revolutionized climate modeling and prediction. This paper reviews current applications of ML in climate science, including ensemble forecasting, extreme weather prediction, and climate change attribution.',
    relevanceScore: 95,
    credibilityScore: 92,
    author: 'Dr. Sarah Chen et al.',
    publishedDate: '2024-03-15',
    citations: 127
  },
  {
    id: '2',
    title: 'AI for Environmental Monitoring',
    type: 'document',
    snippet: 'Artificial intelligence technologies are increasingly being deployed for real-time environmental monitoring systems. These systems can process satellite imagery, sensor data, and weather patterns to provide early warnings for environmental threats.',
    relevanceScore: 88,
    credibilityScore: 85,
    author: 'Environmental Research Institute',
    publishedDate: '2024-02-28'
  },
  {
    id: '3',
    title: 'Climate AI Initiative - Latest Developments',
    type: 'web',
    url: 'https://climate-ai.org/news',
    snippet: 'The Climate AI Initiative announces breakthrough developments in using artificial intelligence for carbon footprint reduction and climate adaptation strategies.',
    relevanceScore: 82,
    credibilityScore: 78,
    author: 'Climate AI Consortium',
    publishedDate: '2024-04-02'
  }
];

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  sources = mockSources,
  query = "artificial intelligence climate change",
  aiSummary = "Based on the available research, artificial intelligence is playing an increasingly crucial role in addressing climate change through multiple pathways. Machine learning algorithms are being successfully applied to improve climate modeling accuracy, enhance weather prediction systems, and optimize renewable energy distribution. The integration of AI in environmental monitoring has enabled real-time analysis of satellite data and sensor networks, providing early warning systems for extreme weather events. Recent studies show that AI-driven optimization can reduce energy consumption by up to 15% in smart grid systems, while machine learning models have improved climate forecasting accuracy by 23% compared to traditional methods.",
  isLoading = false
}) => {
  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-4 w-4 text-document" />;
      case 'web':
        return <Globe className="h-4 w-4 text-web" />;
      case 'academic':
        return <Quote className="h-4 w-4 text-research-accent" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getSourceBadgeVariant = (type: string) => {
    switch (type) {
      case 'document':
        return 'secondary';
      case 'web':
        return 'outline';
      case 'academic':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getCredibilityColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 75) return 'text-research-accent';
    if (score >= 60) return 'text-warning';
    return 'text-muted-foreground';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </Card>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-muted rounded w-2/3"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
              <div className="h-3 bg-muted rounded w-4/5"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Tabs defaultValue="results" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="results" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Research Results
        </TabsTrigger>
        <TabsTrigger value="chat" className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Continue Discussion
        </TabsTrigger>
      </TabsList>

      <TabsContent value="results" className="mt-6">
        <div className="space-y-6">
          {/* AI Summary */}
          <Card className="bg-gradient-secondary border-primary/20">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                  AI Research Summary
                </h2>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <p className="text-foreground leading-relaxed mb-4">
                {aiSummary}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Generated from {sources.length} sources</span>
                <span>•</span>
                <span>Confidence: High</span>
                <span>•</span>
                <span>Last updated: just now</span>
              </div>
            </div>
          </Card>

          {/* Sources Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Sources ({sources.length})
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Sorted by relevance
              </Badge>
            </div>
          </div>

          {/* Source Cards */}
          <div className="space-y-4">
            {sources.map((source, index) => (
              <Card key={source.id} className="hover:shadow-medium transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getSourceIcon(source.type)}
                        <Badge variant={getSourceBadgeVariant(source.type)} className="text-xs">
                          {source.type.charAt(0).toUpperCase() + source.type.slice(1)}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">#{index + 1}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <span>Relevance:</span>
                        <span className="font-medium text-primary">{source.relevanceScore}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Quality:</span>
                        <span className={cn("font-medium", getCredibilityColor(source.credibilityScore))}>
                          {source.credibilityScore}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <h4 className="text-base font-semibold mb-2 hover:text-primary transition-colors cursor-pointer">
                    {source.title}
                  </h4>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {source.snippet}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {source.author && (
                        <span>{source.author}</span>
                      )}
                      {source.publishedDate && (
                        <>
                          <span>•</span>
                          <span>{new Date(source.publishedDate).toLocaleDateString()}</span>
                        </>
                      )}
                      {source.citations && (
                        <>
                          <span>•</span>
                          <span>{source.citations} citations</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Quote className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                      {source.url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={source.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center">
            <Button variant="outline" size="lg">
              Load More Results
            </Button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="chat" className="mt-6">
        <ChatInterface 
          initialContext={{
            query: query || "artificial intelligence climate change",
            sources: sources,
            summary: aiSummary
          }}
        />
      </TabsContent>
    </Tabs>
  );
};