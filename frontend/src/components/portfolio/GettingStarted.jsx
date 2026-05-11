const resources = [
    {
        title: 'Community Platform',
        description: 'Explore and remix designs made by other community members.',
        cta: 'Explore Community',
        icon: '🌍',
        color: '#667eea',
    },
    {
        title: 'Library',
        description: 'Explore library files.',
        cta: 'Explore Library',
        icon: '📚',
        color: '#EC4899',
    },
    {
        title: 'Academy',
        description: 'Learn with video guides.',
        cta: 'Start Learning',
        icon: '🎓',
        color: '#F59E0B',
    },
    {
        title: 'Docs',
        description: 'Learn with written docs.',
        cta: 'Read Docs',
        icon: '📖',
        color: '#10B981',
    },
    {
        title: 'Download',
        description: 'Download Spline apps.',
        cta: 'Download Now',
        icon: '⬇️',
        color: '#6366F1',
    },
];

const GettingStarted = () => {
    return (
        <section className="getting-started" id="getting-started">
            <div className="container">
                <div className="getting-started__header fade-in" style={{ textAlign: 'center' }}>
                    <h2 className="section-title">
                        Getting started with <span className="section-title-gradient">Spline</span>
                    </h2>
                    <p className="section-subtitle" style={{ margin: '0 auto 64px' }}>
                        Remix designs from the community and library, and learn with written docs and video tutorials.
                    </p>
                </div>

                <div className="getting-started__grid fade-in">
                    {resources.map((r, i) => (
                        <a href="#" className="resource-card" key={i} id={`resource-${i}`}>
                            <div className="resource-card__icon" style={{ background: `${r.color}12`, color: r.color }}>
                                {r.icon}
                            </div>
                            <h3 className="resource-card__title">{r.title}</h3>
                            <p className="resource-card__desc">{r.description}</p>
                            <span className="resource-card__cta" style={{ color: r.color }}>
                                {r.cta} →
                            </span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GettingStarted;
