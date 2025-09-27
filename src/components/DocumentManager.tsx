import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  FileText,
  Upload,
  Download,
  Trash2,
  FolderOpen,
  Search,
  Filter,
  Star,
  Clock,
  Calendar,
  DollarSign,
  Camera,
  Music,
  Flower,
  Car,
  Users,
  MapPin,
  Heart,
  Plus,
  Eye,
  Edit
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'contract' | 'invoice' | 'receipt' | 'photo' | 'inspiration' | 'menu' | 'timeline' | 'other';
  category: 'venue' | 'catering' | 'photography' | 'flowers' | 'music' | 'attire' | 'transportation' | 'legal' | 'planning' | 'other';
  size: string;
  uploadDate: string;
  isImportant: boolean;
  notes?: string;
  vendorName?: string;
  amount?: number;
  dueDate?: string;
  fileUrl?: string; // In real app, this would be actual file URL
}

const DOCUMENT_CATEGORIES = {
  venue: { name: 'Venue & Reception', icon: <MapPin className="h-4 w-4" />, color: 'bg-purple-100 text-purple-800' },
  catering: { name: 'Catering', icon: <DollarSign className="h-4 w-4" />, color: 'bg-orange-100 text-orange-800' },
  photography: { name: 'Photography', icon: <Camera className="h-4 w-4" />, color: 'bg-blue-100 text-blue-800' },
  flowers: { name: 'Flowers & Decor', icon: <Flower className="h-4 w-4" />, color: 'bg-green-100 text-green-800' },
  music: { name: 'Music', icon: <Music className="h-4 w-4" />, color: 'bg-indigo-100 text-indigo-800' },
  attire: { name: 'Attire', icon: <Heart className="h-4 w-4" />, color: 'bg-pink-100 text-pink-800' },
  transportation: { name: 'Transportation', icon: <Car className="h-4 w-4" />, color: 'bg-teal-100 text-teal-800' },
  legal: { name: 'Legal Documents', icon: <FileText className="h-4 w-4" />, color: 'bg-gray-100 text-gray-800' },
  planning: { name: 'Planning', icon: <Calendar className="h-4 w-4" />, color: 'bg-rose-100 text-rose-800' },
  other: { name: 'Other', icon: <FolderOpen className="h-4 w-4" />, color: 'bg-yellow-100 text-yellow-800' }
};

const DOCUMENT_TYPES = {
  contract: { name: 'Contract', icon: '📄', color: 'bg-blue-100 text-blue-800' },
  invoice: { name: 'Invoice', icon: '💰', color: 'bg-green-100 text-green-800' },
  receipt: { name: 'Receipt', icon: '🧾', color: 'bg-yellow-100 text-yellow-800' },
  photo: { name: 'Photo', icon: '📸', color: 'bg-purple-100 text-purple-800' },
  inspiration: { name: 'Inspiration', icon: '💡', color: 'bg-pink-100 text-pink-800' },
  menu: { name: 'Menu', icon: '🍽️', color: 'bg-orange-100 text-orange-800' },
  timeline: { name: 'Timeline', icon: '📅', color: 'bg-indigo-100 text-indigo-800' },
  other: { name: 'Other', icon: '📁', color: 'bg-gray-100 text-gray-800' }
};

