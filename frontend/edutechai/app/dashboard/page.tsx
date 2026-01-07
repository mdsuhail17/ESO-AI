'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, LogOut, GraduationCap, BookOpen, Download, FileText, MessageSquare, Plus } from 'lucide-react';

// Dynamically import PDF viewer to avoid SSR issues
const PDFViewer = dynamic(() => import('../components/PDFViewer'), { ssr: false });

interface Textbook {
  _id: string;
  filename: string;
  uploaded_at: string;
  page_count: number;
}

interface Message {
  type: 'user' | 'assistant';
  content: string;
  isExplanation?: boolean;
  pageNumber?: number;
  timestamp?: string;
}

interface Conversation {
  _id: string;
  textbook_id: string;
  question?: string;
  answer?: string;
  lecture_content?: string;
  topic?: string;
  chapter?: string;
  type?: 'student' | 'lecture';
  page_number?: number;
  timestamp: string;
}

export default function Home() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [textbooks, setTextbooks] = useState<Textbook[]>([]);
  const [selectedTextbook, setSelectedTextbook] = useState<string>('');
  const [selectedTextbookData, setSelectedTextbookData] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [explaining, setExplaining] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const [mode, setMode] = useState<'student' | 'lecture'>('student');
  const [lectureTopic, setLectureTopic] = useState('');
  const [lectureChapter, setLectureChapter] = useState('');
  const [lectureContent, setLectureContent] = useState<string | null>(null);
  const [generatingLecture, setGeneratingLecture] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_URL = typeof window !== 'undefined' 
    ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000')
    : 'http://localhost:8000';

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('userId');
    const name = localStorage.getItem('userName');
    const savedMode = localStorage.getItem('mode') as 'student' | 'lecture' | null;
    
    if (!token || !id) {
      router.push('/login');
      return;
    }
    
    setUserId(id);
    setUserName(name || '');
    if (savedMode === 'student' || savedMode === 'lecture') {
      setMode(savedMode);
    }
  }, [router]);

  // Load dark mode preference
  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      setDarkMode(saved === 'true');
    } else {
      // Check system preference
      if (typeof window !== 'undefined') {
        setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
      }
    }
  }, []);

  // Apply dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  // Fetch textbooks on component mount
  useEffect(() => {
    if (userId) {
      fetchTextbooks();
    }
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    router.push('/');
  };

  // Fetch textbook data when selected
  useEffect(() => {
    if (selectedTextbook) {
      fetchTextbookData(selectedTextbook);
    }
  }, [selectedTextbook]);

  // Fetch conversations when textbook is selected or mode changes
  useEffect(() => {
    if (selectedTextbook && userId) {
      fetchConversations(selectedTextbook);
    }
  }, [selectedTextbook, mode, userId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchTextbooks = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`${API_URL}/textbooks?user_id=${userId}`);
      const data = await response.json();
      setTextbooks(data.textbooks || []);
    } catch (error) {
      console.error('Error fetching textbooks:', error);
    }
  };

  const handleDeleteTextbook = async (textbookId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent selecting the textbook when clicking delete
    
    if (!confirm('Are you sure you want to delete this textbook? This will also delete all related conversations.')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/textbook/${textbookId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      // If deleted textbook was selected, clear selection
      if (selectedTextbook === textbookId) {
        setSelectedTextbook('');
        setMessages([]);
        setCurrentPage(null);
      }

      // Refresh textbook list
      await fetchTextbooks();
    } catch (error) {
      console.error('Error deleting textbook:', error);
      alert('Error deleting textbook. Please try again.');
    }
  };

  const fetchTextbookData = async (textbookId: string) => {
    try {
      const response = await fetch(`${API_URL}/textbook/${textbookId}`);
      const data = await response.json();
      setSelectedTextbookData(data);
    } catch (error) {
      console.error('Error fetching textbook data:', error);
    }
  };

  const fetchConversations = async (textbookId: string) => {
    if (!userId) return;
    try {
      const response = await fetch(`${API_URL}/conversations/${textbookId}?user_id=${userId}`);
      const data = await response.json();
      setConversations(data.conversations || []);
      
      // Load conversation history into messages (only for student mode)
      if (mode === 'student') {
        const historyMessages: Message[] = [];
        data.conversations
          .filter((conv: Conversation) => conv.type !== 'lecture' && conv.question && conv.answer)
          .forEach((conv: Conversation) => {
            historyMessages.push({
              type: 'user',
              content: conv.question!,
              timestamp: conv.timestamp
            });
            historyMessages.push({
              type: 'assistant',
              content: conv.answer!,
              pageNumber: conv.page_number || undefined,
              timestamp: conv.timestamp
            });
          });
        setMessages(historyMessages.reverse());
      } else {
        // For lecture mode, load the last lecture if available
        const lectures = data.conversations
          .filter((conv: Conversation) => {
            // Check if it's a lecture - either has type='lecture' or has lecture_content/content without answer
            const hasContent = conv.lecture_content || (conv as any).content;
            return conv.type === 'lecture' || (hasContent && !conv.answer);
          })
          .sort((a: Conversation, b: Conversation) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
        
        if (lectures.length > 0) {
          const lastLecture = lectures[0];
          // Handle both lecture_content and content field (for backward compatibility)
          const content = lastLecture.lecture_content || (lastLecture as any).content;
          if (content) {
            setLectureContent(content);
            setLectureTopic(lastLecture.topic || '');
            setLectureChapter(lastLecture.chapter || '');
          }
        } else {
          // Clear lecture content if no lectures found
          setLectureContent(null);
          setLectureTopic('');
          setLectureChapter('');
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.pdf')) {
      alert('Please upload a PDF file');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    if (!userId) {
      alert('Please login first');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/upload-textbook?user_id=${userId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      await fetchTextbooks();
      setSelectedTextbook(data.textbook_id);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading textbook. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateLecture = async () => {
    if (!selectedTextbook) {
      alert('Please select or upload a textbook first');
      return;
    }

    if (!lectureTopic.trim()) {
      alert('Please enter a topic for the lecture');
      return;
    }

    setGeneratingLecture(true);
    setLectureContent(null);

    try {
      const response = await fetch(`${API_URL}/generate-lecture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          textbook_id: selectedTextbook,
          topic: lectureTopic.trim(),
          chapter: lectureChapter.trim() || null,
          user_id: userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate lecture');
      }

      const data = await response.json();
      setLectureContent(data.lecture_content);
    } catch (error) {
      console.error('Error generating lecture:', error);
      alert('Error generating lecture. Please try again.');
    } finally {
      setGeneratingLecture(false);
    }
  };

  const handleDownloadLecture = async (format: 'pdf' | 'text') => {
    if (!lectureContent) return;

    if (format === 'text') {
      const blob = new Blob([lectureContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lecture-${lectureTopic.replace(/\s+/g, '-')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // Use jsPDF for PDF generation
      try {
        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF();
        
        // Set font and margins
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const maxWidth = pageWidth - 2 * margin;
        
        // Split content into lines that fit the page width
        const lines = doc.splitTextToSize(lectureContent, maxWidth);
        
        let y = margin;
        const lineHeight = 7;
        const pageHeightWithMargin = pageHeight - margin;
        
        // Add content page by page
        for (let i = 0; i < lines.length; i++) {
          if (y + lineHeight > pageHeightWithMargin) {
            doc.addPage();
            y = margin;
          }
          doc.text(lines[i], margin, y);
          y += lineHeight;
        }
        
        // Save the PDF
        doc.save(`lecture-${lectureTopic.replace(/\s+/g, '-')}.pdf`);
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
      }
    }
  };

  const handleNewChat = () => {
    if (mode === 'student') {
      // Clear student mode conversation
      setMessages([]);
      setQuestion('');
      setCurrentPage(null);
    } else {
      // Clear lecture mode
      setLectureContent(null);
      setLectureTopic('');
      setLectureChapter('');
    }
    // Optionally clear selected textbook to allow new selection
    // setSelectedTextbook('');
  };

  const handleAskQuestion = async () => {
    if (!selectedTextbook) {
      alert('Please select or upload a textbook first');
      return;
    }

    if (!question.trim()) {
      alert('Please enter a question');
      return;
    }

    const userQuestion = question.trim();
    setQuestion('');
    setLoading(true);

    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: userQuestion }]);

    try {
      const response = await fetch(`${API_URL}/ask-question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          textbook_id: selectedTextbook,
          question: userQuestion,
          user_id: userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get answer');
      }

      const data = await response.json();
      
      // Add assistant message
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        content: data.answer,
        pageNumber: data.page_number || undefined,
        isExplanation: false
      }]);

      // If page number is available, show that page
      if (data.page_number) {
        setCurrentPage(data.page_number);
      }

      // Refresh conversations
      await fetchConversations(selectedTextbook);
    } catch (error) {
      console.error('Error asking question:', error);
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleExplain = async (answer: string, questionText: string) => {
    if (!selectedTextbook) return;

    setExplaining(true);

    try {
      const response = await fetch(`${API_URL}/explain-answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          textbook_id: selectedTextbook,
          answer: answer,
          question: questionText,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get explanation');
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        content: `**Simple Explanation:**\n\n${data.explanation}`,
        isExplanation: true
      }]);
    } catch (error) {
      console.error('Error getting explanation:', error);
      alert('Error getting explanation. Please try again.');
    } finally {
      setExplaining(false);
    }
  };

  const loadConversation = (conv: Conversation) => {
    if (conv.type === 'lecture' || conv.lecture_content || (conv as any).content) {
      // Load lecture content
      const content = conv.lecture_content || (conv as any).content;
      if (content) {
        setLectureContent(content);
        setLectureTopic(conv.topic || '');
        setLectureChapter(conv.chapter || '');
      }
    } else {
      // Load student conversation
      if (conv.question && conv.answer) {
        setMessages([
          { type: 'user', content: conv.question, timestamp: conv.timestamp },
          { type: 'assistant', content: conv.answer, pageNumber: conv.page_number || undefined, timestamp: conv.timestamp }
        ]);
        if (conv.page_number) {
          setCurrentPage(conv.page_number);
        }
      }
    }
  };

  const selectedTextbookInfo = textbooks.find(t => t._id === selectedTextbook);

  // Helper function to get conditional classes
  const getClasses = (light: string, dark: string) => darkMode ? dark : light;

  return (
    <div className={`min-h-screen transition-all duration-300 ${getClasses('bg-white text-slate-900', 'bg-slate-900 text-white')}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-lg border-b shadow-sm transition-all duration-300 ${
        darkMode 
          ? 'bg-slate-800/90 border-slate-700' 
          : 'bg-white/90 border-slate-200'
      }`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">E</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ESo AI
                </h1>
                <p className={`text-xs transition-colors ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Your Intelligent Study Companion</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              {/* Profile with User Name */}
              {userName && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border transition-all ${
                  darkMode 
                    ? 'bg-slate-700/50 border-slate-600 text-white' 
                    : 'bg-slate-100/50 border-slate-300 text-slate-800'
                }`}>
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{userName}</span>
                </div>
              )}
              
              {/* Mode Switcher */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
                darkMode 
                  ? 'bg-slate-800 border-slate-700' 
                  : 'bg-slate-100 border-slate-300'
              }`}>
                <button
                  onClick={() => {
                    setMode('student');
                    localStorage.setItem('mode', 'student');
                    setLectureContent(null);
                    setLectureTopic('');
                    setLectureChapter('');
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${
                    mode === 'student'
                      ? darkMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white'
                      : darkMode
                        ? 'text-slate-300 hover:text-white'
                        : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm font-medium">Student</span>
                </button>
                <button
                  onClick={() => {
                    setMode('lecture');
                    localStorage.setItem('mode', 'lecture');
                    setMessages([]);
                    setQuestion('');
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${
                    mode === 'lecture'
                      ? darkMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white'
                      : darkMode
                        ? 'text-slate-300 hover:text-white'
                        : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span className="text-sm font-medium">Lecture</span>
                </button>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border transition-all hover:opacity-80 ${
                  darkMode 
                    ? 'bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30' 
                    : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                }`}
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`relative w-14 h-8 rounded-full p-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  darkMode ? 'bg-slate-700' : 'bg-slate-200'
                }`}
                aria-label="Toggle dark mode"
              >
                <div className={`absolute top-1 left-1 w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                  darkMode 
                    ? 'translate-x-6 bg-slate-600' 
                    : 'translate-x-0 bg-white'
                }`}>
                  {darkMode ? (
                    <span className="absolute inset-0 flex items-center justify-center text-yellow-400 text-sm">🌙</span>
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-yellow-500 text-sm">☀️</span>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6 h-[calc(100vh-88px)] overflow-hidden">
        <div className="grid grid-cols-12 gap-6 h-full max-h-full">
          {/* Left Panel - Upload & History */}
          <div className="col-span-3 flex flex-col gap-4">
            <div className={`backdrop-blur-xl rounded-2xl shadow-xl border p-6 flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
              darkMode 
                ? 'bg-slate-800/90 border-slate-700' 
                : 'bg-white/90 border-slate-200'
            }`}>
              <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 transition-colors ${
                darkMode ? 'text-white' : 'text-slate-800'
              }`}>
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Library
              </h2>

              {/* Upload Section */}
              <div className="mb-6">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className={`group relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
                    uploading
                      ? darkMode ? 'border-blue-400 bg-blue-900/20' : 'border-blue-400 bg-blue-50'
                      : darkMode 
                        ? 'border-slate-600 bg-slate-700/50 hover:border-blue-400 hover:bg-blue-900/20'
                        : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <span className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Upload PDF</span>
                      <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Click or drag to upload</span>
                    </div>
                  )}
                </label>
              </div>

              {/* Textbook List */}
              <div data-lenis-prevent className="flex-1 overflow-y-auto">
                <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Textbooks
                </p>
                {textbooks.length === 0 ? (
                  <div className={`text-center py-8 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    <p className="text-sm">No textbooks yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {textbooks.map((textbook) => (
                      <div
                        key={textbook._id}
                        className={`group relative w-full rounded-xl transition-all duration-200 ${
                          selectedTextbook === textbook._id
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-105'
                            : darkMode
                              ? 'bg-slate-700/50 hover:bg-slate-700'
                              : 'bg-slate-100 hover:bg-slate-200'
                        }`}
                      >
                        <button
                          onClick={() => setSelectedTextbook(textbook._id)}
                          className="w-full text-left p-3 pr-10"
                        >
                          <p className={`font-medium text-sm truncate mb-1 ${
                            selectedTextbook === textbook._id ? 'text-white' : darkMode ? 'text-slate-300' : 'text-slate-700'
                          }`}>
                            {textbook.filename}
                          </p>
                          <p className={`text-xs ${selectedTextbook === textbook._id ? 'text-blue-100' : darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {textbook.page_count} pages
                          </p>
                        </button>
                        <button
                          onClick={(e) => handleDeleteTextbook(textbook._id, e)}
                          className={`absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 ${
                            selectedTextbook === textbook._id
                              ? 'text-white hover:text-red-200'
                              : darkMode
                                ? 'text-slate-400 hover:text-red-400'
                                : 'text-slate-500 hover:text-red-600'
                          }`}
                          title="Delete textbook"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Conversation History */}
              {selectedTextbook && conversations.length > 0 && (
                <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {mode === 'student' ? 'Recent Conversations' : 'Recent Lectures'}
                  </p>
                  <div data-lenis-prevent className="space-y-2 max-h-48 overflow-y-auto">
                    {conversations
                      .filter((conv) => {
                        if (mode === 'student') {
                          return conv.type !== 'lecture' && conv.question && conv.answer && !conv.lecture_content && !(conv as any).content;
                        } else {
                          // Show lectures - either has type='lecture' or has lecture_content/content without answer
                          return (conv.type === 'lecture' || conv.lecture_content || (conv as any).content) && !conv.answer;
                        }
                      })
                      .slice(0, 5)
                      .map((conv) => (
                        <button
                          key={conv._id}
                          onClick={() => loadConversation(conv)}
                          className={`w-full text-left p-2 rounded-lg transition-colors ${
                            darkMode 
                              ? 'bg-slate-700/50 hover:bg-slate-700' 
                              : 'bg-slate-100 hover:bg-slate-200'
                          }`}
                        >
                          <p className={`text-xs font-medium truncate mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            {mode === 'student' 
                              ? (conv.question || 'Question')
                              : (conv.topic || 'Lecture Topic')
                            }
                          </p>
                          <p className={`text-xs line-clamp-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {mode === 'student' 
                              ? (conv.answer ? `${conv.answer.substring(0, 50)}...` : 'No answer')
                              : (() => {
                                  const content = conv.lecture_content || (conv as any).content;
                                  return content ? `${content.substring(0, 50)}...` : 'No content';
                                })()
                            }
                          </p>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Middle Panel - Chat or Lecture Mode */}
          <div className={`flex flex-col min-h-0 ${
            mode === 'student' ? 'col-span-5' : 'col-span-9'
          }`}>
            {mode === 'student' ? (
              <div className={`backdrop-blur-xl rounded-2xl shadow-xl border flex flex-col h-full max-h-full overflow-hidden transition-all duration-300 ${
                darkMode 
                  ? 'bg-slate-800/90 border-slate-700' 
                  : 'bg-white/90 border-slate-200'
              }`}>
                {/* Chat Header */}
                <div className={`p-6 border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h2 className={`text-lg font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Chat
                      </h2>
                      {selectedTextbookInfo && (
                        <p className={`text-sm mt-1 truncate ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {selectedTextbookInfo.filename}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={handleNewChat}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        darkMode
                          ? 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300'
                      }`}
                      title="Start New Chat"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-sm font-medium">New Chat</span>
                    </button>
                  </div>
                </div>

              {/* Messages */}
              <div 
                data-lenis-prevent
                className={`flex-1 min-h-0 overflow-y-auto p-6 space-y-4 transition-colors ${
                  darkMode ? 'bg-slate-900/50' : 'bg-slate-50/50'
                }`}
              >
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                      darkMode 
                        ? 'bg-blue-900/30' 
                        : 'bg-blue-100'
                    }`}>
                      <span className="text-4xl">👋</span>
                    </div>
                    <p className={`text-lg font-semibold mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Welcome!</p>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Select a textbook and start asking questions</p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-300`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-lg ${
                          message.type === 'user'
                            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-br-sm'
                            : darkMode
                              ? 'bg-slate-700 text-white rounded-bl-sm border border-slate-600'
                              : 'bg-white text-slate-800 rounded-bl-sm border border-slate-200'
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                        {message.pageNumber && (
                          <div className={`mt-2 pt-2 border-t ${message.type === 'user' ? 'border-blue-400' : darkMode ? 'border-slate-600' : 'border-slate-200'}`}>
                            <span className={`text-xs flex items-center gap-1 ${message.type === 'user' ? 'text-blue-100' : darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                              📄 Page {message.pageNumber}
                            </span>
                          </div>
                        )}
                        {message.type === 'assistant' && !message.isExplanation && (
                          <button
                            onClick={() => {
                              const questionIndex = messages.findIndex(
                                (m, i) => i < index && m.type === 'user'
                              );
                              const questionText = questionIndex >= 0 
                                ? messages[questionIndex].content 
                                : '';
                              handleExplain(message.content, questionText);
                            }}
                            disabled={explaining}
                            className={`mt-2 text-xs hover:underline disabled:opacity-50 flex items-center gap-1 ${
                              darkMode ? 'text-blue-400' : 'text-blue-600'
                            }`}
                          >
                            {explaining ? '⏳ Explaining...' : '💡 Explain in simple words'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div className="flex justify-start">
                    <div className={`rounded-2xl rounded-bl-sm px-4 py-3 shadow-lg border ${
                      darkMode 
                        ? 'bg-slate-700 border-slate-600' 
                        : 'bg-white border-slate-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                        <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className={`p-6 border-t ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-white/50'}`}>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAskQuestion();
                      }
                    }}
                    placeholder="Ask a question about the textbook..."
                    className={`flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      darkMode
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500'
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                    }`}
                    disabled={loading || !selectedTextbook}
                  />
                  <button
                    onClick={handleAskQuestion}
                    disabled={loading || !selectedTextbook || !question.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Asking...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <span>Ask</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              </div>
            ) : (
              /* Lecture Mode UI */
              <div className={`backdrop-blur-xl rounded-2xl shadow-xl border flex flex-col h-full max-h-full overflow-hidden transition-all duration-300 ${
                darkMode 
                  ? 'bg-slate-800/90 border-slate-700' 
                  : 'bg-white/90 border-slate-200'
              }`}>
                {/* Lecture Header */}
                <div className={`p-6 border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h2 className={`text-lg font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        Lecture Mode
                      </h2>
                      {selectedTextbookInfo && (
                        <p className={`text-sm mt-1 truncate ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {selectedTextbookInfo.filename}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={handleNewChat}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        darkMode
                          ? 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300'
                      }`}
                      title="Start New Lecture"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-sm font-medium">New Chat</span>
                    </button>
                  </div>
                </div>

                {/* Lecture Input Form */}
                <div className={`p-6 border-b ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-white/50'}`}>
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        Topic/Chapter <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={lectureTopic}
                        onChange={(e) => setLectureTopic(e.target.value)}
                        placeholder="e.g., Introduction to Quantum Mechanics"
                        className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                          darkMode
                            ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500'
                            : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                        }`}
                        disabled={generatingLecture || !selectedTextbook}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        Chapter (Optional)
                      </label>
                      <input
                        type="text"
                        value={lectureChapter}
                        onChange={(e) => setLectureChapter(e.target.value)}
                        placeholder="e.g., Chapter 5"
                        className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                          darkMode
                            ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500'
                            : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                        }`}
                        disabled={generatingLecture || !selectedTextbook}
                      />
                    </div>
                    <button
                      onClick={handleGenerateLecture}
                      disabled={generatingLecture || !selectedTextbook || !lectureTopic.trim()}
                      className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      {generatingLecture ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Generating Lecture Plan...</span>
                        </>
                      ) : (
                        <>
                          <GraduationCap className="w-5 h-5" />
                          <span>Generate 45-Minute Lecture Plan</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Lecture Content Display */}
                <div 
                  data-lenis-prevent
                  className={`flex-1 min-h-0 overflow-y-auto p-6 transition-colors ${
                    darkMode ? 'bg-slate-900/50' : 'bg-slate-50/50'
                  }`}
                >
                  {!lectureContent ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                        darkMode 
                          ? 'bg-purple-900/30' 
                          : 'bg-purple-100'
                      }`}>
                        <GraduationCap className={`w-10 h-10 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                      </div>
                      <p className={`text-lg font-semibold mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        Generate Your Lecture Plan
                      </p>
                      <p className={`text-sm max-w-md ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Enter a topic and let AI create a structured 45-minute lecture plan with slides, speaker notes, and questions.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Download Buttons */}
                      <div className="flex gap-3 mb-4">
                        <button
                          onClick={() => handleDownloadLecture('text')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                            darkMode
                              ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600'
                              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <FileText className="w-4 h-4" />
                          <span className="text-sm font-medium">Download Text</span>
                        </button>
                        <button
                          onClick={() => handleDownloadLecture('pdf')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                            darkMode
                              ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600'
                              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <Download className="w-4 h-4" />
                          <span className="text-sm font-medium">Download PDF</span>
                        </button>
                      </div>

                      {/* Lecture Content */}
                      <div className={`rounded-xl p-6 border ${
                        darkMode
                          ? 'bg-slate-800 border-slate-700 text-white'
                          : 'bg-white border-slate-200 text-slate-800'
                      }`}>
                        <div className="prose prose-slate dark:prose-invert max-w-none">
                          <pre className={`whitespace-pre-wrap font-sans text-sm leading-relaxed ${
                            darkMode ? 'text-slate-300' : 'text-slate-700'
                          }`}>
                            {lectureContent}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - PDF Viewer (only in Student Mode) */}
          {mode === 'student' && (
          <div className="col-span-4 flex flex-col min-h-0">
            <div className={`backdrop-blur-xl rounded-2xl shadow-xl border flex flex-col h-full max-h-full overflow-hidden transition-all duration-300 ${
              darkMode 
                ? 'bg-slate-800/90 border-slate-700' 
                : 'bg-white/90 border-slate-200'
            }`}>
              <div className={`p-6 border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                <h2 className={`text-lg font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  PDF Viewer
                </h2>
                {currentPage && (
                  <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Page {currentPage}
                  </p>
                )}
              </div>
              <div className="flex-1 min-h-0 overflow-hidden p-6">
                {selectedTextbook && selectedTextbookData ? (
                  <PDFViewer 
                    pdfUrl={`${API_URL}/textbook/${selectedTextbook}/pdf`}
                    pageNumber={currentPage || 1}
                    darkMode={darkMode}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                      darkMode 
                        ? 'bg-purple-900/30' 
                        : 'bg-purple-100'
                    }`}>
                      <span className="text-4xl">📄</span>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Select a textbook to view PDF</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
