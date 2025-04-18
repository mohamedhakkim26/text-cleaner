'use client';

import { jsPDF } from 'jspdf';
import { useState } from 'react';

const TextCleaner = () => {
  const [inputText, setInputText] = useState('');
  const [cleanedText, setCleanedText] = useState('');

  const handleCleanText = () => {
    // Basic text cleaning operations
    const cleaned = inputText
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\n/g, ' ')
      .replace(/[^\x00-\x7F]/g, ''); // Remove non-ASCII characters
    
    setCleanedText(cleaned);
  };

  const handleDownload = () => {
    const blob = new Blob([cleanedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cleaned-text.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const pdf = new jsPDF();
    pdf.text(cleanedText, 10, 10);
    pdf.save('cleaned-text.pdf');
  };


  return (
    <div className="container">
      <h1>TEXT CLEANER</h1>
      
      <div className="input-section">
        <h2>INPUT TEXT</h2>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text to clean..."
        />
        <button onClick={handleCleanText} className="clean-btn">
          Clean Text
        </button>
      </div>

      {cleanedText && (
        <div className="output-section">
          <h2>CLEANED TEXT</h2>
          <textarea
            value={cleanedText}
            readOnly
          />
          <div className="button-group">
            <button 
                onClick={handleDownload} 
                className="download-btn"
                data-tooltip="Download as .txt file"
            >
            Download Cleaned Text
            </button>
            <button 
                onClick={handleExportPDF} 
                className="pdf-btn"
                data-tooltip="Export as PDF document"
            >
            Export to PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextCleaner;