import React from 'react';
import {
    BsGlobe2,
    BsLaptop,
    BsLayersHalf,
    BsPalette,
    BsBagCheck,
    BsCart3,
    BsRobot,
    BsTools,
    BsHeadset,
    BsLightningCharge,
    BsCodeSlash
} from 'react-icons/bs';

const ICONS = {
    BsGlobe2,
    BsLaptop,
    BsLayersHalf,
    BsPalette,
    BsBagCheck,
    BsCart3,
    BsRobot,
    BsTools,
    BsHeadset,
    BsLightningCharge,
    '🌐': BsGlobe2,
    '💻': BsLaptop,
    '📱': BsPalette,
    '🛍️': BsBagCheck,
    '🛒': BsCart3,
    '🤖': BsRobot,
    '🛠️': BsTools,
    '⚡': BsLightningCharge,
};

export default function ServiceIcon({ icon, title = '', size = 26, className = '' }) {
    if (React.isValidElement(icon)) return icon;

    const key = typeof icon === 'string' ? icon.trim() : '';
    let Comp = ICONS[key];

    if (!Comp && title) {
        const t = String(title).toLowerCase();
        if (t.includes('web')) Comp = BsGlobe2;
        else if (t.includes('saas') || t.includes('soft')) Comp = BsLaptop;
        else if (t.includes('design') || t.includes('ui')) Comp = BsPalette;
        else if (t.includes('commerce') || t.includes('store') || t.includes('shop')) Comp = BsBagCheck;
        else if (t.includes('ai') || t.includes('bot') || t.includes('auto')) Comp = BsRobot;
        else if (t.includes('support') || t.includes('maint')) Comp = BsTools;
    }

    const FinalIcon = Comp || BsCodeSlash;
    return <FinalIcon size={size} className={className} />;
}
