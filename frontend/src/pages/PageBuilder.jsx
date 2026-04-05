import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRealtime } from '../context/RealtimeContext';
import { useParams, useNavigate } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import {
    Type, Image as ImageIcon, Layout as LayoutIcon,
    CreditCard, Move, Trash2, Save, GripVertical, FileText, Loader2,
    Table, BarChart, Activity, Calendar, Search, Square
} from 'lucide-react';

const API_URL = 'http://localhost:3000/api/builder';

// Drag item types
const ItemTypes = {
    ELEMENT: 'element',
    BLOCK: 'block'
};

// Draggable Block Component
const DraggableBlock = ({ block, index, moveBlock, removeBlock, renderBlockContent, handleContentChange }) => {
    const ref = useRef(null);

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.BLOCK,
        item: { index, id: block.id },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: ItemTypes.BLOCK,
        hover: (item, monitor) => {
            if (!ref.current) return;

            const dragIndex = item.index;
            const hoverIndex = index;

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) return;

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current.getBoundingClientRect();

            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

            // Determine mouse position
            const clientOffset = monitor.getClientOffset();

            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;

            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

            // Time to actually perform the action
            moveBlock(dragIndex, hoverIndex);

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid excessive index lookups.
            item.index = hoverIndex;
        },
    });

    drag(drop(ref));

    return (
        <div
            ref={ref}
            className={`group relative border-2 border-transparent hover:border-indigo-100 rounded-lg hover:shadow-sm -mx-2 md:-mx-4 px-2 md:px-4 py-2 transition-all ${isDragging ? 'opacity-50' : 'opacity-100'}`}
            style={{ cursor: 'move' }}
        >
            <div className="absolute -left-1 md:-left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-indigo-600 transition-colors bg-white rounded-md shadow-sm border border-gray-100 md:p-1 hidden md:block cursor-grab">
                <GripVertical size={16} />
            </div>
            <div
                className="absolute right-0 md:-right-3 top-0 md:top-2 opacity-100 md:opacity-0 group-hover:opacity-100 cursor-pointer text-gray-400 hover:text-red-500 transition-colors p-1.5 bg-white rounded-md shadow-sm border border-gray-100"
                onClick={() => removeBlock(block.id)}
            >
                <Trash2 size={14} />
            </div>
            {renderBlockContent(block, handleContentChange)}
        </div>
    );
};

// Element item from sidebar
const DraggableElement = ({ element }) => {
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.ELEMENT,
        item: { type: ItemTypes.ELEMENT, elementType: element.type },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <div
            ref={drag}
            className={`bg-gray-50 border border-gray-200 rounded-lg p-2 md:p-3 flex flex-col items-center justify-center gap-1.5 md:gap-2 cursor-grab active:cursor-grabbing hover:border-indigo-400 hover:bg-indigo-50/50 hover:text-indigo-600 transition-all opacity-100 hover:scale-105 min-w-[80px] md:min-w-0 flex-shrink-0 ${isDragging ? 'opacity-50' : ''}`}
        >
            <element.icon size={20} className="text-gray-500 group-hover:text-indigo-500 md:w-[22px] md:h-[22px]" />
            <span className="text-[9px] md:text-[10px] font-bold text-gray-600 text-center uppercase md:normal-case">{element.label}</span>
        </div>
    );
};

// Canvas Drop Zone
const CanvasDropZone = ({ children, onDrop }) => {
    const [{ isOver }, drop] = useDrop({
        accept: [ItemTypes.ELEMENT, ItemTypes.BLOCK],
        drop: (item, monitor) => {
            if (monitor.didDrop()) return;
            onDrop(item);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver({ shallow: true }),
        }),
    });

    return (
        <div
            ref={drop}
            className={`w-full max-w-[800px] bg-white min-h-screen shadow-sm border-2 transition-colors ${isOver ? 'border-indigo-400 bg-indigo-50/20' : 'border-gray-200'} p-4 md:p-12 mb-20 md:mb-0`}
        >
            {children}
        </div>
    );
};

