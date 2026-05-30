const showcaseItems = [
    { category: 'Interactive Websites', author: '@DesignGabor', color: '#667eea', icon: '🌐' },
    { category: 'Product Design', author: '@heyvlad', color: '#7C3AED', icon: '📱' },
    { category: 'Brand & Marketing', author: '@sanny.verkissen', color: '#EC4899', icon: '⭐' },
    { category: 'Gamified Experiences', author: '@rluzmotion', color: '#06B6D4', icon: '🎮' },
    { category: '3D Mockups', author: '@tanyadizone', color: '#F59E0B', icon: '📦' },
    { category: '3D Logos', author: '@samborek', color: '#10B981', icon: '💎' },
    { category: 'Animated Characters', author: '@aximoris', color: '#8B5CF6', icon: '🎭' },
    { category: 'Industrial & Manufacturing', author: '@gleb124', color: '#3B82F6', icon: '⚙️' },
    { category: '3D Icons', author: '@adriandaniluk', color: '#EF4444', icon: '🎯' },
    { category: 'Brand & Marketing', author: '@vladkolokolnikov', color: '#14B8A6', icon: '🚀' },
    { category: 'Gamified Experiences', author: '@vladkolokolnikov', color: '#F97316', icon: '🎲' },
    { category: 'Industrial & Manufacturing', author: '@lionti', color: '#6366F1', icon: '🔧' },
];

const ShowcaseCarousel = () => {
    const row1 = showcaseItems.slice(0, 6);
    const row2 = showcaseItems.slice(6);

    return (
        <section className="showcase" id="showcase">
            <div className="container">
                <div className="showcase__header fade-in">
                    <h2 className="section-title" style={{ textAlign: 'center' }}>
                        A complete platform for<br />
                        <span className="section-title-gradient">real-time interactive design</span>
                    </h2>
                    <p className="section-subtitle" style={{ textAlign: 'center', margin: '0 auto 48px' }}>
                        Get started by remixing a 3D design made by the Spline community.
                    </p>
                </div>
            </div>

            {/* Carousel — pause animation on hover for usability */}
            <div className="showcase__carousel">
                <div className="showcase__row showcase__row--left">
                    {[...row1, ...row1].map((item, i) => (
                        <div className="showcase__card" key={`r1-${i}`}>
                            <div
                                className="showcase__card-preview"
                                style={{ background: `linear-gradient(135deg, ${item.color}18 0%, ${item.color}38 100%)` }}
                            >
                                <span className="showcase__card-icon">{item.icon}</span>
                            </div>
                            <div className="showcase__card-info">
                                <span className="showcase__card-category">{item.category}</span>
                                <span className="showcase__card-author">{item.author}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="showcase__row showcase__row--right">
                    {[...row2, ...row2].map((item, i) => (
                        <div className="showcase__card" key={`r2-${i}`}>
                            <div
                                className="showcase__card-preview"
                                style={{ background: `linear-gradient(135deg, ${item.color}18 0%, ${item.color}38 100%)` }}
                            >
                                <span className="showcase__card-icon">{item.icon}</span>
                            </div>
                            <div className="showcase__card-info">
                                <span className="showcase__card-category">{item.category}</span>
                                <span className="showcase__card-author">{item.author}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ShowcaseCarousel;
