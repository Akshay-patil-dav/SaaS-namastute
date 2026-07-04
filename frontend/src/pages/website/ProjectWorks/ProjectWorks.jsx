import { useEffect, useState } from 'react';
import { Eye, Info, X, ChevronLeft, ChevronRight, ShoppingCart, Briefcase, Cloud, Layers } from 'lucide-react';
import { FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaJs } from 'react-icons/fa';
import { SiMongodb, SiTypescript, SiExpress, SiPostgresql } from 'react-icons/si';
import WebsiteNavbar from '../../../components/common/WebsiteNavbar/WebsiteNavbar';
import WebsiteFooter from '../../../components/common/WebsiteFooter/WebsiteFooter';
import '../ITPortfolio/ITPortfolio.css';
import './ProjectWorks.css';

export default function ProjectWorks() {
    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Namustutam | Project Works";
    }, []);

    const [activeFilter, setActiveFilter] = useState('All Projects');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProject, setSelectedProject] = useState(null);

    const filters = [
        { name: 'All Projects', icon: <Layers size={18} /> },
        { name: 'E-Commerce', icon: <ShoppingCart size={18} /> },
        { name: 'Business Page', icon: <Briefcase size={18} /> },
        { name: 'SaaS Project', icon: <Cloud size={18} /> }
    ];

    const projectsData = [
        {
            title: 'E-Commerce Dashboard',
            category: 'Live',
            filter: 'E-Commerce',
            img: '/dashboard1.png', 
            techStack: [
                { name: 'React', icon: <FaReact />, color: '#8b5cf6' },
                { name: 'Node.js', icon: <FaNodeJs />, color: '#10b981' },
                { name: 'MongoDB', icon: <SiMongodb />, color: '#10b981' },
                { name: 'TypeScript', icon: <SiTypescript />, color: '#3b82f6' }
            ],
            description: 'A comprehensive e-commerce dashboard with real-time analytics, inventory management, and order tracking capabilities.',
            liveLink: '#',
            githubLink: '#'
        },
        {
            title: 'Portfolio Website',
            category: 'In Progress',
            filter: 'Business Page',
            img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
            techStack: [
                { name: 'HTML', icon: <FaHtml5 />, color: '#3b82f6' },
                { name: 'CSS', icon: <FaCss3Alt />, color: '#f43f5e' },
                { name: 'JavaScript', icon: <FaJs />, color: '#f59e0b' }
            ],
            description: 'A stunning personal portfolio showcasing creative work with smooth animations and responsive design.',
            liveLink: '#',
            githubLink: '#'
        },
        {
            title: 'REST API Service',
            category: 'Live',
            filter: 'SaaS Project',
            img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
            techStack: [
                { name: 'Node.js', icon: <FaNodeJs />, color: '#10b981' },
                { name: 'Express', icon: <SiExpress />, color: '#6b7280' },
                { name: 'PostgreSQL', icon: <SiPostgresql />, color: '#8b5cf6' }
            ],
            description: 'A scalable RESTful API with authentication, rate limiting, and comprehensive documentation.',
            liveLink: '#',
            githubLink: '#'
        }
    ];

    const filteredProjects = activeFilter === 'All Projects' 
        ? projectsData 
        : projectsData.filter(p => p.filter === activeFilter);

    const ITEMS_PER_PAGE = 3;
    const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
    const displayedProjects = filteredProjects.slice(
        (currentPage - 1) * ITEMS_PER_PAGE, 
        currentPage * ITEMS_PER_PAGE
    );

    // Generate array of page numbers
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="lp-root project-works-root">
            <WebsiteNavbar />
            
            <section className="project-works-hero">
                <div className="project-works-hero-content">
                    <div className="lp-section-label" style={{ margin: '0 auto' }}>Our Projects</div>
                    <h1 className="project-works-hero-title">
                        Selected <span className="portfolio-gradient-text">Project Works</span>
                    </h1>
                    <p className="project-works-hero-sub">
                        Explore our recent implementations, custom web solutions, and robust enterprise applications built by our talented engineers.
                    </p>
                </div>
            </section>

            <main className="project-works-main" style={{ padding: '0 5% 80px', maxWidth: '1400px', margin: '0 auto' }}>
                {/* Filter Section */}
                <div className="project-filters">
                    {filters.map(filter => (
                        <button 
                            key={filter.name} 
                            className={`filter-btn ${activeFilter === filter.name ? 'active' : ''}`}
                            onClick={() => { setActiveFilter(filter.name); setCurrentPage(1); }}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                        >
                            {filter.icon} <span>{filter.name}</span>
                        </button>
                    ))}
                </div>

                {/* Projects Grid */}
                <div className="projects-grid">
                    {displayedProjects.map((project, i) => (
                        <div key={`project-${i}`} className="project-card">
                            <div className="project-img-wrapper">
                                <span className="project-category-badge">{project.category}</span>
                                <img src={project.img} alt={project.title} className="project-img" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('no-img'); }} />
                            </div>
                            <div className="project-content">
                                <h3 className="project-title">{project.title}</h3>
                                <p className="project-description">{project.description}</p>
                                <div className="project-actions">
                                    <a href={project.liveLink} className="action-btn live-btn">
                                        <Eye size={16} /> Live Demo
                                    </a>
                                    <button onClick={() => setSelectedProject(project)} className="action-btn info-btn">
                                        <Info size={16} /> More Info
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="project-pagination">
                        <button 
                            className="pagination-btn prev-next" 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        >
                            <ChevronLeft size={16} /> Previous
                        </button>
                        {pageNumbers.map(page => (
                            <button 
                                key={page} 
                                className={`pagination-btn page-num ${currentPage === page ? 'active' : ''}`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}
                        <button 
                            className="pagination-btn prev-next"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        >
                            Next <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </main>

            {/* Project Details Modal */}
            {selectedProject && (
                <div className="project-modal-overlay" onClick={() => setSelectedProject(null)}>
                    <div className="project-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="project-modal-close" onClick={() => setSelectedProject(null)}>
                            <X size={24} />
                        </button>
                        <div className="project-modal-body">
                            <div className="project-modal-img-wrapper">
                                <img src={selectedProject.img} alt={selectedProject.title} className="project-modal-img" />
                            </div>
                            <div className="project-modal-details">
                                <span className="project-modal-badge" style={{ display: 'inline-block', background: 'rgba(255, 155, 41, 0.15)', color: '#ff9b29', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', marginBottom: '16px' }}>
                                    {selectedProject.category}
                                </span>
                                <h2 className="project-modal-title" style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', marginBottom: '20px' }}>
                                    {selectedProject.title}
                                </h2>
                                <p className="project-modal-desc" style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '30px' }}>
                                    {selectedProject.description}
                                </p>
                                
                                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>Technologies Used</h4>
                                <div className="project-tech-stack" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px' }}>
                                    {selectedProject.techStack.map(tech => (
                                        <span key={tech.name} className="tech-badge" style={{ color: tech.color, backgroundColor: `${tech.color}15`, display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
                                            {tech.icon} {tech.name}
                                        </span>
                                    ))}
                                </div>

                                <div className="project-modal-actions" style={{ display: 'flex', gap: '16px', marginTop: 'auto' }}>
                                    <a href={selectedProject.liveLink} target="_blank" rel="noopener noreferrer" className="action-btn live-btn" style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '14px', borderRadius: '10px', fontSize: '1rem', fontWeight: '600' }}>
                                        <Eye size={20} /> Live Project View
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <WebsiteFooter />
        </div>
    );
}
