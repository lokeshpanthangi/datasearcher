import React, { useState } from 'react';
import { FileText, Search, Lightbulb, BookOpen, History, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DocumentUploader } from '@/components/DocumentUploader';
import { SearchInterface } from '@/components/SearchInterface';
import { ResultsPanel } from '@/components/ResultsPanel';

const Index = () => {
  const [currentView, setCurrentView] = useState<'search' | 'upload' | 'results' | 'history'>('search');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string, mode: string) => {
    setIsSearching(true);
    setCurrentView('results');
    
    // Simulate search delay
    setTimeout(() => {
      setSearchResults({ query, mode });
      setIsSearching(false);
    }, 2000);
  };

  const handleUpload = (files: File[]) => {
    console.log('Uploaded files:', files);
    // Handle file upload logic here
  };

  const sidebarItems = [
    { id: 'search', label: 'Search', icon: Search },
    { id: 'upload', label: 'Upload Documents', icon: FileText },
    { id: 'history', label: 'Search History', icon: History },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Lightbulb className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Research Assistant</h1>
                <p className="text-xs text-muted-foreground">AI-Powered Research Platform</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4 sticky top-24">
              <nav className="space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={currentView === item.id ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setCurrentView(item.id as any)}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {item.label}
                    </Button>
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {currentView === 'search' && (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    Intelligent Research Assistant
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Combine your documents with real-time web search to get comprehensive, 
                    well-sourced answers for your research questions.
                  </p>
                </div>

                <SearchInterface 
                  onSearch={handleSearch}
                />

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">0</div>
                    <div className="text-sm text-muted-foreground">Documents Uploaded</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-research-accent">0</div>
                    <div className="text-sm text-muted-foreground">Searches Performed</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-web">0</div>
                    <div className="text-sm text-muted-foreground">Sources Analyzed</div>
                  </Card>
                </div>
              </div>
            )}

            {currentView === 'upload' && (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold">Upload Research Documents</h2>
                  <p className="text-muted-foreground">
                    Add PDF documents to your research library for intelligent analysis
                  </p>
                </div>

                <DocumentUploader onUpload={handleUpload} />

                {/* Document Library Placeholder */}
                <Card className="p-8 text-center">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Documents Yet</h3>
                  <p className="text-muted-foreground">
                    Upload your first document to start building your research library
                  </p>
                </Card>
              </div>
            )}

            {currentView === 'results' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Search Results</h2>
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentView('search')}
                  >
                    New Search
                  </Button>
                </div>

                <ResultsPanel 
                  isLoading={isSearching}
                  query={searchResults?.query}
                />
              </div>
            )}

            {currentView === 'history' && (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold">Search History</h2>
                  <p className="text-muted-foreground">
                    Review your previous research queries and results
                  </p>
                </div>

                <Card className="p-8 text-center">
                  <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Search History</h3>
                  <p className="text-muted-foreground">
                    Your previous searches will appear here
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setCurrentView('search')}
                  >
                    Start Searching
                  </Button>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
