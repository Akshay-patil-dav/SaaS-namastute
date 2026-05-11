const showcaseProjects = [
    {
        title: 'Risk intelligence, decoded.',
        company: 'Oscilar',
        color: '#EF4444',
    },
    {
        title: 'The future of aviation safety',
        company: 'Avora AI',
        color: '#3B82F6',
    },
    {
        title: 'Forbes Legacy Pass',
        company: 'Forbes',
        color: '#8B5CF6',
    },
    {
        title: 'Email for developers',
        company: 'Resend',
        color: '#10B981',
    },
    {
        title: 'Delightful events start here.',
        company: 'Luma',
        color: '#F59E0B',
    },
    {
        title: 'Building Cool Experiences',
        company: 'Spline Team',
        color: '#6366F1',
    },
];

const FeaturesIntro = () => {
    return (
        <section className="features-intro" id="features-intro">
            <div className="container">
                <div className="features-intro__header fade-in" style={{ textAlign: 'center' }}>
                    <h2 className="section-title">
                        Where ideas become<br />
                        <strong>production-ready experiences</strong>
                    </h2>
                    <p className="section-subtitle" style={{ margin: '0 auto 64px' }}>
                        Supercharge your team to deliver production-ready interactive 2D & 3D
                        experiences all-in-one platform.
                    </p>
                </div>

                <div className="features-intro__grid fade-in">
                    {showcaseProjects.map((project, i) => (
                        <div className="features-intro__card" key={i}>
                            <div
                                className="features-intro__card-preview"
                                style={{ background: `linear-gradient(135deg, ${project.color}15 0%, ${project.color}30 100%)` }}
                            >
                                <div className="features-intro__card-badge" style={{ color: project.color }}>
                                    {project.company}
                                </div>
                                <h3 className="features-intro__card-title">{project.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesIntro;
