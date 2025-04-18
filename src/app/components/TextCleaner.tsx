'use client';

import { jsPDF } from 'jspdf';
import { useState } from 'react';

const TextCleaner = () => {
  const [inputText, setInputText] = useState('');
  const [cleanedText, setCleanedText] = useState('');
  const [error, setError] = useState<string | null>(null);  // Error state

  const handleCleanText = () => {
    // Check if the input text is empty and handle the error
    if (!inputText.trim()) {
      setError('Input text cannot be empty.');
      return;
    }
    
    // Clear previous errors
    setError(null);

    // Basic text cleaning operations
    let cleaned = inputText
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .replace(/\n+/g, ' ') // Replace multiple newlines with a single space
    .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII characters
    .replace(/[“”]/g, '"') // Convert smart quotes to regular quotes
    .replace(/[‘’]/g, "'") // Convert smart apostrophes to regular ones
    .replace(/[\u2018\u2019\u201C\u201D\u2013\u2014]/g, '') // Remove other special characters (like curly apostrophes)
    .trim(); // Trim leading/trailing spaces

    cleaned = cleaned
    .replace(/(?:\d+\.)\s*/g, '- ') // Replace numbered list with '-'
    .replace(/^\s*[-*]\s*/gm, '- '); // Normalize bullet points (both - and *)

    cleaned = cleaned.replace(/- \s*-/g, '-');
    
    setCleanedText(cleaned);
  };

  const handleDownload = () => {
    if (!cleanedText) return; // Ensure there's something to download
    
    const blob = new Blob([cleanedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cleaned-text.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    if (!cleanedText) return; // Ensure there's something to export to PDF
    
    const pdf = new jsPDF();
    pdf.text(cleanedText, 10, 10);
    pdf.save('cleaned-text.pdf');
  };

  return (
    <div className="container">
      <h1>TextalClear</h1>
      
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
        {error && <p className="error-text">{error}</p>} {/* Show error message if input is empty */}
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
