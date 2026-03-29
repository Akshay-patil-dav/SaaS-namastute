import React, { useState } from 'react';
import {
    Folder, FileText, Home, Settings, User, Mail, Calendar, Star, Heart,
    Bookmark, Flag, Tag, Briefcase, Building, MapPin, Phone, Globe,
    ShoppingCart, CreditCard, DollarSign, TrendingUp, BarChart, PieChart,
    Activity, Zap, Award, Trophy, Target, Lightbulb, Book, GraduationCap,
    Coffee, Music, Image, Camera, Video, Mic, Speaker, Monitor, Smartphone,
    Laptop, Printer, Wifi, Battery, Sun, Moon, Cloud, CloudRain,
    Wind, Thermometer, Droplet, Anchor, Compass, Map, Navigation, Truck,
    Plane, Train, Car, Bike, Bus, Ship, Rocket, Crown, Diamond, Gift,
    Package, ShoppingBag, Store, Archive, Clipboard, FolderOpen, Inbox, Send,
    Paperclip, Link, Share2, Lock, Unlock, Eye, EyeOff, Search, Filter,
    Bell, BellOff, CheckCircle, XCircle, AlertCircle, Info, HelpCircle,
    AlertTriangle, Shield, ShieldCheck, Check, X, Plus, Minus, MoreHorizontal,
    MoreVertical, Grid, List, Layout, Menu, LogIn, LogOut, UserPlus, Users,
    RefreshCw, RotateCw, RotateCcw, Play, Pause, Repeat, Shuffle,
    Volume2, Volume1, VolumeX, Maximize, Minimize, Maximize2, Minimize2,
    Download, Upload, Trash2, Edit, Copy, Scissors, ExternalLink, Move,
    Layers, Hexagon, Circle, Square, Triangle, ThumbsUp, ThumbsDown,
    Smile, Frown, Meh, Umbrella, Gamepad, Dumbbell, Scale, Microscope,
    Radio, Tv, Film, Pen, Brush, Palette, Ruler, Tent, Mountain,
    Waves, Fish, Flower, Leaf, Apple, Carrot, Pizza, IceCream,
    Cookie, Utensils, ChefHat, Hospital, Ambulance, School, Library,
    Theater, Factory, Construction, HardHat, Wrench, Hammer, Bomb, Sword,
    Castle, Church, Landmark, Pin, Crosshair, Scan, QrCode, Barcode, Wallet,
    Coins, Receipt, FileCheck, FileX, FilePlus, FileMinus, FileQuestion,
    FileWarning, FileCode, FileJson, FileType, FileSpreadsheet, FileImage,
    FileVideo, FileAudio, FileArchive, FileSearch, FileLock, FileClock,
    FileHeart, FileCog
} from 'lucide-react';

