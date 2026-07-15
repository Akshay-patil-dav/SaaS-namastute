const logos = [
    'Scale', 'Google', 'Shopify', 'Accenture', 'GIPHY',
    'Webflow', 'Alloy', 'OpenAI', 'Microsoft', 'Luma',
    'Meta', 'Snapchat', 'Forbes', 'SIEMENS', 'BURTON'
];

const LogoCloud = () => {
    return (
        <section className="logo-cloud" id="logo-cloud">
            <div className="container">
                <p className="logo-cloud__text fade-in">
                    Empowering individuals and teams <strong>at world's leading organizations</strong>
                </p>
                <div className="logo-cloud__grid fade-in">
                    {logos.map((name, i) => (
                        <div className="logo-cloud__item" key={i}>
                            <span className="logo-cloud__name">{name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LogoCloud;
