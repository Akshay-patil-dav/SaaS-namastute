import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectsData } from '../../../data/projectsData';
import WebsiteNavbar from '../../../components/common/WebsiteNavbar/WebsiteNavbar';
import WebsiteFooter from '../../../components/common/WebsiteFooter/WebsiteFooter';
import { Check, ExternalLink, Twitter, Facebook, Youtube, Github } from 'lucide-react';
import './ProjectInfo.css';

export default function ProjectInfo() {
    const { slug } = useParams();
    const [activeTab, setActiveTab] = useState('overview');
    const [activeFaq, setActiveFaq] = useState(null);

    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index);
    };
    
    // Find the project based on the slug
    const project = projectsData.find(p => 
        p.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '') === slug
    );

    useEffect(() => {
        window.scrollTo(0, 0);
        if (project) {
            document.title = `Namustutam | ${project.title} - Website Template`;
        } else {
            document.title = "Namustutam | Project Not Found";
        }
    }, [project]);

    if (!project) {
        return (
            <div className="lp-root project-info-not-found">
                <WebsiteNavbar />
                <div style={{ padding: '150px 0', textAlign: 'center', minHeight: '60vh' }}>
                    <h1>Project Not Found</h1>
                    <Link to="/project-works" style={{ color: '#ffb38a', textDecoration: 'underline', marginTop: '20px', display: 'inline-block' }}>
                        Return to Projects
                    </Link>
                </div>
                <WebsiteFooter />
            </div>
        );
    }

    return (
        <div className="lp-root project-info-root">
            <WebsiteNavbar />
            
            <main className="project-info-main">
                {/* Content Layout (Marketplace Presentation) */}
                <div className="project-info-content">
                    {/* Left Column (Main Content) */}
                    <div className="project-info-left">
                        
                        {/* Header Details in Left Column */}
                        <div className="project-info-header-details">
                            <div className="project-info-breadcrumbs">
                                <Link to="/project-works">Projects</Link>
                                <span className="breadcrumb-separator"> / </span>
                                <span>{project.category === 'NEW' ? 'Premium Template' : project.category}</span>
                            </div>
                            <div className="project-info-title-row">
                                <div className="project-info-author-icon">{project.title.charAt(0)}</div>
                                <div>
                                    <h1 className="project-info-title">{project.title} - Website Template</h1>
                                    <p className="project-info-author-name">by <span>{project.author}</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Summary / Hero Area */}
                        <div className="project-info-hero-inner">
                            <img src={project.img} alt={`${project.title} Preview`} className="project-info-hero-img" />
                        </div>

                        {/* Detail Content */}
                        <div className="project-info-tabs">
                            <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</button>
                            <button className={activeTab === 'license' ? 'active' : ''} onClick={() => setActiveTab('license')}>License</button>
                            <button className={activeTab === 'support' ? 'active' : ''} onClick={() => setActiveTab('support')}>Support</button>
                            <button className={activeTab === 'faq' ? 'active' : ''} onClick={() => setActiveTab('faq')}>FAQ</button>
                        </div>
                        
                        {activeTab === 'overview' && (
                            <>
                                <div className="project-info-description">
                                    <p><strong>{project.title}</strong> is a modern and visually stunning project.</p>
                                    <p>{project.description}</p>
                                </div>

                                {project.techStack && project.techStack.length > 0 && (
                                    <div className="project-info-pages-list">
                                        <h3>Technologies Used</h3>
                                        <p className="page-desc">The {project.title} project was built using the following modern technologies:</p>
                                        
                                        <div className="pages-section">
                                            <ul>
                                                {project.techStack.map((tech, idx) => (
                                                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span style={{ color: tech.color, display: 'flex', alignItems: 'center' }}>{tech.icon}</span>
                                                        {tech.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === 'license' && (
                            <div className="project-info-description">
                                <p><strong>License Agreement</strong></p>
                                <p>All templates are available under our standard license which allows you to use the template for a single personal or commercial project. This means you can use it for your own website or a client's website, but you cannot resell or redistribute the template itself.</p>
                                <p>If you need to use the template for multiple projects, you will need to purchase an additional license for each project.</p>
                            </div>
                        )}

                        {activeTab === 'support' && (
                            <div className="project-info-description">
                                <p><strong>Premium Support</strong></p>
                                <p>We provide premium support with every purchase. This covers bug fixes, theme setup, and general guidance on how to use the template.</p>
                                <p>Support does not cover custom development, major structural changes, or third-party plugin integrations. For custom work, please contact us for a quote.</p>
                            </div>
                        )}

                        {activeTab === 'faq' && (
                            <div className="project-info-faq-accordion">
                                <p className="faq-main-title"><strong>Frequently Asked Questions</strong></p>
                                
                                <div className={`faq-item ${activeFaq === 0 ? 'active' : ''}`} onClick={() => toggleFaq(0)}>
                                    <div className="faq-question">
                                        <strong>Can I use this for multiple clients?</strong>
                                        <span className="faq-icon">{activeFaq === 0 ? '−' : '+'}</span>
                                    </div>
                                    <div className="faq-answer-wrapper" style={{ maxHeight: activeFaq === 0 ? '200px' : '0' }}>
                                        <div className="faq-answer">
                                            <p>No, standard licenses are single-use. You must purchase a new license for each client.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className={`faq-item ${activeFaq === 1 ? 'active' : ''}`} onClick={() => toggleFaq(1)}>
                                    <div className="faq-question">
                                        <strong>Do I need to know how to code?</strong>
                                        <span className="faq-icon">{activeFaq === 1 ? '−' : '+'}</span>
                                    </div>
                                    <div className="faq-answer-wrapper" style={{ maxHeight: activeFaq === 1 ? '200px' : '0' }}>
                                        <div className="faq-answer">
                                            <p>No, this template is built to be easily customizable without touching a single line of code. Everything is manageable through the CMS and editor.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className={`faq-item ${activeFaq === 2 ? 'active' : ''}`} onClick={() => toggleFaq(2)}>
                                    <div className="faq-question">
                                        <strong>Can I get a refund?</strong>
                                        <span className="faq-icon">{activeFaq === 2 ? '−' : '+'}</span>
                                    </div>
                                    <div className="faq-answer-wrapper" style={{ maxHeight: activeFaq === 2 ? '200px' : '0' }}>
                                        <div className="faq-answer">
                                            <p>Due to the digital nature of templates, all sales are final. If you encounter bugs, our support team will help you fix them immediately.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column (Sticky Sidebar) */}
                    <div className="project-info-right">
                        
                        {/* Primary Actions (Moved to Sidebar) */}
                        <div className="project-info-sidebar-actions">
                            <div className="price-tag">{project.price || 'Free'}</div>
                            <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="btn-solid sidebar-btn" style={{marginBottom: '10px'}}>
                                Live Preview
                            </a>
                            {project.githubLink && (
                                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="btn-outline sidebar-btn">
                                    View Source Code
                                </a>
                            )}
                        </div>

                        <div className="project-info-sidebar-section">
                            <h4>Category</h4>
                            <div className="tags-container">
                                <span className="tag">{project.filter || 'Project'}</span>
                            </div>
                        </div>

                        {project.techStack && project.techStack.length > 0 && (
                            <div className="project-info-sidebar-section">
                                <h4>Tech Stack</h4>
                                <ul className="features-checklist">
                                    {project.techStack.map((tech, idx) => (
                                        <li key={idx}>
                                            <Check size={14} className="check-icon" style={{ color: tech.color }} /> {tech.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="project-info-sidebar-section">
                            <h4>Share</h4>
                            <div className="share-icons">
                                <a href="#"><Twitter size={16} /></a>
                                <a href="#"><Facebook size={16} /></a>
                                <a href="#"><Youtube size={16} /></a>
                                <a href="#"><Github size={16} /></a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Similar Templates */}
                <div className="similar-templates-section">
                    <div className="similar-templates-header">
                        <h2>Similar templates</h2>
                        <Link to="/project-works" className="browse-all-link">Browse all <ExternalLink size={14} /></Link>
                    </div>
                    <div className="similar-templates-grid">
                        {projectsData.filter(p => p.title !== project.title).slice(0, 3).map((simProj, idx) => (
                            <Link to={'/project-info/' + simProj.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')} key={`sim-${idx}`} className="similar-template-card">
                                <img src={simProj.img} alt={simProj.title} />
                                <div className="similar-card-footer">
                                    <div className="similar-card-title-container">
                                        <div className="similar-card-icon">{simProj.title.charAt(0)}</div>
                                        <div className="similar-card-text">
                                            <h5>{simProj.title}</h5>
                                            <span>{simProj.author}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            </main>
            
            <WebsiteFooter />
        </div>
    );
}