const ICONS_LIST = [
    { name: 'Folder', icon: Folder },
    { name: 'FileText', icon: FileText },
    { name: 'Home', icon: Home },
    { name: 'Settings', icon: Settings },
    { name: 'User', icon: User },
    { name: 'Mail', icon: Mail },
    { name: 'Calendar', icon: Calendar },
    { name: 'Star', icon: Star },
    { name: 'Heart', icon: Heart },
    { name: 'Bookmark', icon: Bookmark },
    { name: 'Flag', icon: Flag },
    { name: 'Tag', icon: Tag },
    { name: 'Briefcase', icon: Briefcase },
    { name: 'Building', icon: Building },
    { name: 'MapPin', icon: MapPin },
    { name: 'Phone', icon: Phone },
    { name: 'Globe', icon: Globe },
    { name: 'ShoppingCart', icon: ShoppingCart },
    { name: 'CreditCard', icon: CreditCard },
    { name: 'DollarSign', icon: DollarSign },
    { name: 'TrendingUp', icon: TrendingUp },
    { name: 'BarChart', icon: BarChart },
    { name: 'PieChart', icon: PieChart },
    { name: 'Activity', icon: Activity },
    { name: 'Zap', icon: Zap },
    { name: 'Award', icon: Award },
    { name: 'Trophy', icon: Trophy },
    { name: 'Target', icon: Target },
    { name: 'Lightbulb', icon: Lightbulb },
    { name: 'Book', icon: Book },
    { name: 'GraduationCap', icon: GraduationCap },
    { name: 'Coffee', icon: Coffee },
    { name: 'Music', icon: Music },
    { name: 'Image', icon: Image },
    { name: 'Camera', icon: Camera },
    { name: 'Video', icon: Video },
    { name: 'Mic', icon: Mic },
    { name: 'Speaker', icon: Speaker },
    { name: 'Monitor', icon: Monitor },
    { name: 'Smartphone', icon: Smartphone },
    { name: 'Laptop', icon: Laptop },
    { name: 'Printer', icon: Printer },
    { name: 'Wifi', icon: Wifi },
    { name: 'Battery', icon: Battery },
    { name: 'Sun', icon: Sun },
    { name: 'Moon', icon: Moon },
    { name: 'Cloud', icon: Cloud },
    { name: 'CloudRain', icon: CloudRain },
    { name: 'Wind', icon: Wind },
    { name: 'Thermometer', icon: Thermometer },
    { name: 'Droplet', icon: Droplet },
    { name: 'Anchor', icon: Anchor },
    { name: 'Compass', icon: Compass },
    { name: 'Map', icon: Map },
    { name: 'Navigation', icon: Navigation },
    { name: 'Truck', icon: Truck },
    { name: 'Plane', icon: Plane },
    { name: 'Train', icon: Train },
    { name: 'Car', icon: Car },
    { name: 'Bike', icon: Bike },
    { name: 'Bus', icon: Bus },
    { name: 'Ship', icon: Ship },
    { name: 'Rocket', icon: Rocket },
    { name: 'Crown', icon: Crown },
    { name: 'Diamond', icon: Diamond },
    { name: 'Gift', icon: Gift },
    { name: 'Package', icon: Package },
    { name: 'ShoppingBag', icon: ShoppingBag },
    { name: 'Store', icon: Store },
    { name: 'Archive', icon: Archive },
    { name: 'Clipboard', icon: Clipboard },
    { name: 'FolderOpen', icon: FolderOpen },
    { name: 'Inbox', icon: Inbox },
    { name: 'Send', icon: Send },
    { name: 'Paperclip', icon: Paperclip },
    { name: 'Link', icon: Link },
    { name: 'Share2', icon: Share2 },
    { name: 'Lock', icon: Lock },
    { name: 'Unlock', icon: Unlock },
    { name: 'Eye', icon: Eye },
    { name: 'EyeOff', icon: EyeOff },
    { name: 'Search', icon: Search },
    { name: 'Filter', icon: Filter },
    { name: 'Bell', icon: Bell },
    { name: 'BellOff', icon: BellOff },
    { name: 'CheckCircle', icon: CheckCircle },
    { name: 'XCircle', icon: XCircle },
    { name: 'AlertCircle', icon: AlertCircle },
    { name: 'Info', icon: Info },
    { name: 'HelpCircle', icon: HelpCircle },
    { name: 'AlertTriangle', icon: AlertTriangle },
    { name: 'Shield', icon: Shield },
    { name: 'ShieldCheck', icon: ShieldCheck },
    { name: 'Check', icon: Check },
    { name: 'X', icon: X },
    { name: 'Plus', icon: Plus },
    { name: 'Minus', icon: Minus },
    { name: 'MoreHorizontal', icon: MoreHorizontal },
    { name: 'MoreVertical', icon: MoreVertical },
    { name: 'Grid', icon: Grid },
    { name: 'List', icon: List },
    { name: 'Layout', icon: Layout },
    { name: 'Menu', icon: Menu },
    { name: 'LogIn', icon: LogIn },
    { name: 'LogOut', icon: LogOut },
    { name: 'UserPlus', icon: UserPlus },
    { name: 'Users', icon: Users },
    { name: 'RefreshCw', icon: RefreshCw },
    { name: 'RotateCw', icon: RotateCw },
    { name: 'RotateCcw', icon: RotateCcw },
    { name: 'Play', icon: Play },
    { name: 'Pause', icon: Pause },
    { name: 'Repeat', icon: Repeat },
    { name: 'Shuffle', icon: Shuffle },
    { name: 'Volume2', icon: Volume2 },
    { name: 'Volume1', icon: Volume1 },
    { name: 'VolumeX', icon: VolumeX },
    { name: 'Maximize', icon: Maximize },
    { name: 'Minimize', icon: Minimize },
    { name: 'Maximize2', icon: Maximize2 },
    { name: 'Minimize2', icon: Minimize2 },
    { name: 'Download', icon: Download },
    { name: 'Upload', icon: Upload },
    { name: 'Trash2', icon: Trash2 },
    { name: 'Edit', icon: Edit },
    { name: 'Copy', icon: Copy },
    { name: 'Scissors', icon: Scissors },
    { name: 'ExternalLink', icon: ExternalLink },
    { name: 'Move', icon: Move },
    { name: 'Layers', icon: Layers },
    { name: 'Hexagon', icon: Hexagon },
    { name: 'Circle', icon: Circle },
    { name: 'Square', icon: Square },
    { name: 'Triangle', icon: Triangle },
    { name: 'ThumbsUp', icon: ThumbsUp },
    { name: 'ThumbsDown', icon: ThumbsDown },
    { name: 'Smile', icon: Smile },
    { name: 'Frown', icon: Frown },
    { name: 'Meh', icon: Meh },
    { name: 'Umbrella', icon: Umbrella },
    { name: 'Gamepad', icon: Gamepad },
    { name: 'Dumbbell', icon: Dumbbell },
    { name: 'Scale', icon: Scale },
    { name: 'Microscope', icon: Microscope },
    { name: 'Radio', icon: Radio },
    { name: 'Tv', icon: Tv },
    { name: 'Film', icon: Film },
    { name: 'Pen', icon: Pen },
    { name: 'Brush', icon: Brush },
    { name: 'Palette', icon: Palette },
    { name: 'Ruler', icon: Ruler },
    { name: 'Tent', icon: Tent },
    { name: 'Mountain', icon: Mountain },
    { name: 'Waves', icon: Waves },
    { name: 'Fish', icon: Fish },
    { name: 'Flower', icon: Flower },
    { name: 'Leaf', icon: Leaf },
    { name: 'Apple', icon: Apple },
    { name: 'Carrot', icon: Carrot },
    { name: 'Pizza', icon: Pizza },
    { name: 'IceCream', icon: IceCream },
    { name: 'Cookie', icon: Cookie },
    { name: 'Utensils', icon: Utensils },
    { name: 'ChefHat', icon: ChefHat },
    { name: 'Hospital', icon: Hospital },
    { name: 'Ambulance', icon: Ambulance },
    { name: 'School', icon: School },
    { name: 'Library', icon: Library },
    { name: 'Theater', icon: Theater },
    { name: 'Factory', icon: Factory },
    { name: 'Construction', icon: Construction },
    { name: 'HardHat', icon: HardHat },
    { name: 'Wrench', icon: Wrench },
    { name: 'Hammer', icon: Hammer },
    { name: 'Bomb', icon: Bomb },
    { name: 'Sword', icon: Sword },
    { name: 'Castle', icon: Castle },
    { name: 'Church', icon: Church },
    { name: 'Landmark', icon: Landmark },
    { name: 'Pin', icon: Pin },
    { name: 'Crosshair', icon: Crosshair },
    { name: 'Scan', icon: Scan },
    { name: 'QrCode', icon: QrCode },
    { name: 'Barcode', icon: Barcode },
    { name: 'Wallet', icon: Wallet },
    { name: 'Coins', icon: Coins },
    { name: 'Receipt', icon: Receipt },
    { name: 'FileCheck', icon: FileCheck },
    { name: 'FileX', icon: FileX },
    { name: 'FilePlus', icon: FilePlus },
    { name: 'FileMinus', icon: FileMinus },
    { name: 'FileQuestion', icon: FileQuestion },
    { name: 'FileWarning', icon: FileWarning },
    { name: 'FileCode', icon: FileCode },
    { name: 'FileJson', icon: FileJson },
    { name: 'FileType', icon: FileType },
    { name: 'FileSpreadsheet', icon: FileSpreadsheet },
    { name: 'FileImage', icon: FileImage },
    { name: 'FileVideo', icon: FileVideo },
    { name: 'FileAudio', icon: FileAudio },
    { name: 'FileArchive', icon: FileArchive },
    { name: 'FileSearch', icon: FileSearch },
    { name: 'FileLock', icon: FileLock },
    { name: 'FileClock', icon: FileClock },
    { name: 'FileHeart', icon: FileHeart },
    { name: 'FileCog', icon: FileCog }
];

export const ICONS_MAP = ICONS_LIST.reduce((acc, item) => {
    acc[item.name] = item.icon;
    return acc;
}, {});

export function getIconByName(name) {
    return ICONS_MAP[name] || FileText;
}

export default function IconPicker({ onSelect, onClose, selectedIcon }) {
    const [search, setSearch] = useState('');

    const filteredIcons = ICONS_LIST.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
                <div className="p-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Choose Icon</h3>
                    <input
                        type="text"
                        placeholder="Search icons..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="flex-1 overflow-y-auto p-4 grid grid-cols-6 gap-2">
                    {filteredIcons.map((item) => {
                        const IconComponent = item.icon;
                        const isSelected = selectedIcon === item.name;
                        return (
                            <button
                                key={item.name}
                                onClick={() => {
                                    onSelect(item.name);
                                    onClose();
                                }}
                                className={`p-2 rounded-lg flex flex-col items-center gap-1 transition-all ${
                                    isSelected
                                        ? 'bg-indigo-100 text-indigo-600 ring-2 ring-indigo-500'
                                        : 'hover:bg-gray-100 text-gray-600'
                                }`}
                                title={item.name}
                            >
                                <IconComponent size={20} />
                                <span className="text-[9px] truncate w-full text-center">{item.name}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