// Main PageBuilder Component
function PageBuilderContent() {
    const { user } = useAuth();
    const { subscribe } = useRealtime();
    const { pageId } = useParams();
    const navigate = useNavigate();

    const isClientOrAdmin = true;

    // State
    const [activePageName, setActivePageName] = useState('Select a page');
    const [canvasBlocks, setCanvasBlocks] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [autoSaveStatus, setAutoSaveStatus] = useState('');
    const [isRealtimeUpdate, setIsRealtimeUpdate] = useState(false);

    const axiosConfig = {};
    const token = null; // Token no longer used

    // --- DATA FETCH via URL Param ---
    useEffect(() => {
        if (!isClientOrAdmin) return;

        if (!pageId) {
            setCanvasBlocks([]);
            setActivePageName('');
            return;
        }

        setLoadingData(true);

        // Fetch the workspace purely to extract the page's current name for the header
        axios.get(`${API_URL}/data`, axiosConfig)
            .then(res => {
                const pages = res.data.pages || [];
                const found = pages.find(p => p.id === pageId);
                setActivePageName(found ? found.name : 'Unknown Page');
            })
            .catch(err => console.error("Error fetching page name", err));

        // Fetch the layout configuration blocks!
        axios.get(`${API_URL}/pages/${pageId}/blocks`, axiosConfig)
            .then(res => {
                setCanvasBlocks(res.data || []);
            })
            .catch(err => {
                console.error("Error fetching blocks", err);
                setCanvasBlocks([]);
            })
            .finally(() => setLoadingData(false));

    }, [pageId, token, isClientOrAdmin]);

    // --- REAL-TIME UPDATES ---
    useEffect(() => {
        if (!pageId) return;

        // Subscribe to real-time block updates
        const unsubscribe = subscribe('page_blocks_updated', (data) => {
            // Only update if the update is for the current page
            if (data.pageId === pageId) {
                setIsRealtimeUpdate(true);
                setCanvasBlocks(data.blocks || []);
                setAutoSaveStatus('Updated by collaborator');

                // Clear status after 2 seconds
                setTimeout(() => {
                    setAutoSaveStatus('');
                    setIsRealtimeUpdate(false);
                }, 2000);
            }
        });

        return () => {
            unsubscribe();
        };
    }, [pageId, subscribe]);

    // --- AUTO SAVE ---
    const autoSaveTimeoutRef = useRef(null);

    const triggerAutoSave = useCallback((blocks) => {
        if (!pageId) return;

        // Clear existing timeout
        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current);
        }

        setAutoSaveStatus('Saving...');

        // Debounce save for 1 second
        autoSaveTimeoutRef.current = setTimeout(() => {
            axios.put(`${API_URL}/pages/${pageId}/blocks`, blocks, axiosConfig)
                .then(() => {
                    setAutoSaveStatus('Saved');
                    setTimeout(() => setAutoSaveStatus(''), 2000);
                })
                .catch(() => {
                    setAutoSaveStatus('Save failed');
                    setTimeout(() => setAutoSaveStatus(''), 2000);
                });
        }, 1000);
    }, [pageId, token]);

    // --- ELEMENTS LIBRARY ---
    const elements = [
        // Typography & Structure
        { type: 'HEADING', label: 'Heading', icon: Type },
        { type: 'TEXT', label: 'Paragraph', icon: FileText },
        { type: 'IMAGE', label: 'Image Block', icon: ImageIcon },
        { type: 'DIVIDER', label: 'Divider', icon: Move },

        // Application Layouts
        { type: 'CARD', label: 'Card Block', icon: CreditCard },
        { type: 'LAYOUT', label: 'Columns', icon: LayoutIcon },

        // Zoho Creator Style Widgets
        { type: 'FORM_TEXT', label: 'Text Field', icon: Type },
        { type: 'FORM_BUTTON', label: 'Button', icon: Square },
        { type: 'DATA_TABLE', label: 'Data Grid', icon: Table },
        { type: 'METRIC_CARD', label: 'KPI Metric', icon: Activity },
        { type: 'CHART_BAR', label: 'Bar Chart', icon: BarChart },
        { type: 'CALENDAR', label: 'Calendar', icon: Calendar },
        { type: 'SEARCH', label: 'Search Bar', icon: Search }
    ];

    // --- DRAG AND DROP HANDLERS ---
    const handleCanvasDrop = useCallback((item) => {
        if (!pageId) return;

        if (item.type === ItemTypes.ELEMENT) {
            const elementType = item.elementType;
            const newBlock = {
                id: `block${Date.now()}`,
                type: elementType,
                content: `New ${elementType} block`,
                orderIndex: canvasBlocks.length
            };
            const updatedBlocks = [...canvasBlocks, newBlock];
            setCanvasBlocks(updatedBlocks);
            triggerAutoSave(updatedBlocks);
        }
    }, [pageId, canvasBlocks, triggerAutoSave]);

    const moveBlock = useCallback((dragIndex, hoverIndex) => {
        const draggedBlock = canvasBlocks[dragIndex];
        const newBlocks = [...canvasBlocks];
        newBlocks.splice(dragIndex, 1);
        newBlocks.splice(hoverIndex, 0, draggedBlock);

        // Update orderIndex
        const reorderedBlocks = newBlocks.map((block, index) => ({
            ...block,
            orderIndex: index
        }));

        setCanvasBlocks(reorderedBlocks);
        triggerAutoSave(reorderedBlocks);
    }, [canvasBlocks, triggerAutoSave]);

    const removeBlock = useCallback((blockId) => {
        const updatedBlocks = canvasBlocks.filter(b => b.id !== blockId);
        setCanvasBlocks(updatedBlocks);
        triggerAutoSave(updatedBlocks);
    }, [canvasBlocks, triggerAutoSave]);

    const handleContentChange = useCallback((blockId, newContent) => {
        const updatedBlocks = canvasBlocks.map(b =>
            b.id === blockId ? { ...b, content: newContent } : b
        );
        setCanvasBlocks(updatedBlocks);
        triggerAutoSave(updatedBlocks);
    }, [canvasBlocks, triggerAutoSave]);

    // --- MANUAL SAVE ---
    const handleSaveDraft = () => {
        if (!pageId) return;

        // Clear any pending auto-save
        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current);
        }

        setIsSaving(true);
        axios.put(`${API_URL}/pages/${pageId}/blocks`, canvasBlocks, axiosConfig)
            .then(() => {
                setAutoSaveStatus('Saved!');
                setTimeout(() => setAutoSaveStatus(''), 2000);
            })
            .catch(() => alert("Failed to save layout"))
            .finally(() => setIsSaving(false));
    };

    // --- BLOCK RENDERERS ---
    const renderBlockContent = (block, onContentChange) => {
        const handleBlur = (e) => {
            onContentChange(block.id, e.target.innerText);
        };

        switch (block.type) {
            case 'HEADING':
                return <h1 className="text-2xl md:text-3xl font-bold text-gray-800 p-2 border border-transparent hover:border-dashed hover:border-indigo-300 rounded cursor-text outline-none" contentEditable suppressContentEditableWarning onBlur={handleBlur}>{block.content}</h1>;
            case 'TEXT':
                return <p className="text-gray-600 text-sm leading-relaxed p-2 border border-transparent hover:border-dashed hover:border-indigo-300 rounded cursor-text outline-none" contentEditable suppressContentEditableWarning onBlur={handleBlur}>{block.content}</p>;
            case 'IMAGE':
                return <div className="w-full h-32 md:h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 p-4 text-center"><ImageIcon size={28} className="mb-2"/><span className="text-xs font-semibold">Image Placeholder</span></div>;
            case 'CARD':
                return (
                    <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-2">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 mb-2 shrink-0"><CreditCard size={20}/></div>
                        <h3 className="font-bold text-gray-800 outline-none" contentEditable suppressContentEditableWarning>Feature Card Title</h3>
                        <p className="text-xs text-gray-500 outline-none" contentEditable suppressContentEditableWarning>A descriptive text block inside a card component.</p>
                    </div>
                );
            case 'LAYOUT':
                return (
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 bg-gray-50 border border-gray-200 border-dashed rounded h-24 md:h-32 flex items-center justify-center text-xs text-gray-400 font-semibold cursor-text outline-none" contentEditable suppressContentEditableWarning>Column 1</div>
                        <div className="flex-1 bg-gray-50 border border-gray-200 border-dashed rounded h-24 md:h-32 flex items-center justify-center text-xs text-gray-400 font-semibold cursor-text outline-none" contentEditable suppressContentEditableWarning>Column 2</div>
                    </div>
                );
            case 'DIVIDER':
                return <hr className="border-t border-gray-200 my-4 w-full" />;

            // --- ZOHO APPLICATION WIDGETS ---
            case 'FORM_TEXT':
                return (
                    <div className="flex flex-col gap-1 w-full max-w-sm ml-2 mb-2">
                        <label className="text-xs font-semibold text-gray-700 outline-none" contentEditable suppressContentEditableWarning onBlur={handleBlur}>Email Address</label>
                        <input type="text" placeholder="User input field..." disabled className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
                    </div>
                );
            case 'FORM_BUTTON':
                return (
                    <button className="px-5 py-2.5 ml-2 mb-2 bg-indigo-600 outline-none text-white text-sm font-semibold rounded-lg shadow-sm transition-colors w-auto text-left inline-block" contentEditable suppressContentEditableWarning onBlur={handleBlur}>
                        Submit Form
                    </button>
                );
            case 'SEARCH':
                return (
                    <div className="relative w-full max-w-lg shadow-sm rounded-lg border border-gray-200 bg-white flex items-center px-4 py-2 mb-2">
                        <Search size={16} className="text-gray-400 mr-2 shrink-0" />
                        <input type="text" placeholder="Search data records globally..." disabled className="bg-transparent border-none outline-none text-sm w-full text-gray-400 cursor-not-allowed h-full" />
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
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wide outline-none" contentEditable suppressContentEditableWarning onBlur={handleBlur}>Total Revenue</p>
                            <h3 className="text-3xl font-black text-gray-800 mt-1">$45,231.00</h3>
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
                            <h4 className="text-sm font-bold text-gray-800 outline-none" contentEditable suppressContentEditableWarning onBlur={handleBlur}>Annual Projections</h4>
                            <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-1 rounded">2026 Data</span>
                        </div>
                        <div className="flex items-end justify-between gap-2 h-32 w-full pt-4 border-b border-gray-100 pb-2">
                            <div className="w-10 bg-indigo-200 rounded-t-sm h-[30%] hover:bg-indigo-300 transition-colors"></div>
                            <div className="w-10 bg-indigo-300 rounded-t-sm h-[50%] hover:bg-indigo-400 transition-colors"></div>
                            <div className="w-10 bg-indigo-400 rounded-t-sm h-[40%] hover:bg-indigo-500 transition-colors"></div>
                            <div className="w-10 bg-indigo-500 rounded-t-sm h-[80%] hover:bg-indigo-600 transition-colors"></div>
                            <div className="w-10 bg-indigo-600 rounded-t-sm h-[100%] hover:bg-indigo-700 shadow-inner"></div>
                            <div className="w-10 bg-purple-500 rounded-t-sm h-[65%] hover:bg-purple-600 transition-colors"></div>
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
                            <h4 className="text-sm font-bold text-gray-800 outline-none" contentEditable suppressContentEditableWarning onBlur={handleBlur}>Deployment Schedule</h4>
                            <Calendar size={18} className="text-indigo-400" />
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-gray-400 font-bold mb-2">
                            <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {[...Array(28)].map((_, i) => (
                                <div key={i} className={`h-8 flex items-center justify-center rounded-md text-xs font-semibold transition-colors ${i === 12 ? 'bg-indigo-600 text-white shadow-md' : i === 16 ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'text-gray-600 hover:bg-gray-100 border border-transparent cursor-pointer'}`}>
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

    // Access Denied block removed for open access

    return (
        <div className="h-[calc(100vh-70px)] md:h-[calc(100vh-100px)] -mt-2 -mx-2 md:-mx-6 flex flex-col md:flex-row overflow-hidden border-t border-gray-200 bg-white md:shadow-xl">

            {/* CENTER PANEL: Canvas */}
            <div className="flex-1 flex flex-col bg-gray-50 relative min-h-[50vh] order-2 md:order-1 border-r border-gray-200">
                <div className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4 md:px-6 shrink-0 shadow-sm z-10 w-full">
                    <div className="flex items-center gap-2 shrink-0 truncate mr-2">
                        <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:block">Editing Page:</span>
                        <span className="text-xs md:text-sm font-bold text-gray-800 truncate">
                            {pageId ? activePageName : 'Select a page in your workspace'}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        {autoSaveStatus && (
                            <span className={`text-[10px] md:text-xs font-medium ${isRealtimeUpdate ? 'text-green-600' : 'text-gray-500'}`}>
                                {autoSaveStatus}
                            </span>
                        )}
                        <button
                            onClick={handleSaveDraft}
                            disabled={!pageId || loadingData || isSaving}
                            className={`flex items-center gap-2 text-white px-3 md:px-4 py-1.5 rounded-md text-[10px] md:text-xs font-bold shadow-sm transition-colors shrink-0 ${!pageId || loadingData ? 'bg-gray-300' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                        >
                            {isSaving ? <Loader2 size={14} className="animate-spin truncate" /> : <Save size={14} className="truncate" />}
                            <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save'}</span>
                        </button>
                    </div>
                </div>

                <div
                    className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center w-full"
                >
                    <CanvasDropZone onDrop={handleCanvasDrop}>
                        {loadingData ? (
                            <div className="h-full flex items-center justify-center text-indigo-500">
                                <Loader2 size={32} className="animate-spin" />
                            </div>
                        ) : !pageId ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl p-6 md:p-12 mt-4 md:mt-10 mx-2">
                                <FileText size={40} className="mb-4 opacity-50" />
                                <h3 className="text-base md:text-lg font-bold text-gray-600 text-center">No Page Selected</h3>
                                <p className="text-xs md:text-sm text-center mt-2 max-w-sm">Open the sidebar navigation and select a page from your **WORKSPACE** tree to edit.</p>
                            </div>
                        ) : canvasBlocks.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl p-6 md:p-12 mt-4 md:mt-10 mx-2">
                                <LayoutIcon size={40} className="mb-4 opacity-50" />
                                <h3 className="text-base md:text-lg font-bold text-gray-600 text-center">This page is empty</h3>
                                <p className="text-xs md:text-sm text-center mt-2 max-w-sm">Drag and drop components from the components library to start building your layout.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {canvasBlocks.map((block, index) => (
                                    <DraggableBlock
                                        key={block.id}
                                        block={block}
                                        index={index}
                                        moveBlock={moveBlock}
                                        removeBlock={removeBlock}
                                        renderBlockContent={renderBlockContent}
                                        handleContentChange={handleContentChange}
                                    />
                                ))}
                            </div>
                        )}
                    </CanvasDropZone>
                </div>
            </div>

            {/* RIGHT / BOTTOM PANEL: Elements Library */}
            <div className="w-full md:w-72 bg-white flex flex-col shrink-0 z-20 order-1 md:order-2 border-b md:border-b-0 shadow-sm md:shadow-none">
                <div className="p-3 md:p-4 border-b border-gray-200 bg-white sticky top-0 hidden md:block">
                    <h3 className="text-sm font-bold text-gray-700">Components Library</h3>
                    <p className="text-[10px] md:text-xs text-gray-500 mt-1">Drag elements onto the canvas. Reorder blocks by dragging them.</p>
                </div>

                {/* Horizontal scroll on Mobile, Grid on Desktop */}
                <div className="p-3 md:p-4 flex flex-row md:grid md:grid-cols-2 gap-2 md:gap-3 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto content-start scrollbar-hide">
                    {elements.map((el) => (
                        <DraggableElement key={el.type} element={el} />
                    ))}
                </div>
            </div>

        </div>
    );
}

// Wrap with DndProvider
export default function PageBuilder() {
    return (
        <DndProvider backend={HTML5Backend}>
            <PageBuilderContent />
        </DndProvider>
    );
}
