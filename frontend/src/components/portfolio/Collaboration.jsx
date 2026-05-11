const Collaboration = () => {
    return (
        <section className="collaboration" id="collaboration">
            <div className="container">
                {/* Real-time collab */}
                <div className="collaboration__block fade-in">
                    <div className="collaboration__text">
                        <h2 className="section-title">
                            Create and collaborate<br />
                            <span className="section-title-gradient">in real-time</span>
                        </h2>
                        <p className="section-subtitle">
                            Add comments, invite your team, or share a link!
                            Brainstorming in 3D is easy with Spline.
                        </p>
                    </div>
                    <div className="collaboration__visual">
                        <div className="collab-avatars">
                            <div className="collab-avatar" style={{ background: '#667eea' }}>A</div>
                            <div className="collab-avatar" style={{ background: '#EC4899' }}>B</div>
                            <div className="collab-avatar" style={{ background: '#10B981' }}>C</div>
                            <div className="collab-avatar collab-avatar--add">+</div>
                        </div>
                        <div className="collab-cursors">
                            <div className="collab-cursor" style={{ '--cursor-color': '#667eea', left: '30%', top: '40%' }}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M0 0L6 14L8 8L14 6L0 0Z" />
                                </svg>
                                <span>Alice</span>
                            </div>
                            <div className="collab-cursor" style={{ '--cursor-color': '#EC4899', left: '60%', top: '60%' }}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M0 0L6 14L8 8L14 6L0 0Z" />
                                </svg>
                                <span>Bob</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ship to platforms */}
                <div className="collaboration__block collaboration__block--reverse fade-in">
                    <div className="collaboration__text">
                        <h2 className="section-title">
                            Ship real-time experiences to<br />
                            <strong>Web, iOS and Android</strong>
                        </h2>
                        <p className="section-subtitle">
                            A multi-platform solution to seamlessly integrate interactive 3D
                            experiences into your websites, apps, and digital products.
                        </p>
                    </div>
                    <div className="collaboration__code">
                        <div className="code-block">
                            <div className="code-block__header">
                                <span className="code-block__dot" style={{ background: '#EF4444' }}></span>
                                <span className="code-block__dot" style={{ background: '#F59E0B' }}></span>
                                <span className="code-block__dot" style={{ background: '#10B981' }}></span>
                                <span className="code-block__title">HTML</span>
                            </div>
                            <pre className="code-block__content">
                                {`<!-- Import Spline Viewer -->
<script type="module"
  src="https://unpkg.com/
  @splinetool/viewer/build/
  spline-viewer.js">
</script>

<!-- Add your 3D scene -->
<spline-viewer
  url="https://prod.spline
  .design/scene.splinecode">
</spline-viewer>`}
                            </pre>
                        </div>
                        <a href="#" className="btn btn-secondary" style={{ marginTop: '16px' }} id="docs-btn">
                            Docs <span style={{ marginLeft: '4px' }}>→</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Collaboration;
