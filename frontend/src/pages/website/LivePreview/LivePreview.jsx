import React, { useEffect, useState, useRef } from 'react';
import { renderBlock } from '../WebsiteBuilder/WebsiteBuilder';
import '../WebsiteBuilder/WebsiteBuilder.css'; // For the block styles

export default function LivePreview() {
  const [blocks, setBlocks] = useState([]);
  const [theme, setTheme] = useState(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    try {
      const savedBlocks = localStorage.getItem('wb_blocks');
      const savedTheme = localStorage.getItem('wb_theme');
      const savedName = localStorage.getItem('wb_page_name');
      
      if (savedBlocks) setBlocks(JSON.parse(savedBlocks));
      if (savedTheme) setTheme(JSON.parse(savedTheme));
      if (savedName) document.title = savedName + ' - Preview';
    } catch (e) {
      console.error('Error loading preview data from local storage', e);
    }
  }, []);

  useEffect(() => {
    if (theme && wrapperRef.current) {
      Object.entries(theme.vars).forEach(([k, v]) => {
        wrapperRef.current.style.setProperty(k, v);
      });
    }
  }, [theme]);

  if (!theme) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading preview...</div>;

  return (
    <div 
      ref={wrapperRef} 
      style={{ 
        fontFamily: theme.vars['--theme-font'],
        backgroundColor: theme.vars['--theme-bg'],
        color: theme.vars['--theme-text'],
        minHeight: '100vh',
        width: '100%'
      }}
      className="live-preview-wrapper"
    >
      {blocks.map(block => (
        <div key={block.id} style={{ position: 'relative' }}>
          {renderBlock(block, true)}
        </div>
      ))}
    </div>
  );
}
