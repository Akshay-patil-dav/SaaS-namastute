import React, { useEffect, useRef, useState } from 'react';
import {
    Search, PenTool, Code2, ShieldCheck,
    Rocket, Users, Settings, Activity
} from 'lucide-react';
import './ExpertiseSection.css';

/* ── All 8 steps in strict ascending order ── */
const STEPS = [
    {
        num: 1, Icon: Search,
        title: 'Discovery',
        desc: 'Requirements gathering, stakeholder interviews, and project scoping to forge a crystal-clear roadmap.'
    },
    {
        num: 2, Icon: PenTool,
        title: 'Design',
        desc: 'UX research, wireframes, and high-fidelity prototypes before a single line of code is written.'
    },
    {
        num: 3, Icon: Code2,
        title: 'Development',
        desc: 'Agile sprints with daily standups, CI/CD pipelines, and rigorous peer code-reviews at every step.'
    },
    {
        num: 4, Icon: ShieldCheck,
        title: 'Testing',
        desc: 'Automated QA, security audits, load testing, and cross-device validation before go-live.'
    },
    {
        num: 5, Icon: Rocket,
        title: 'Launch',
        desc: 'Zero-downtime deployment with staged rollouts, rollback strategy, and dedicated go-live support.'
    },
    {
        num: 6, Icon: Users,
        title: 'Onboard',
        desc: 'Team training, documentation hand-off, and a smooth transition so your staff fully own the product.'
    },
    {
        num: 7, Icon: Settings,
        title: 'Operate',
        desc: 'Ongoing maintenance, performance monitoring, feature iterations, and round-the-clock support.'
    },
    {
        num: 8, Icon: Activity,
        title: 'Scale',
        desc: 'Architectural optimisations, auto-scaling infrastructure, and strategic capacity planning for growth.'
    },
];

