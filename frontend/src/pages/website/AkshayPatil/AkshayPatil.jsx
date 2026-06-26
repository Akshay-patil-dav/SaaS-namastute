import React from 'react';
import { Mail, Github, Linkedin, ExternalLink, Code, Layout, Database, Smartphone, Terminal, Briefcase, User, ChevronRight, Brain } from 'lucide-react';
import './AkshayPatil.css';

const AkshayPatil = () => {
    return (
        <div className="portfolio-wrapper">
            {/* Navigation / Header */}
            <nav className="portfolio-nav">
                <div className="nav-content">
                    <div className="logo">AP<span>.</span></div>
                    <div className="nav-links">
                        <a href="#about">About</a>
                        <a href="#experience">Experience</a>
                        <a href="#projects">Projects</a>
                        <a href="#skills">Skills</a>
                        <a href="#contact" className="contact-btn">Contact Me</a>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-text">
                        <h2 className="greeting">Hi, I'm</h2>
                        <h1 className="name">Akshay Patil</h1>
                        <h3 className="role">Senior Software & AI Engineer</h3>
                        <p className="bio">
                            I architect scalable systems, build exceptional digital experiences, 
                            and integrate advanced AI solutions. Passionate about clean code, robust backend architecture, 
                            and driving innovation to solve complex enterprise problems.
                        </p>
                        <div className="hero-actions">
                            <a href="#projects" className="btn-primary">View My Work <ChevronRight size={18} /></a>
                            <div className="social-links">
                                <a href="https://github.com/akshay-patil-dev" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={22} /></a>
                                <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={22} /></a>
                            </div>
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="image-container">
                            {/* We can use a placeholder or the actual image from vercel app */}
                            <img src="https://akshay-patil-dev.vercel.app/assets/pic-BFAmhDAK.jpg" alt="Akshay Patil" />
                            <div className="shape shape-1"></div>
                            <div className="shape shape-2"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="section about-section">
                <div className="section-header">
                    <User className="section-icon" />
                    <h2>About Me</h2>
                </div>
                <div className="about-content">
                    <div className="about-text">
                        <p>
                            Hello! My name is Akshay. I am a seasoned software engineer with a deep passion for architecting 
                            complex, scalable web applications and integrating cutting-edge AI technologies into enterprise solutions.
                        </p>
                        <p>
                            Over my career, I've had the privilege of leading technical initiatives, mentoring teams, 
                            and building software that scales to thousands of users. My current focus is leveraging 
                            Large Language Models (LLMs) and intelligent automation to transform business workflows.
                        </p>
                        <div className="stats-container">
                            <div className="stat-item">
                                <h4>6+</h4>
                                <span>Years Experience</span>
                            </div>
                            <div className="stat-item">
                                <h4>20+</h4>
                                <span>Projects Completed</span>
                            </div>
                            <div className="stat-item">
                                <h4>100%</h4>
                                <span>Client Satisfaction</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Experience Section */}
            <section id="experience" className="section experience-section">
                <div className="section-header">
                    <Briefcase className="section-icon" />
                    <h2>Work Experience</h2>
                </div>
                <div className="timeline">
                    <div className="timeline-item">
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                            <div className="timeline-header">
                                <h3>Senior AI & Software Engineer</h3>
                                <span className="date">2022 - Present</span>
                            </div>
                            <h4>Enterprise Tech Solutions</h4>
                            <p>
                                Led the architecture and development of scalable web applications incorporating AI-driven features. 
                                Implemented RAG (Retrieval-Augmented Generation) pipelines, optimized system architecture, and 
                                mentored engineering teams in best practices.
                            </p>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                            <div className="timeline-header">
                                <h3>Frontend Developer</h3>
                                <span className="date">2020 - 2022</span>
                            </div>
                            <h4>Creative Agency</h4>
                            <p>
                                Built interactive user interfaces for client projects. Ensured cross-browser compatibility 
                                and mobile responsiveness. Reduced load times by 30% through code optimization.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Skills Section */}
            <section id="skills" className="section skills-section">
                <div className="section-header">
                    <Code className="section-icon" />
                    <h2>Technical Skills</h2>
                </div>
                <div className="skills-grid">
                    <div className="skill-card">
                        <Brain className="skill-icon" />
                        <h3>AI & Machine Learning</h3>
                        <ul>
                            <li>OpenAI API & LLMs</li>
                            <li>LangChain / LlamaIndex</li>
                            <li>RAG Architecture</li>
                            <li>Prompt Engineering</li>
                            <li>TensorFlow / PyTorch</li>
                        </ul>
                    </div>
                    <div className="skill-card">
                        <Layout className="skill-icon" />
                        <h3>Frontend Architecture</h3>
                        <ul>
                            <li>React.js / Next.js</li>
                            <li>Advanced State Management</li>
                            <li>Micro-frontends</li>
                            <li>Web Performance Optimization</li>
                        </ul>
                    </div>
                    <div className="skill-card">
                        <Database className="skill-icon" />
                        <h3>Backend</h3>
                        <ul>
                            <li>Node.js / Express.js</li>
                            <li>Python / Django</li>
                            <li>MongoDB / PostgreSQL</li>
                            <li>RESTful APIs / GraphQL</li>
                            <li>Firebase</li>
                        </ul>
                    </div>
                    <div className="skill-card">
                        <Terminal className="skill-icon" />
                        <h3>Tools & Others</h3>
                        <ul>
                            <li>Git & GitHub</li>
                            <li>Docker / Kubernetes</li>
                            <li>AWS / Vercel / Heroku</li>
                            <li>Jest / Testing Library</li>
                            <li>Agile / Scrum</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="section projects-section">
                <div className="section-header">
                    <Smartphone className="section-icon" />
                    <h2>Featured Projects</h2>
                </div>
                <div className="projects-grid">
                    {[
                        { title: 'AI Enterprise RAG Assistant', desc: 'An intelligent document retrieval system using LangChain and vector databases to instantly answer complex enterprise queries.', tags: ['Python', 'LangChain', 'Pinecone', 'OpenAI'] },
                        { title: 'SaaS Platform (Namastute)', desc: 'A comprehensive retail and SaaS management platform featuring POS, Inventory, Sales, and CRM management.', tags: ['React', 'Node.js', 'Vite', 'PostgreSQL'] },
                        { title: 'Predictive Analytics Dashboard', desc: 'Real-time dashboard integrating machine learning models for forecasting sales and customer retention.', tags: ['React', 'Redux', 'TensorFlow.js', 'Recharts'] }
                    ].map((project, index) => (
                        <div className="project-card" key={index}>
                            <div className="project-content">
                                <div className="project-top">
                                    <Code size={24} className="project-folder" />
                                    <div className="project-links">
                                        <a href="#" aria-label="External Link"><ExternalLink size={20} /></a>
                                    </div>
                                </div>
                                <h3 className="project-title">{project.title}</h3>
                                <p className="project-desc">{project.desc}</p>
                            </div>
                            <div className="project-tags">
                                {project.tags.map((tag, i) => <span key={i}>{tag}</span>)}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="section contact-section">
                <div className="contact-card">
                    <h2>Get In Touch</h2>
                    <p>
                        Although I'm not currently looking for any new opportunities, my inbox is always open. 
                        Whether you have a question or just want to say hi, I'll try my best to get back to you!
                    </p>
                    <a href="mailto:akshay@example.com" className="btn-primary" style={{ marginTop: '24px', display: 'inline-flex' }}>
                        <Mail size={18} style={{ marginRight: '8px' }} /> Say Hello
                    </a>
                </div>
            </section>

            {/* Footer */}
            <footer className="portfolio-footer">
                <p>Designed & Built by Akshay Patil</p>
                <div className="social-links-footer">
                    <a href="https://github.com/akshay-patil-dev" target="_blank" rel="noreferrer"><Github size={18} /></a>
                    <a href="https://linkedin.com" target="_blank" rel="noreferrer"><Linkedin size={18} /></a>
                </div>
            </footer>
        </div>
    );
};

export default AkshayPatil;
