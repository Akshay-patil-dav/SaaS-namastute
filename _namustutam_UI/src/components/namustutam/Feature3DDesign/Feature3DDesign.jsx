const features = [
    {
        title: 'Express your creativity in 3D',
        description: 'Familiar design tools to help you create your best 3D designs.',
        icon: '🎨',
        color: '#F59E0B',
    },
    {
        title: 'Layer-based materials',
        description: 'Create unique materials with multiple layers or use the ready-made material library.',
        icon: '🧱',
        color: '#8B5CF6',
    },
    {
        title: 'Interactivity & Motion',
        description: "Add interactivity and animation with Spline's powerful event system.",
        icon: '⚡',
        color: '#3B82F6',
    },
    {
        title: 'Variables & Data',
        description: 'Bring real-time data into your experiences with Variables, Webhooks, APIs and AI.',
        icon: '📊',
        color: '#10B981',
    },
];

const Feature3DDesign = () => {
    return (
        <section className="feature-section" id="feature-3d">
            <div className="container">
                <div className="feature-section__header fade-in" style={{ textAlign: 'center' }}>
                    <div className="section-label">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                        3D Design
                    </div>
                    <h2 className="section-title">
                        Collaborative 3D Design,<br />
                        ready for production
                    </h2>
                    <p className="section-subtitle" style={{ margin: '0 auto 24px' }}>
                        A web-based, collaborative 3D design platform to create production-ready
                        interactive real-time 3D experiences.
                    </p>
                    <a href="#" className="btn btn-secondary" id="learn-more-3d">
                        Learn more <span style={{ marginLeft: '4px' }}>→</span>
                    </a>
                </div>

                {/* Main preview */}
                <div className="feature-section__preview fade-in">
                    <div className="feature-section__preview-content">
                        <div className="feature-section__preview-shapes">
                            <div className="preview-shape preview-shape--1"></div>
                            <div className="preview-shape preview-shape--2"></div>
                            <div className="preview-shape preview-shape--3"></div>
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

export default Feature3DDesign;
