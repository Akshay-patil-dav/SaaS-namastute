import React from 'react';

const TextLogo = ({ name, color = '#eab308' }) => {
    const finalName = name || 'Namustutam';
    const parts = finalName.trim().split(' ');
    
    if (parts.length === 1) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '4px', height: '32px', backgroundColor: color, borderRadius: '4px' }}></div>
                <span style={{ color: '#1a1a1a', fontWeight: '900', fontSize: '22px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {parts[0]}
                </span>
            </div>
        );
    }

    const firstWord = parts[0];
    const restWords = parts.slice(1).join(' ');

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '4px', height: '38px', backgroundColor: color, borderRadius: '4px' }}></div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                <span style={{ color: '#1a1a1a', fontWeight: '900', fontSize: '20px', textTransform: 'uppercase', lineHeight: '1', letterSpacing: '0.5px' }}>
                    {firstWord}
                </span>
                <span style={{ color: '#64748b', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', lineHeight: '1', letterSpacing: '1px', marginTop: '3px' }}>
                    {restWords}
                </span>
            </div>
        </div>
    );
};

export default TextLogo;
