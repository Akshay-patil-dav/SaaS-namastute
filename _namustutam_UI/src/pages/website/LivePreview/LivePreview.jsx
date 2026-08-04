import React, { useEffect, useState, useRef } from 'react';
import { Image as ImageIcon, CreditCard, Search, Activity, Calendar } from 'lucide-react';
import { useCurrency } from '../../../hooks/useCurrency';


export default function LivePreview() {
    const { currencySymbol } = useCurrency();

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
    if (theme && theme.vars && wrapperRef.current) {
      Object.entries(theme.vars).forEach(([k, v]) => {
        wrapperRef.current.style.setProperty(k, v);
      });
    }
  }, [theme]);

  const renderBlock = (block) => {
    switch (block.type) {
      case 'HEADING':
        return <h1 className="text-2xl md:text-3xl font-bold text-gray-800 p-2 rounded">{block.content}</h1>;
      case 'TEXT':
        return <p className="text-gray-600 text-sm leading-relaxed p-2 rounded">{block.content}</p>;
      case 'IMAGE':
        return <div className="w-full h-32 md:h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 p-4 text-center"><ImageIcon size={28} className="mb-2"/><span className="text-xs font-semibold">Image Placeholder</span></div>;
      case 'CARD':
        return (
          <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-2">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 mb-2 shrink-0"><CreditCard size={20}/></div>
            <h3 className="font-bold text-gray-800">Feature Card Title</h3>
            <p className="text-xs text-gray-500">A descriptive text block inside a card component.</p>
          </div>
        );
      case 'LAYOUT':
        return (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 bg-gray-50 border border-gray-200 border-dashed rounded h-24 md:h-32 flex items-center justify-center text-xs text-gray-400 font-semibold">Column 1</div>
            <div className="flex-1 bg-gray-50 border border-gray-200 border-dashed rounded h-24 md:h-32 flex items-center justify-center text-xs text-gray-400 font-semibold">Column 2</div>
          </div>
        );
      case 'DIVIDER':
        return <hr className="border-t border-gray-200 my-4 w-full" />;
      case 'FORM_TEXT':
        return (
          <div className="flex flex-col gap-1 w-full max-w-sm ml-2 mb-2">
            <label className="text-xs font-semibold text-gray-700">Email Address</label>
            <input type="text" placeholder="User input field..." disabled className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
          </div>
        );
      case 'FORM_BUTTON':
        return (
          <button className="px-5 py-2.5 ml-2 mb-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-sm w-auto text-left inline-block">
            Submit Form
          </button>
        );
      case 'SEARCH':
        return (
          <div className="relative w-full max-w-lg shadow-sm rounded-lg border border-gray-200 bg-white flex items-center px-4 py-2 mb-2">
            <Search size={16} className="text-gray-400 mr-2 shrink-0" />
            <input type="text" placeholder="Search data records globally..." disabled className="bg-transparent border-none text-sm w-full text-gray-400 cursor-not-allowed h-full" />
          </div>
        );
      case 'DATA_TABLE':
        return (
          <div className="w-full border border-gray-200 rounded-lg overflow-hidden flex flex-col mb-4 bg-white">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase flex justify-between">
              <span className="w-16">ID</span><span className="flex-1">Client Name</span><span className="w-24 text-center">Status</span><span className="w-24 text-right">Created</span>
            </div>
            <div className="px-4 py-3 flex justify-between items-center text-sm text-gray-700 border-b border-gray-100">
              <span className="w-16 font-medium text-gray-500">#4019</span><span className="flex-1 font-semibold">Acme Corp</span><span className="w-24 text-center"><span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs font-bold">Active</span></span><span className="w-24 text-right text-gray-500">Oct 24</span>
            </div>
            <div className="px-4 py-3 flex justify-between items-center text-sm text-gray-700">
              <span className="w-16 font-medium text-gray-500">#4020</span><span className="flex-1 font-semibold">Global Tech</span><span className="w-24 text-center"><span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-xs font-bold">Review</span></span><span className="w-24 text-right text-gray-500">Oct 25</span>
            </div>
          </div>
        );
      case 'METRIC_CARD':
        return (
          <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Total Revenue</p>
              <h3 className="text-3xl font-black text-gray-800 mt-1">{currencySymbol}45,231.00</h3>
              <p className="text-[10px] text-emerald-500 font-bold mt-1">+14.5% from last month</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Activity size={28} />
            </div>
          </div>
        );
      case 'CHART_BAR':
        return (
          <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm flex flex-col gap-4 mb-2">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold text-gray-800">Annual Projections</h4>
              <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-1 rounded">2026 Data</span>
            </div>
            <div className="flex items-end justify-between gap-2 h-32 w-full pt-4 border-b border-gray-100 pb-2">
              <div className="w-10 bg-indigo-200 rounded-t-sm h-[30%]"></div>
              <div className="w-10 bg-indigo-300 rounded-t-sm h-[50%]"></div>
              <div className="w-10 bg-indigo-400 rounded-t-sm h-[40%]"></div>
              <div className="w-10 bg-indigo-500 rounded-t-sm h-[80%]"></div>
              <div className="w-10 bg-indigo-600 rounded-t-sm h-[100%] shadow-inner"></div>
              <div className="w-10 bg-purple-500 rounded-t-sm h-[65%]"></div>
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 uppercase font-bold px-1">
              <span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span><span>Y1</span><span>Y2</span>
            </div>
          </div>
        );
      case 'CALENDAR':
        return (
          <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm mb-2 max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold text-gray-800">Deployment Schedule</h4>
              <Calendar size={18} className="text-indigo-400" />
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-gray-400 font-bold mb-2">
              <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {[...Array(28)].map((_, i) => (
                <div key={i} className={`h-8 flex items-center justify-center rounded-md text-xs font-semibold transition-colors ${i === 12 ? 'bg-indigo-600 text-white shadow-md' : i === 16 ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'text-gray-600 border border-transparent'}`}>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <div className="p-4 bg-gray-100">{block.type}</div>;
    }
  };

  if (!theme) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading preview...</div>;

  return (
    <div 
      ref={wrapperRef} 
      style={{ 
        fontFamily: theme.vars?.['--theme-font'] || 'inherit',
        backgroundColor: theme.vars?.['--theme-bg'] || '#fff',
        color: theme.vars?.['--theme-text'] || '#000',
        minHeight: '100vh',
        width: '100%'
      }}
      className="live-preview-wrapper"
    >
      {blocks.map(block => (
        <div key={block.id} style={{ position: 'relative' }}>
          {renderBlock(block)}
        </div>
      ))}
    </div>
  );
}
