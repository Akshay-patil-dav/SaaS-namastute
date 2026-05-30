import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import WebsiteNavbar from '../../../components/common/WebsiteNavbar/WebsiteNavbar';
import WebsiteFooter from '../../../components/common/WebsiteFooter/WebsiteFooter';
import './AIAutomation.css';

function useReveal() {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('visible');
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    return ref;
}

export default function AIAutomation() {
    const navigate = useNavigate();
    const heroRef = useReveal();
    const metricsRef = useReveal();
    const workflowsRef = useReveal();
    const ctaRef = useReveal();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "AI Automation | Cognitive Systems";
    }, []);

    return (
        <div className="ai-root">
            <WebsiteNavbar />

            {/* AI Hero */}
            <section className="ai-hero">
                <div className="ai-neural-net"></div>
                <div className="ai-container" ref={heroRef}>
                    <div className="ai-hero-content">
                        <div className="ai-pulse-badge">
                            <span className="ai-pulse-ring"></span>
                            INTELLIGENCE ACTIVE
                        </div>
                        <h1 className="ai-hero-title">
                            Augment Reality with <span className="ai-glow-text">AI Automation</span>
                        </h1>
                        <p className="ai-hero-subtitle">
                            Deploy cognitive systems that learn, adapt, and execute complex workflows without human intervention.
                        </p>
                        <div className="ai-hero-actions">
                            <button className="ai-btn-primary" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
                                Initialize System
                            </button>
                            <button className="ai-btn-secondary">
                                View Architecture
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="ai-floating-nodes">
                    <div className="ai-node n1">
                        <div className="ai-node-core">NLP</div>
                    </div>
                    <div className="ai-node n2">
                        <div className="ai-node-core">VISION</div>
                    </div>
                    <div className="ai-node n3">
                        <div className="ai-node-core">LLM</div>
                    </div>
                </div>
            </section>

            {/* Metric Dashboards */}
            <section className="ai-metrics-section">
                <div className="ai-container reveal" ref={metricsRef}>
                    <div className="ai-metrics-grid">
                        <div className="ai-metric-card">
                            <div className="ai-metric-value">99.8%</div>
                            <div className="ai-metric-label">Accuracy Rate</div>
                            <div className="ai-metric-chart line-chart"></div>
                        </div>
                        <div className="ai-metric-card">
                            <div className="ai-metric-value">10x</div>
                            <div className="ai-metric-label">Workflow Acceleration</div>
                            <div className="ai-metric-chart bar-chart"></div>
                        </div>
                        <div className="ai-metric-card">
                            <div className="ai-metric-value">24/7</div>
                            <div className="ai-metric-label">Autonomous Operation</div>
                            <div className="ai-metric-chart circle-chart"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Workflow Showcase */}
            <section className="ai-workflow-section">
                <div className="ai-container reveal" ref={workflowsRef}>
                    <div className="ai-section-header">
                        <h2>Cognitive Capabilities</h2>
                        <p>Systems designed to understand context and execute flawlessly.</p>
                    </div>

                    <div className="ai-capabilities-list">
                        <div className="ai-cap-row">
                            <div className="ai-cap-icon">🧠</div>
                            <div className="ai-cap-text">
                                <h3>Custom LLM Integration</h3>
                                <p>Deploy tailored language models trained specifically on your enterprise data for perfect contextual understanding.</p>
                            </div>
                        </div>
                        <div className="ai-cap-row">
                            <div className="ai-cap-icon">⚙️</div>
                            <div className="ai-cap-text">
                                <h3>Robotic Process Automation</h3>
                                <p>Eliminate repetitive tasks with intelligent bots that interact with legacy software and modern APIs alike.</p>
                            </div>
                        </div>
                        <div className="ai-cap-row">
                            <div className="ai-cap-icon">👁️</div>
                            <div className="ai-cap-text">
                                <h3>Computer Vision</h3>
                                <p>Extract structured data from unstructured images and documents in real-time with superhuman accuracy.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI CTA */}
            <section className="ai-cta-section" id="contact">
                <div className="ai-container reveal" ref={ctaRef}>
                    <div className="ai-cta-card">
                        <div className="ai-cta-bg"></div>
                        <h2>Ready to integrate intelligence?</h2>
                        <p>Schedule a consultation with our AI architects to discover your automation potential.</p>
                        <button className="ai-btn-primary">Connect with an Architect</button>
                    </div>
                </div>
            </section>

            <WebsiteFooter />
        </div>
    );
}
