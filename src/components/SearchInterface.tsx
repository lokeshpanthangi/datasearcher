import React, { useState } from 'react';
import { Search, Filter, History, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface SearchInterfaceProps {
  onSearch?: (query: string, mode: string) => void;
  searchSuggestions?: string[];
  searchHistory?: string[];
}

export const SearchInterface: React.FC<SearchInterfaceProps> = ({
  onSearch,
  searchSuggestions = [
    "climate change research",
    "artificial intelligence ethics",
    "quantum computing applications",
    "renewable energy technologies"
  ],
  searchHistory = [
    "machine learning algorithms",
    "sustainable development goals",
    "neural network architectures"
  ]
}) => {
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState('hybrid');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    onSearch?.(query, searchMode);
    
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
      setShowSuggestions(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'documents':
        return 'document';
      case 'web':
        return 'web';
      case 'hybrid':
        return 'gradient';
      default:
        return 'default';
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Search Mode Selector */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Search Mode</h3>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        
        <Tabs value={searchMode} onValueChange={setSearchMode}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="documents" className="text-xs">
              Documents Only
            </TabsTrigger>
            <TabsTrigger value="web" className="text-xs">
              Web Only
            </TabsTrigger>
            <TabsTrigger value="hybrid" className="text-xs">
              Hybrid Search
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Card>

      {/* Main Search Bar */}
      <div className="relative">
        <Card className={cn(
          "relative overflow-hidden transition-all duration-300",
          isSearching && "shadow-glow"
        )}>
          <div className="flex items-center p-4 gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Ask me anything about your research..."
                className="pl-10 pr-4 h-12 text-base border-none shadow-none focus-visible:ring-0"
              />
            </div>
            
            <Button
              onClick={handleSearch}
              disabled={!query.trim() || isSearching}
              variant={getModeColor(searchMode) as any}
              size="lg"
              className="px-8"
            >
              {isSearching ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </div>

          {/* Search Suggestions */}
          {showSuggestions && !isSearching && (
            <div className="border-t bg-card/95 backdrop-blur-sm">
              <div className="p-4 space-y-3">
                {query && (
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                      <History className="h-3 w-3" />
                      Recent Searches
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {searchHistory.map((item, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => selectSuggestion(item)}
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2">
                    Popular Topics
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {searchSuggestions.map((suggestion, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => selectSuggestion(suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Search Status */}
      {isSearching && (
        <Card className="p-4">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>Analyzing {searchMode === 'hybrid' ? 'documents and web sources' : searchMode}...</span>
          </div>
        </Card>
      )}
    </div>
  );
};