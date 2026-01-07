'use client';

import { useState, useEffect, useRef } from 'react';

interface PDFViewerProps {
  pdfUrl: string;
  pageNumber: number;
  darkMode: boolean;
}

export default function PDFViewer({ pdfUrl, pageNumber, darkMode }: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(pageNumber);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Sync with prop changes
  useEffect(() => {
    if (pageNumber && pageNumber !== currentPage) {
      console.log('Page number prop changed:', pageNumber);
      setCurrentPage(pageNumber);
    }
  }, [pageNumber]);

  // Force iframe reload when page changes
  useEffect(() => {
    if (pdfUrl && currentPage) {
      console.log('Reloading iframe for page:', currentPage);
      setReloadKey(prev => prev + 1);
    }
  }, [currentPage, pdfUrl]);

  // Update input value
  useEffect(() => {
    if (inputRef.current && currentPage) {
      inputRef.current.value = currentPage.toString();
    }
  }, [currentPage]);

  const goToPrevPage = () => {
    console.log('Prev button clicked, current page:', currentPage);
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      console.log('Setting page to:', newPage);
      setCurrentPage(newPage);
    } else {
      console.log('Already on first page');
    }
  };

  const goToNextPage = () => {
    console.log('Next button clicked, current page:', currentPage);
    const newPage = currentPage + 1;
    console.log('Setting page to:', newPage);
    setCurrentPage(newPage);
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    console.log('Input value changed:', value);
    if (value === '') {
      return;
    }
    const page = parseInt(value);
    if (!isNaN(page) && page >= 1) {
      console.log('Setting page from input to:', page);
      setCurrentPage(page);
    }
  };

  const handlePageInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const page = parseInt(e.currentTarget.value);
      console.log('Enter pressed, page:', page);
      if (!isNaN(page) && page >= 1) {
        setCurrentPage(page);
      } else {
        e.currentTarget.value = currentPage.toString();
      }
    }
  };

  const handlePageInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (value === '') {
      e.target.value = currentPage.toString();
      return;
    }
    const page = parseInt(value);
    if (isNaN(page) || page < 1) {
      e.target.value = currentPage.toString();
    } else if (page !== currentPage) {
      console.log('Input blurred, setting page to:', page);
      setCurrentPage(page);
    }
  };

  // Build PDF URL with page parameter
  const getPdfUrl = () => {
    if (!pdfUrl) return '';
    const baseUrl = pdfUrl.split('#')[0].split('?')[0];
    // Try multiple formats for better browser compatibility
    return `${baseUrl}?page=${currentPage}#page=${currentPage}`;
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className={`text-6xl mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-300'}`}>📄</div>
        <p className={`text-lg font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{error}</p>
        <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>Please try uploading the PDF again</p>
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className={`text-6xl mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-300'}`}>📄</div>
        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Select a textbook to view PDF</p>
      </div>
    );
  }

  const pdfSrc = getPdfUrl();

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* PDF Controls */}
      <div className={`flex items-center justify-between mb-4 p-3 rounded-xl gap-3 flex-shrink-0 ${
        darkMode ? 'bg-slate-700/50' : 'bg-slate-100'
      }`}>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            goToPrevPage();
          }}
          disabled={currentPage <= 1}
          className={`px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 ${
            darkMode 
              ? 'bg-slate-600 text-slate-200 hover:bg-slate-500' 
              : 'bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          ← Prev
        </button>
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="number"
            min="1"
            value={currentPage}
            onChange={handlePageInputChange}
            onKeyPress={handlePageInputKeyPress}
            onBlur={handlePageInputBlur}
            className={`w-20 px-2 py-2 rounded-lg text-center border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode
                ? 'bg-slate-600 text-slate-100 border-slate-500'
                : 'bg-white text-slate-900 border-slate-300'
            }`}
          />
          <span className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Page
          </span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            goToNextPage();
          }}
          className={`px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 ${
            darkMode 
              ? 'bg-slate-600 text-slate-200 hover:bg-slate-500' 
              : 'bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          Next →
        </button>
      </div>

      {/* PDF Display - Using both iframe and embed for compatibility */}
      <div className={`flex-1 overflow-hidden rounded-xl border-2 shadow-inner ${
        darkMode 
          ? 'border-slate-700 bg-slate-900/50' 
          : 'border-slate-200 bg-slate-50'
      }`}>
        {/* Try iframe first */}
        <iframe
          key={`pdf-iframe-${reloadKey}-${currentPage}`}
          ref={iframeRef}
          id="pdf-iframe"
          src={pdfSrc}
          className="w-full h-full"
          title="PDF Viewer"
          style={{ border: 'none' }}
          onError={() => {
            console.error('PDF iframe error');
            setError('Failed to load PDF.');
          }}
          onLoad={() => {
            setError(null);
            console.log('PDF iframe loaded successfully, page:', currentPage);
          }}
        />
      </div>
      
      {/* Debug info - remove in production */}
      <div className="mt-2 text-center flex-shrink-0">
        <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          Page {currentPage} | Use browser zoom (Ctrl/Cmd + Mouse Wheel) to zoom
        </p>
      </div>
    </div>
  );
}