export default function DocumentManager() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showAddDocument, setShowAddDocument] = useState<boolean>(false);
  const [newDocument, setNewDocument] = useState({
    name: '',
    type: 'other' as Document['type'],
    category: 'other' as Document['category'],
    notes: '',
    vendorName: '',
    amount: '',
    dueDate: '',
    isImportant: false
  });

  // Load documents from localStorage
  useEffect(() => {
    try {
      const savedDocuments = localStorage.getItem('weddingDocuments');
      if (savedDocuments) {
        setDocuments(JSON.parse(savedDocuments));
      } else {
        // Add some sample documents
        const sampleDocs: Document[] = [
          {
            id: '1',
            name: 'Venue Contract - The Royal Oak',
            type: 'contract',
            category: 'venue',
            size: '2.3 MB',
            uploadDate: '2024-01-15',
            isImportant: true,
            vendorName: 'The Royal Oak',
            notes: 'Signed contract for ceremony and reception'
          },
          {
            id: '2',
            name: 'Wedding Dress Receipt',
            type: 'receipt',
            category: 'attire',
            size: '156 KB',
            uploadDate: '2024-02-10',
            isImportant: false,
            amount: 1200,
            notes: 'Final fitting scheduled for next month'
          },
          {
            id: '3',
            name: 'Photography Package Details',
            type: 'contract',
            category: 'photography',
            size: '890 KB',
            uploadDate: '2024-01-20',
            isImportant: true,
            vendorName: 'Sarah Photography',
            amount: 2500
          }
        ];
        setDocuments(sampleDocs);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  }, []);

  // Save documents to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('weddingDocuments', JSON.stringify(documents));
    } catch (error) {
      console.error('Error saving documents:', error);
    }
  }, [documents]);

  const handleAddDocument = () => {
    console.log('handleAddDocument called with:', newDocument);
    
    if (!newDocument.name.trim()) {
      alert('Please enter a document name');
      return;
    }

    try {
      const document: Document = {
        id: Date.now().toString(),
        name: newDocument.name.trim(),
        type: newDocument.type,
        category: newDocument.category,
        size: '1.2 MB', // Simulated file size
        uploadDate: new Date().toISOString().split('T')[0],
        isImportant: newDocument.isImportant,
        notes: newDocument.notes || undefined,
        vendorName: newDocument.vendorName || undefined,
        amount: newDocument.amount ? parseFloat(newDocument.amount) : undefined,
        dueDate: newDocument.dueDate || undefined
      };

      console.log('Adding document:', document);
      
      setDocuments(prevDocs => {
        const newDocs = [...prevDocs, document];
        console.log('Updated documents list:', newDocs);
        return newDocs;
      });
      
      setNewDocument({
        name: '',
        type: 'other',
        category: 'other',
        notes: '',
        vendorName: '',
        amount: '',
        dueDate: '',
        isImportant: false
      });
      
      setShowAddDocument(false);
      
      // Success notification
      alert(`Document "${document.name}" added successfully!`);
    } catch (error) {
      console.error('Error adding document:', error);
      alert('Error adding document. Please try again.');
    }
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const toggleImportant = (id: string) => {
    setDocuments(documents.map(doc => 
      doc.id === id ? { ...doc, isImportant: !doc.isImportant } : doc
    ));
  };

  // Quick add function for testing
  const quickAddDocument = () => {
    const testDoc: Document = {
      id: Date.now().toString(),
      name: 'Test Document - ' + new Date().toLocaleTimeString(),
      type: 'other',
      category: 'other',
      size: '500 KB',
      uploadDate: new Date().toISOString().split('T')[0],
      isImportant: false,
      notes: 'Quick test document'
    };
    setDocuments(prev => [...prev, testDoc]);
    alert('Test document added!');
  };

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doc.vendorName && doc.vendorName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  // Calculate storage stats
  const totalDocuments = documents.length;
  const importantDocuments = documents.filter(doc => doc.isImportant).length;
  const contractsCount = documents.filter(doc => doc.type === 'contract').length;
  const totalValue = documents.reduce((sum, doc) => sum + (doc.amount || 0), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
          <FileText className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-3xl text-amber-800">Document Manager</h1>
        <p className="text-amber-700">Organize and store all your wedding documents</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-blue-700">Total Documents</span>
            </div>
            <div className="text-2xl text-blue-800">{totalDocuments}</div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <span className="text-sm text-yellow-700">Important</span>
            </div>
            <div className="text-2xl text-yellow-800">{importantDocuments}</div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-700">Contracts</span>
            </div>
            <div className="text-2xl text-green-800">{contractsCount}</div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <span className="text-sm text-purple-700">Total Value</span>
            </div>
            <div className="text-2xl text-purple-800">£{totalValue.toLocaleString()}</div>
          </div>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 w-64"
            />
          </div>

          {/* Filters */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="all">All Categories</option>
            {Object.entries(DOCUMENT_CATEGORIES).map(([key, category]) => (
              <option key={key} value={key}>{category.name}</option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="all">All Types</option>
            {Object.entries(DOCUMENT_TYPES).map(([key, type]) => (
              <option key={key} value={key}>{type.name}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => {
              console.log('Add Document button clicked', { showAddDocument });
              setShowAddDocument(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Document
          </Button>
          
          {/* Quick Test Button */}
          <Button
            onClick={quickAddDocument}
            variant="outline"
            className="text-green-600 border-green-600 hover:bg-green-50"
          >
            Quick Test
          </Button>
        </div>
      </div>

      {/* Documents Grid */}
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl text-gray-300 mb-4">📄</div>
          <p className="text-gray-600 mb-4">No documents found</p>
          <div className="space-y-2">
            <Button 
              onClick={() => {
                console.log('Add First Document button clicked');
                setShowAddDocument(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add Your First Document
            </Button>
            <div>
              <Button 
                onClick={quickAddDocument}
                variant="outline"
                size="sm"
                className="text-green-600"
              >
                Or try Quick Test
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredDocuments.map((document) => {
            const category = DOCUMENT_CATEGORIES[document.category];
            const type = DOCUMENT_TYPES[document.type];
            
            return (
              <Card key={document.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="text-4xl">{type.icon}</div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg text-amber-800">{document.name}</h3>
                        {document.isImportant && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge className={category.color}>
                          {category.icon}
                          <span className="ml-1">{category.name}</span>
                        </Badge>
                        <Badge className={type.color}>
                          {type.name}
                        </Badge>
                        {document.vendorName && (
                          <Badge variant="outline">
                            {document.vendorName}
                          </Badge>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>Uploaded: {new Date(document.uploadDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span>Size: {document.size}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          {document.amount && (
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              <span>Amount: £{document.amount.toLocaleString()}</span>
                            </div>
                          )}
                          {document.dueDate && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>Due: {new Date(document.dueDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {document.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">{document.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleImportant(document.id)}
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      <Star className={`h-4 w-4 ${document.isImportant ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDocument(document.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Document Dialog */}
      <Dialog open={showAddDocument} onOpenChange={setShowAddDocument}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="text-center space-y-4">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Plus className="h-8 w-8 text-blue-600" />
              </div>
              <DialogTitle className="text-xl text-amber-800">Add Document</DialogTitle>
              <p className="text-amber-600 text-sm">Upload or record a new wedding document</p>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {/* File Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
              <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Upload a file or enter document details below</p>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                className="hidden"
                id="file-upload"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setNewDocument(prev => ({
                      ...prev,
                      name: prev.name || file.name.replace(/\.[^/.]+$/, '')
                    }));
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('file-upload')?.click()}
                className="text-blue-600 border-blue-600"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
              <p className="text-xs text-gray-500 mt-1">PDF, DOC, Images supported</p>
            </div>

            <div>
              <Label htmlFor="doc-name" className="text-amber-700">Document Name *</Label>
              <Input
                id="doc-name"
                type="text"
                value={newDocument.name}
                onChange={(e) => setNewDocument(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Venue Contract - The Oak Room"
                className="mt-1"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category" className="text-amber-700">Category</Label>
                <Select 
                  value={newDocument.category} 
                  onValueChange={(value: Document['category']) => 
                    setNewDocument(prev => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(DOCUMENT_CATEGORIES).map(([key, category]) => (
                      <SelectItem key={key} value={key}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type" className="text-amber-700">Type</Label>
                <Select 
                  value={newDocument.type} 
                  onValueChange={(value: Document['type']) => 
                    setNewDocument(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(DOCUMENT_TYPES).map(([key, type]) => (
                      <SelectItem key={key} value={key}>{type.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="vendor" className="text-amber-700">Vendor Name (Optional)</Label>
              <Input
                id="vendor"
                type="text"
                value={newDocument.vendorName}
                onChange={(e) => setNewDocument(prev => ({ ...prev, vendorName: e.target.value }))}
                placeholder="e.g. The Oak Room, Sarah Photography"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount" className="text-amber-700">Amount (£)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={newDocument.amount}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="due-date" className="text-amber-700">Due Date</Label>
                <Input
                  id="due-date"
                  type="date"
                  value={newDocument.dueDate}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes" className="text-amber-700">Notes</Label>
              <Textarea
                id="notes"
                value={newDocument.notes}
                onChange={(e) => setNewDocument(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes about this document"
                rows={3}
                className="mt-1"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="important"
                checked={newDocument.isImportant}
                onChange={(e) => setNewDocument(prev => ({ ...prev, isImportant: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="important" className="text-amber-700">
                Mark as important
              </Label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowAddDocument(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddDocument}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!newDocument.name.trim()}
              >
                Add Document
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}