import React, { useState, useRef } from 'react';
import './WebsiteThemeEditor.css';
import {
    Home, Folder, LayoutTemplate, Users, FileEdit, Globe, BarChart2,
    CreditCard, ShoppingBag, Sparkles, Settings, Bell, HelpCircle,
    Search, Type, Image as ImageIcon, MousePointerClick, Square, Play,
    Box, Columns, LayoutGrid, CreditCard as CardIcon, FormInput, FileBox,
    ChevronDown, ChevronRight, Undo2, Redo2, Monitor, Tablet, Smartphone,
    Eye, Share2, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
    AlignJustify, Lock, UploadCloud, Plus, X, GripHorizontal, Search as SearchIcon,
    Layers, LayoutPanelLeft, Database, Paintbrush, PlayCircle, Code2,
    MapPin, Star, ShoppingCart, QrCode, Timer, BarChart, MessageSquare, Mail
} from 'lucide-react';

export default function WebsiteThemeEditor() {
    const [activeTab, setActiveTab] = useState('Design');
    const [bottomTab, setBottomTab] = useState('HTML');
    
    // Canvas State Management
    const [elements, setElements] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const canvasRef = useRef(null);

    // Sidebar Elements definition
    const sidebarElements = [
        { category: 'Basic Elements' },
        { type: 'text', icon: Type, label: 'Text' },
        { type: 'heading', icon: Type, label: 'Heading', bold: true },
        { type: 'image', icon: ImageIcon, label: 'Image' },
        { type: 'button', icon: MousePointerClick, label: 'Button' },
        { type: 'video', icon: Play, label: 'Video' },
        { type: 'container', icon: Box, label: 'Container' },
        { category: 'Business Tools' },
        { type: 'form', icon: FormInput, label: 'Lead Form' },
        { type: 'pricing', icon: CreditCard, label: 'Pricing' },
        { type: 'product', icon: ShoppingCart, label: 'Product' },
        { type: 'review', icon: Star, label: 'Reviews' },
        { type: 'qrcode', icon: QrCode, label: 'QR Code' },
        { type: 'timer', icon: Timer, label: 'Countdown' },
        { type: 'chart', icon: BarChart, label: 'Chart' },
        { type: 'map', icon: MapPin, label: 'Map' },
    ];

    // Drag from Sidebar
    const handleDragStart = (e, type) => {
        e.dataTransfer.setData('elementType', type);
    };

    // Drop on Canvas
    const handleDrop = (e) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('elementType');
        if (!type) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        let width = 200;
        let height = 50;
        let content = '';
        let backgroundColor = 'transparent';
        let borderRadius = 0;
        let color = '#0f172a';
        let boxShadow = 'none';
        
        if (type === 'container') { width = 300; height = 200; backgroundColor = '#f8fafc'; }
        if (type === 'button') { width = 120; height = 40; content = 'Click Me'; backgroundColor = '#6366f1'; borderRadius = 6; color = '#ffffff'; }
        if (type === 'text') { content = 'Double click to edit text'; }
        if (type === 'heading') { content = 'Heading'; }
        
        // Business Tools defaults
        if (type === 'form') { width = 320; height = 280; backgroundColor = '#ffffff'; borderRadius = 8; boxShadow = '0 10px 25px rgba(0,0,0,0.1)'; }
        if (type === 'pricing') { width = 280; height = 380; backgroundColor = '#ffffff'; borderRadius = 8; boxShadow = '0 10px 25px rgba(0,0,0,0.1)'; }
        if (type === 'product') { width = 240; height = 320; backgroundColor = '#ffffff'; borderRadius = 8; boxShadow = '0 10px 25px rgba(0,0,0,0.1)'; }
        if (type === 'review') { width = 300; height = 160; backgroundColor = '#ffffff'; borderRadius = 8; boxShadow = '0 4px 12px rgba(0,0,0,0.05)'; }
        if (type === 'qrcode') { width = 160; height = 160; backgroundColor = '#ffffff'; borderRadius = 8; boxShadow = '0 4px 12px rgba(0,0,0,0.05)'; }
        if (type === 'timer') { width = 300; height = 100; backgroundColor = '#ffffff'; borderRadius = 8; boxShadow = '0 4px 12px rgba(0,0,0,0.05)'; }
        if (type === 'chart') { width = 350; height = 220; backgroundColor = '#ffffff'; borderRadius = 8; boxShadow = '0 4px 12px rgba(0,0,0,0.05)'; }
        if (type === 'map') { width = 400; height = 250; backgroundColor = '#e2e8f0'; borderRadius = 8; }

        const newElement = {
            id: Date.now().toString(),
            type,
            x,
            y,
            width,
            height,
            content,
            fontSize: type === 'heading' ? 32 : 16,
            fontWeight: type === 'heading' ? 'bold' : 'normal',
            color,
            backgroundColor,
            borderRadius,
            textAlign: 'left',
            boxShadow
        };

        setElements([...elements, newElement]);
        setSelectedId(newElement.id);
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Allow drop
    };

    // Move elements on canvas
    const handleElementDragStart = (e, id) => {
        e.stopPropagation();
        setSelectedId(id);
        const element = elements.find(el => el.id === id);
        e.dataTransfer.setData('draggedElementId', id);
        e.dataTransfer.setData('offsetX', e.clientX - element.x);
        e.dataTransfer.setData('offsetY', e.clientY - element.y);
    };

    const handleCanvasDrop = (e) => {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData('draggedElementId');
        if (draggedId) {
            const offsetX = parseFloat(e.dataTransfer.getData('offsetX'));
            const offsetY = parseFloat(e.dataTransfer.getData('offsetY'));
            
            const newX = e.clientX - offsetX;
            const newY = e.clientY - offsetY;

            setElements(elements.map(el => 
                el.id === draggedId ? { ...el, x: newX, y: newY } : el
            ));
        } else {
            handleDrop(e);
        }
    };

    // Update Property
    const updateSelectedElement = (property, value) => {
        setElements(elements.map(el => 
            el.id === selectedId ? { ...el, [property]: value } : el
        ));
    };

    const selectedElement = elements.find(el => el.id === selectedId);

    // Handle clicking empty canvas to deselect
    const handleCanvasClick = (e) => {
        if(e.target === canvasRef.current || e.target.classList.contains('interactive-canvas')) {
            setSelectedId(null);
        }
    };
    
    // Keydown for delete
    const handleKeyDown = (e) => {
        if (e.key === 'Backspace' || e.key === 'Delete') {
            // Prevent deletion if typing in an input
            if(e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            if (selectedId) {
                setElements(elements.filter(el => el.id !== selectedId));
                setSelectedId(null);
            }
        }
    };

    const renderElementContent = (el) => {
        if (el.type === 'text' || el.type === 'heading' || el.type === 'button') {
            return el.content;
        }
        if (el.type === 'image') return <div style={{width:'100%', height:'100%', background:'#e2e8f0', display:'flex', alignItems:'center', justifyContent:'center'}}><ImageIcon size={32} color="#94a3b8"/></div>;
        if (el.type === 'video') return <div style={{width:'100%', height:'100%', background:'#e2e8f0', display:'flex', alignItems:'center', justifyContent:'center'}}><PlayCircle size={32} color="#94a3b8"/></div>;
        if (el.type === 'map') return <div style={{width:'100%', height:'100%', background:'#cbd5e1', display:'flex', flexDirection: 'column', alignItems:'center', justifyContent:'center', color: '#64748b'}}><MapPin size={32} className="mb-2"/><span style={{fontSize: 12}}>Interactive Map</span></div>;
        
        if (el.type === 'qrcode') {
            return (
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', padding: '16px'}}>
                    <div style={{width: '100%', height: '100%', border: '8px solid #000', background: `repeating-linear-gradient(45deg, #000, #000 10px, #fff 10px, #fff 20px)`, opacity: 0.8}}></div>
                    <span style={{fontSize: 10, marginTop: 8, color: '#64748b'}}>Scan to Visit</span>
                </div>
            );
        }

        if (el.type === 'form') {
            return (
                <div style={{width: '100%', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px'}}>
                    <h3 style={{margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600}}>Contact Us</h3>
                    <div style={{width: '100%', height: '36px', background: '#f1f5f9', borderRadius: '4px', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', padding: '0 12px', color: '#94a3b8', fontSize: '13px'}}>Name</div>
                    <div style={{width: '100%', height: '36px', background: '#f1f5f9', borderRadius: '4px', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', padding: '0 12px', color: '#94a3b8', fontSize: '13px'}}>Email Address</div>
                    <div style={{width: '100%', height: '40px', background: '#6366f1', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: 500, marginTop: '8px'}}>Submit</div>
                </div>
            );
        }

        if (el.type === 'pricing') {
            return (
                <div style={{width: '100%', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <h3 style={{margin: '0 0 8px 0', fontSize: '20px', fontWeight: 600}}>Pro Plan</h3>
                    <div style={{fontSize: '32px', fontWeight: 800, color: '#6366f1', margin: '8px 0 20px'}}>$49<span style={{fontSize: 14, color: '#64748b', fontWeight: 400}}>/mo</span></div>
                    <ul style={{listStyle: 'none', padding: 0, margin: '0 0 24px 0', width: '100%', fontSize: '13px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '12px'}}>
                        <li style={{display: 'flex', alignItems: 'center', gap: '8px'}}><div style={{width: 6, height: 6, borderRadius: '50%', background: '#10b981'}}></div> Unlimited Projects</li>
                        <li style={{display: 'flex', alignItems: 'center', gap: '8px'}}><div style={{width: 6, height: 6, borderRadius: '50%', background: '#10b981'}}></div> Custom Domain</li>
                        <li style={{display: 'flex', alignItems: 'center', gap: '8px'}}><div style={{width: 6, height: 6, borderRadius: '50%', background: '#10b981'}}></div> 24/7 Support</li>
                        <li style={{display: 'flex', alignItems: 'center', gap: '8px'}}><div style={{width: 6, height: 6, borderRadius: '50%', background: '#10b981'}}></div> Advanced Analytics</li>
                    </ul>
                    <div style={{width: '100%', height: '40px', background: '#0f172a', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: 500}}>Choose Plan</div>
                </div>
            );
        }

        if (el.type === 'product') {
            return (
                <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
                    <div style={{width: '100%', height: '160px', background: '#f1f5f9', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><ShoppingCart size={32} color="#cbd5e1"/></div>
                    <div style={{padding: '16px', flex: 1, display: 'flex', flexDirection: 'column'}}>
                        <h4 style={{margin: '0 0 4px', fontSize: '15px', fontWeight: 600}}>Premium Headphones</h4>
                        <div style={{fontSize: '13px', color: '#64748b', marginBottom: '12px'}}>Noise cancelling over-ear</div>
                        <div style={{fontSize: '18px', fontWeight: 700, marginTop: 'auto', marginBottom: '12px'}}>$299.00</div>
                        <div style={{width: '100%', height: '36px', background: '#6366f1', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: 500}}>Add to Cart</div>
                    </div>
                </div>
            );
        }

        if (el.type === 'review') {
            return (
                <div style={{width: '100%', padding: '20px', display: 'flex', flexDirection: 'column'}}>
                    <div style={{display: 'flex', gap: '4px', marginBottom: '12px', color: '#f59e0b'}}>
                        <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
                    </div>
                    <p style={{margin: '0 0 16px', fontSize: '14px', color: '#334155', fontStyle: 'italic', lineHeight: 1.5}}>"This product completely transformed how we do business. Highly recommended!"</p>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                        <div style={{width: 32, height: 32, borderRadius: '50%', background: '#cbd5e1'}}></div>
                        <div>
                            <div style={{fontSize: '13px', fontWeight: 600}}>Sarah Jenkins</div>
                            <div style={{fontSize: '11px', color: '#64748b'}}>CEO, TechStart</div>
                        </div>
                    </div>
                </div>
            );
        }

        if (el.type === 'timer') {
            return (
                <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px'}}>
                    <div style={{fontSize: '12px', fontWeight: 600, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px'}}>Offer Ends In</div>
                    <div style={{display: 'flex', gap: '12px', textAlign: 'center'}}>
                        <div><div style={{fontSize: '28px', fontWeight: 700, background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', color: '#0f172a'}}>12</div><div style={{fontSize: '10px', color: '#64748b', marginTop: '4px'}}>HOURS</div></div>
                        <div style={{fontSize: '24px', fontWeight: 700, color: '#cbd5e1'}}>:</div>
                        <div><div style={{fontSize: '28px', fontWeight: 700, background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', color: '#0f172a'}}>45</div><div style={{fontSize: '10px', color: '#64748b', marginTop: '4px'}}>MINS</div></div>
                        <div style={{fontSize: '24px', fontWeight: 700, color: '#cbd5e1'}}>:</div>
                        <div><div style={{fontSize: '28px', fontWeight: 700, background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', color: '#ef4444'}}>30</div><div style={{fontSize: '10px', color: '#64748b', marginTop: '4px'}}>SECS</div></div>
                    </div>
                </div>
            );
        }

        if (el.type === 'chart') {
            return (
                <div style={{width: '100%', height: '100%', padding: '20px', display: 'flex', flexDirection: 'column'}}>
                    <h4 style={{margin: '0 0 16px', fontSize: '14px', fontWeight: 600, color: '#334155'}}>Monthly Revenue Growth</h4>
                    <div style={{flex: 1, display: 'flex', alignItems: 'flex-end', gap: '12px', height: '100%', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px'}}>
                        <div style={{width: '100%', height: '40%', background: '#c7d2fe', borderRadius: '4px 4px 0 0'}}></div>
                        <div style={{width: '100%', height: '60%', background: '#a5b4fc', borderRadius: '4px 4px 0 0'}}></div>
                        <div style={{width: '100%', height: '30%', background: '#c7d2fe', borderRadius: '4px 4px 0 0'}}></div>
                        <div style={{width: '100%', height: '80%', background: '#818cf8', borderRadius: '4px 4px 0 0'}}></div>
                        <div style={{width: '100%', height: '100%', background: '#6366f1', borderRadius: '4px 4px 0 0'}}></div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '10px', color: '#94a3b8'}}>
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span>
                    </div>
                </div>
            );
        }

        return '';
    };

    return (
        <div className="wte-container" onKeyDown={handleKeyDown} tabIndex={0}>
            {/* --- LEFT SIDEBAR 1: MAIN DASHBOARD MENU --- */}
            <div className="wte-sidebar-main">
                <div className="wte-brand">
                    <div className="wte-brand-logo">
                        <div className="wte-brand-logo-icon"></div>
                    </div>
                    <span>WebBuilder</span>
                </div>
                
                <div className="wte-menu-scroll">
                    <div className="wte-menu-item active"><Home size={16} /> <span>Dashboard</span></div>
                    <div className="wte-menu-item"><Folder size={16} /> <span>Projects</span></div>
                    <div className="wte-menu-item"><LayoutTemplate size={16} /> <span>Templates</span></div>
                    <div className="wte-menu-item"><Users size={16} /> <span>Team Projects</span></div>
                    <div className="wte-menu-item"><FileEdit size={16} /> <span>Drafts</span></div>
                    <div className="wte-menu-item"><Globe size={16} /> <span>Published Sites</span></div>
                    <div className="wte-menu-item"><BarChart2 size={16} /> <span>Analytics</span></div>
                    <div className="wte-menu-item"><Sparkles size={16} /> <span>AI Tools</span><span className="wte-badge">New</span></div>
                    <div className="wte-menu-item"><Settings size={16} /> <span>Settings</span></div>
                </div>

                <div className="wte-user-profile">
                    <div className="wte-avatar">JD</div>
                    <div className="wte-user-info">
                        <div className="wte-user-name">John Doe</div>
                        <div className="wte-user-email">john@example.com</div>
                    </div>
                    <ChevronRight size={14} className="wte-user-arrow" />
                </div>
            </div>

            {/* --- LEFT SIDEBAR 2: BUILDER MENUS --- */}
            <div className="wte-sidebar-builder">
                <div className="wte-search-bar">
                    <SearchIcon size={14} className="wte-search-icon" />
                    <input type="text" placeholder="Search elements..." />
                </div>
                
                <div className="wte-builder-section" style={{ flex: 1, overflowY: 'auto' }}>
                    <div className="wte-section-title">
                        ELEMENTS <ChevronDown size={12} />
                    </div>
                    <div className="wte-elements-grid">
                        {sidebarElements.map((el, i) => {
                            if (el.category) {
                                return <div key={i} style={{gridColumn: '1 / -1', fontSize: '10px', fontWeight: 'bold', color: '#6b7280', marginTop: '12px', paddingBottom: '4px', borderBottom: '1px solid #2d2e3b'}}>{el.category.toUpperCase()}</div>;
                            }
                            return (
                                <div 
                                    key={i} 
                                    className="wte-element-card"
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, el.type)}
                                >
                                    <el.icon size={18} style={{ fontWeight: el.bold ? 'bold' : 'normal', color: el.category === 'Business Tools' ? '#a855f7' : 'inherit' }} />
                                    <span>{el.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* --- MAIN AREA --- */}
            <div className="wte-main-area">
                
                {/* TOP TOOLBAR */}
                <div className="wte-topbar">
                    <div className="wte-topbar-left">
                        <div className="wte-dropdown">
                            My Awesome Website <ChevronDown size={12} />
                        </div>
                        <div className="wte-divider"></div>
                        <Undo2 size={16} className="wte-icon-btn" />
                        <Redo2 size={16} className="wte-icon-btn" />
                        <div className="wte-icon-btn"><FileBox size={14} className="mr-1"/> Save</div>
                    </div>
                    
                    <div className="wte-topbar-center">
                        <Monitor size={16} className="wte-icon-btn active" />
                        <Tablet size={16} className="wte-icon-btn" />
                        <Smartphone size={16} className="wte-icon-btn" />
                        <div className="wte-divider"></div>
                        <span className="wte-zoom">100% <ChevronDown size={12} /></span>
                    </div>

                    <div className="wte-topbar-right">
                        <button className="wte-btn-preview"><Eye size={14} /> Preview</button>
                        <button className="wte-btn-publish">Publish <ChevronDown size={12} /></button>
                        <div className="wte-divider"></div>
                        <button className="wte-btn-share"><Share2 size={14} /> Share</button>
                    </div>
                </div>

                {/* CANVAS */}
                <div className="wte-canvas-area" onClick={handleCanvasClick}>
                    <div 
                        className="wte-canvas-wrapper interactive-canvas"
                        ref={canvasRef}
                        onDragOver={handleDragOver}
                        onDrop={handleCanvasDrop}
                        style={{ position: 'relative', width: 800, height: 1000, background: '#f8fafc', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', overflow: 'hidden' }}
                    >
                        {elements.length === 0 && (
                            <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#cbd5e1', textAlign: 'center', pointerEvents: 'none'}}>
                                <Layers size={48} style={{margin: '0 auto 16px', opacity: 0.5}} />
                                <h2>Drag elements here</h2>
                                <p>Start building your design</p>
                            </div>
                        )}

                        {elements.map((el) => {
                            const isSelected = selectedId === el.id;
                            return (
                                <div
                                    key={el.id}
                                    draggable
                                    onDragStart={(e) => handleElementDragStart(e, el.id)}
                                    onClick={(e) => { e.stopPropagation(); setSelectedId(el.id); }}
                                    style={{
                                        position: 'absolute',
                                        left: el.x,
                                        top: el.y,
                                        width: el.width,
                                        height: el.height,
                                        fontSize: el.fontSize,
                                        fontWeight: el.fontWeight,
                                        color: el.color,
                                        backgroundColor: el.backgroundColor,
                                        borderRadius: el.borderRadius,
                                        textAlign: el.textAlign,
                                        boxShadow: el.boxShadow,
                                        border: isSelected ? '2px solid #6366f1' : (el.type === 'container' ? '1px dashed #cbd5e1' : 'none'),
                                        cursor: 'move',
                                        display: 'flex',
                                        alignItems: (el.type === 'form' || el.type === 'pricing' || el.type === 'product' || el.type === 'chart' || el.type === 'qrcode' || el.type === 'timer' || el.type === 'review') ? 'flex-start' : 'center',
                                        justifyContent: el.textAlign === 'center' ? 'center' : 'flex-start',
                                        padding: (el.type === 'button' || el.type === 'container') ? '0 16px' : '0',
                                        boxSizing: 'border-box',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {isSelected && (
                                        <div className="wte-selection-toolbar" style={{ top: -36, left: '50%', transform: 'translateX(-50%)' }}>
                                            <GripHorizontal size={12}/>
                                            <FileEdit size={12}/>
                                            <X size={12} style={{color: '#ef4444'}} onClick={() => setElements(elements.filter(e => e.id !== el.id))}/>
                                        </div>
                                    )}
                                    {renderElementContent(el)}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* --- RIGHT SIDEBAR: PROPERTIES --- */}
            <div className="wte-sidebar-right">
                <div className="wte-tabs">
                    <div className={`wte-tab ${activeTab === 'Design' ? 'active' : ''}`} onClick={() => setActiveTab('Design')}>Design</div>
                    <div className={`wte-tab ${activeTab === 'Advanced' ? 'active' : ''}`} onClick={() => setActiveTab('Advanced')}>Advanced</div>
                </div>

                {selectedElement ? (
                    <>
                        {['text', 'heading', 'button'].includes(selectedElement.type) && (
                            <div className="wte-prop-section">
                                <div className="wte-prop-title">Text Content <ChevronDown size={14} className="ml-auto" /></div>
                                <div className="wte-prop-row">
                                    <textarea 
                                        style={{width: '100%', background: '#111218', border: '1px solid #374151', color: '#fff', padding: '8px', borderRadius: '4px', minHeight: '60px'}}
                                        value={selectedElement.content || ''}
                                        onChange={(e) => updateSelectedElement('content', e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                        
                        <div className="wte-prop-section">
                            <div className="wte-prop-title">Styling <ChevronDown size={14} className="ml-auto" /></div>
                            
                            {['text', 'heading'].includes(selectedElement.type) && (
                                <div className="wte-prop-row">
                                    <label>Size</label>
                                    <div className="wte-input-group">
                                        <input 
                                            type="number" 
                                            value={selectedElement.fontSize || 16} 
                                            onChange={(e) => updateSelectedElement('fontSize', parseInt(e.target.value))}
                                        />
                                        <span className="wte-unit">px</span>
                                    </div>
                                </div>
                            )}

                            <div className="wte-prop-row">
                                <label>Color</label>
                                <div className="wte-color-picker">
                                    <input 
                                        type="color" 
                                        value={selectedElement.color || '#000000'}
                                        onChange={(e) => updateSelectedElement('color', e.target.value)}
                                        style={{width: '24px', height: '24px', padding: 0, border: 'none', background: 'transparent'}}
                                    />
                                </div>
                            </div>
                            <div className="wte-prop-row">
                                <label>Background</label>
                                <div className="wte-color-picker">
                                    <input 
                                        type="color" 
                                        value={selectedElement.backgroundColor !== 'transparent' ? selectedElement.backgroundColor : '#ffffff'}
                                        onChange={(e) => updateSelectedElement('backgroundColor', e.target.value)}
                                        style={{width: '24px', height: '24px', padding: 0, border: 'none', background: 'transparent'}}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="wte-prop-section">
                            <div className="wte-prop-title">Dimensions <ChevronDown size={14} className="ml-auto" /></div>
                            <div className="wte-prop-row mt-4">
                                <label>Width</label>
                                <div className="wte-input-group flex-1">
                                    <input type="number" value={selectedElement.width || 0} onChange={(e) => updateSelectedElement('width', parseInt(e.target.value))} />
                                    <span className="wte-unit">px</span>
                                </div>
                            </div>
                            <div className="wte-prop-row">
                                <label>Height</label>
                                <div className="wte-input-group flex-1">
                                    <input type="number" value={selectedElement.height || 0} onChange={(e) => updateSelectedElement('height', parseInt(e.target.value))} />
                                    <span className="wte-unit">px</span>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div style={{padding: '20px', textAlign: 'center', color: '#6b7280', marginTop: '40px'}}>
                        <MousePointerClick size={32} style={{margin: '0 auto 16px', opacity: 0.5}} />
                        <p>Select an element on the canvas to view and edit its properties.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