export default function ExpertiseSection() {
    const gridRef = useRef(null);
    const connRef = useRef(null);

    /* ── Connector state (calculated in JS after layout) ── */
    const [conn, setConn] = useState({ left: 0, top: 0, height: 0, visible: false });

    /* Measures from bottom of the step-4 card to the top of the step-5 circle */
    const measureConnector = () => {
        const grid = gridRef.current;
        if (!grid) return;

        /* Use the card as the anchor point so the connector only spans the row-gap */
        const card4 = grid.querySelector('[data-step="4"] .sj-card');
        const circ4 = grid.querySelector('[data-step="4"] .sj-circle');
        const circ5 = grid.querySelector('[data-step="5"] .sj-circle');
        if (!card4 || !circ4 || !circ5) return;

        const gr  = grid.getBoundingClientRect();
        const rc4 = card4.getBoundingClientRect();
        const r4  = circ4.getBoundingClientRect();
        const r5  = circ5.getBoundingClientRect();

        if (r4.height === 0 || r5.height === 0) return;

        /* Horizontal centre of the circle-4 column */
        const left   = Math.round(r4.left + r4.width / 2 - gr.left);
        /* Start below the card bottom so connector is in the gap */
        const top    = Math.round(rc4.bottom - gr.top);
        /* End at the top of circle-5 */
        const height = Math.max(Math.round(r5.top - rc4.bottom), 0);

        setConn({ left, top, height, visible: height > 0 });
    };

    useEffect(() => {
        /* ── Scroll-reveal for all .journey-reveal and .sj-step elements ── */
        const revealIo = new IntersectionObserver(
            (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
            { threshold: 0.08, rootMargin: '0px 0px -3% 0px' }
        );
        const revealEls = document.querySelectorAll('.journey-reveal, .sj-step');
        revealEls.forEach(el => revealIo.observe(el));

        /*
         * ── Turn connector measurement strategy ──
         * The grid is NOT wrapped in journey-reveal, so its layout is always
         * correct. We measure:
         *   1. After first paint (requestAnimationFrame × 2 for safety)
         *   2. Every time the window resizes
         *   3. Once more after the reveal animation settles (800ms CSS duration)
         */
        let rafId;
        const scheduleFirstMeasure = () => {
            rafId = requestAnimationFrame(() => {
                rafId = requestAnimationFrame(() => {
                    measureConnector();
                    /* Re-measure after CSS transitions settle */
                    setTimeout(measureConnector, 900);
                });
            });
        };
        scheduleFirstMeasure();

        window.addEventListener('resize', measureConnector);

        return () => {
            revealEls.forEach(el => revealIo.unobserve(el));
            revealIo.disconnect();
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', measureConnector);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const rowOne = STEPS.slice(0, 4); // Steps 1-4  → displayed LTR (cols 1,2,3,4)
    const rowTwo = STEPS.slice(4);    // Steps 5-8  → placed RTL  (cols 4,3,2,1)

    return (
        <section className="sj-section" id="expertise">
            {/* Ambient blobs */}
            <div className="sj-blob sj-blob--1" aria-hidden="true" />
            <div className="sj-blob sj-blob--2" aria-hidden="true" />

            <div className="sj-container">

                {/* ── Main section header ── */}
                {/* <div className="journey-header journey-reveal">
                    <div className="portfolio-section-label">
                        <span className="journey-badge-dot" />
                        Methodology &amp; Architecture
                    </div>
                    <h2 className="portfolio-section-title">
                        Engineered for <span className="portfolio-gradient-text">Scale</span>
                    </h2>
                    <p className="portfolio-section-subtitle">
                        Our battle-tested software development lifecycle ensures your enterprise applications
                        are secure, performant, and future-proof — from day one to day infinity.
                    </p>
                </div> */}

                {/* ── Journey block ── */}
                <div className="sj-block">

                    {/* Sub-header */}
                    <div className="sj-subhead journey-reveal">
                        <div className="sj-eyebrow">
                            <span className="sj-eline" />
                            8-Step Process
                            <span className="sj-eline" />
                        </div>
                        <h3>The Development Journey</h3>
                        <p>A proven, agile methodology for delivering reliable software — on time, every time.</p>
                    </div>

                    {/*
                     * ── Snake grid ──
                     * NOT wrapped in journey-reveal so layout measurements are always accurate.
                     * Steps themselves have individual fade-up via .sj-step + IntersectionObserver.
                     */}
                    <div className="sj-grid" ref={gridRef}>

                        {/* JS-measured vertical connector (step 4 → step 5) */}
                        {conn.visible && (
                            <div
                                className="sj-vconn"
                                ref={connRef}
                                aria-hidden="true"
                                style={{
                                    left:   conn.left - 1,  /* -1 to centre the 2px line */
                                    top:    conn.top,
                                    height: conn.height,
                                }}
                            >
                                <div className="sj-vconn-line" />
                                <div className="sj-vconn-tip">
                                    <svg width="14" height="9" viewBox="0 0 14 9" fill="none">
                                        <path
                                            d="M1 1.5L7 7.5L13 1.5"
                                            stroke="#f97316"
                                            strokeWidth="2.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                        )}

                        {/* ── Row 1: Steps 1–4 (LTR, cols 1-2-3-4) ── */}
                        {rowOne.map(({ num, Icon, title, desc }, i) => (
                            <div
                                key={num}
                                data-step={num}
                                className="sj-step"
                                style={{ gridColumn: i + 1, gridRow: 1, '--i': i }}
                            >
                                {/* Horizontal connector → right (not on step 4) */}
                                {i < 3 && <div className="sj-hline sj-hline--r" aria-hidden="true" />}

                                <div className="sj-circle">
                                    <div className="sj-circle-pulse" />
                                    <span>{num}</span>
                                </div>

                                <div className="sj-card">
                                    <div className="sj-card-icon"><Icon size={18} /></div>
                                    <h4 className="sj-card-title">{title}</h4>
                                    <p className="sj-card-desc">{desc}</p>
                                    <span className="sj-card-chip">Step 0{num}</span>
                                </div>
                            </div>
                        ))}

                        {/*
                         * ── Row 2: Steps 5–8 (RTL, cols 4-3-2-1) ──
                         * DOM order stays ascending (5,6,7,8) but gridColumn is reversed
                         * so step-5 sits directly under step-4 and step-8 under step-1.
                         * Horizontal connectors extend LEFT (→ step-6, step-7, step-8).
                         */}
                        {rowTwo.map(({ num, Icon, title, desc }, i) => (
                            <div
                                key={num}
                                data-step={num}
                                className="sj-step"
                                style={{ gridColumn: 4 - i, gridRow: 2, '--i': i + 4 }}
                            >
                                {/* Horizontal connector → left (not on step 8 = last at col-1) */}
                                {i < 3 && <div className="sj-hline sj-hline--l" aria-hidden="true" />}

                                <div className="sj-circle">
                                    <div className="sj-circle-pulse" />
                                    <span>{num}</span>
                                </div>

                                <div className="sj-card">
                                    <div className="sj-card-icon"><Icon size={18} /></div>
                                    <h4 className="sj-card-title">{title}</h4>
                                    <p className="sj-card-desc">{desc}</p>
                                    <span className="sj-card-chip">Step 0{num}</span>
                                </div>
                            </div>
                        ))}

                    </div>{/* /sj-grid */}
                </div>{/* /sj-block */}

            </div>{/* /sj-container */}
        </section>
    );
}
