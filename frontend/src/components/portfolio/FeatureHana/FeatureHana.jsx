const features = [
    {
        title: 'Design & Collaborate',
        description: 'Familiar design tools to help you create faster.',
        icon: '✏️',
        color: '#EC4899',
    },
    {
        title: 'Vector Networks',
        description: 'Create custom shapes with a powerful vector network system.',
        icon: '🔗',
        color: '#6366F1',
    },
    {
        title: 'Visual Effects',
        description: 'Enhance your designs with shadows, blurs, glass and 3D projections.',
        icon: '✨',
        color: '#F59E0B',
    },
    {
        title: 'Interactivity & Motion',
        description: 'Design interactive and animated experiences with states and events.',
        icon: '🎬',
        color: '#06B6D4',
    },
];

const FeatureHana = () => {
    return (
        <section className="feature-section feature-section--alt" id="feature-hana">
            <div className="container">
                <div className="feature-section__header fade-in" style={{ textAlign: 'center' }}>
                    <div className="section-label">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <line x1="9" y1="3" x2="9" y2="21" />
                        </svg>
                        Hana
                    </div>
                    <h2 className="section-title">
                        Hana — a canvas for<br />
                        <span className="section-title-gradient">interactive design</span>
                    </h2>
                    <p className="section-subtitle" style={{ margin: '0 auto 24px' }}>
                        A web-based and collaborative design tool to create production-ready
                        interactive real-time experiences.
                    </p>
                    <a href="#" className="btn btn-secondary" id="learn-more-hana">
                        Learn more <span style={{ marginLeft: '4px' }}>→</span>
                    </a>
                </div>

                {/* Hana preview */}
                <div className="feature-section__preview fade-in">
                    <div className="feature-section__preview-content feature-section__preview-content--hana">
                        <div className="hana-canvas">
                            <div className="hana-element hana-element--1"></div>
                            <div className="hana-element hana-element--2"></div>
                            <div className="hana-element hana-element--3"></div>
                            <div className="hana-toolbar">
                                <span></span><span></span><span></span><span></span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature cards */}
                <div className="feature-section__cards fade-in">
                    {features.map((f, i) => (
                        <div className="feature-card" key={i}>
                            <div className="feature-card__icon" style={{ background: `${f.color}15`, color: f.color }}>
                                {f.icon}
                            </div>
                            <h3 className="feature-card__title">{f.title}</h3>
                            <p className="feature-card__desc">{f.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeatureHana;
