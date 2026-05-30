const Hero = () => {
    return (
        <section className="hero" id="hero">
            {/* Floating 3D shapes */}
            <div className="hero__shapes">
                <div className="hero__shape hero__shape--1"></div>
                <div className="hero__shape hero__shape--2"></div>
                <div className="hero__shape hero__shape--3"></div>
                <div className="hero__shape hero__shape--4"></div>
                <div className="hero__shape hero__shape--5"></div>
                <div className="hero__shape hero__shape--6"></div>
                <div className="hero__shape hero__shape--7"></div>
                <div className="hero__shape hero__shape--8"></div>
            </div>

            <div className="hero__content container">
                <h1 className="hero__title">
                    The all-in-one platform<br />
                    for <span className="hero__title-gradient">3D and design</span>
                </h1>
                <p className="hero__subtitle">
                    Spline is a design platform to create and collaborate on<br />
                    interactive production-ready experiences in real-time.
                </p>
                <a href="#" className="btn btn-primary hero__cta" id="hero-cta">
                    Get started — it's free
                    <span className="hero__cta-arrow">→</span>
                </a>
            </div>

            {/* Grid overlay */}
            <div className="hero__grid-overlay"></div>
        </section>
    );
};

export default Hero;
