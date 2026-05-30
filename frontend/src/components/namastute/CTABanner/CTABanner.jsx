const CTABanner = () => {
    return (
        <section className="cta-banner" id="cta">
            <div className="container">
                <div className="cta-banner__content fade-in">
                    <h2 className="cta-banner__title">
                        Design. Collaborate. Ship.
                    </h2>
                    <p className="cta-banner__subtitle">
                        Superpower your team to deliver production-ready interactive 2D and 3D
                        experiences all in one platform.
                    </p>
                    <a href="#" className="btn btn-primary cta-banner__btn" id="final-cta">
                        Get started — it's free
                        <span style={{ marginLeft: '6px' }}>→</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default CTABanner;
