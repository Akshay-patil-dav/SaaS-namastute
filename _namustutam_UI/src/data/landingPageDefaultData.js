/**
 * landingPageDefaultData.js
 * Default content configuration for the Namustutam Landing Page.
 * Can be customized and saved dynamically via the Admin Panel.
 */

export const DEFAULT_LANDING_DATA = {
    // ── Hero Section ──────────────────────────────────────────────────────────
    hero: {
        badge: 'Freelance Software Developer • IT Solutions',
        titlePrefix: 'Building Digital',
        rotatingWords: ['Excellence', 'Innovation', 'Experiences', 'Solutions'],
        titleSuffix: 'For Modern Businesses',
        subtitle: 'I build custom software, POS solutions, business websites, and web applications tailored to your business needs — from idea to deployment',
        primaryBtnText: 'View Our Work',
        primaryBtnLink: '#portfolio',
        secondaryBtnText: 'Discuss Your Project',
        secondaryBtnLink: '#contact',
        floatingImages: [
            '/dashboard1.png',
            '/dashboard2.png',
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1531746790731-6c087fecd05a?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800'
        ]
    },

    // ── Services Section ──────────────────────────────────────────────────────
    services: [
        {
            id: 'srv-1',
            icon: '🌐',
            title: 'Web Development',
            desc: 'Custom WordPress & Shopify themes built for performance, conversion and scalability.',
            link: '/services/web-development',
            active: true
        },
        {
            id: 'srv-2',
            icon: '💻',
            title: 'SaaS Applications',
            desc: 'End-to-end multi-tenant application development with React and Spring Boot microservices.',
            link: '/services/saas-applications',
            active: true
        },
        {
            id: 'srv-3',
            icon: '📱',
            title: 'UI/UX Design',
            desc: 'Premium, user-centric interfaces crafted with modern glassmorphic and responsive aesthetics.',
            link: '/services/ui-ux-design',
            active: true
        },
        {
            id: 'srv-4',
            icon: '🛍️',
            title: 'E-commerce Solutions',
            desc: 'High-converting online stores engineered for maximum sales, instant loading and seamless checkout.',
            link: '/services/e-commerce-platform-development',
            active: true
        },
        {
            id: 'srv-5',
            icon: '🤖',
            title: 'AI Automation',
            desc: 'Integrate intelligent chatbots, voice automation and automated workflows to streamline operations.',
            link: '/services/ai-automation',
            active: true
        },
        {
            id: 'srv-6',
            icon: '🛠️',
            title: 'Dedicated Support',
            desc: '24/7 technical assistance, monitoring and post-launch maintenance to keep your business running smoothly.',
            link: '/contact',
            active: true
        }
    ],

    // ── Portfolio / Selected Works Showcase Section ───────────────────────────
    portfolioSection: {
        badge: 'Selected Works',
        title: 'Showcase of Brilliance',
        subtitle: 'Explore some of our recent flagship projects and enterprise solutions.'
    },

    // ── Selected Projects Showcase ────────────────────────────────────────────
    projects: [
        {
            id: 'proj-1792579126686',
            title: '10 life lessons from Neem Karoli Baba to teach your children',
            category: 'E-Commerce',
            filter: 'Web Application',
            price: '$99 USD',
            img: 'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA2265RL.img?w=1012&h=569&m=6&x=412&y=124&s=172&d=172',
            techStack: ['React', 'Spring Boot', 'PostgreSQL'],
            description: '',
            liveLink: 'http://localhost:5174',
            githubLink: '#',
            featured: true
        },
        {
            id: 'proj-2',
            title: 'Shopify Web Design & Consulting',
            category: 'Consulting',
            filter: 'Business Page',
            price: '$129 USD',
            img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
            techStack: ['React', 'Next.js', 'Node.js'],
            description: 'Growth consulting solutions designed to drive scalable commercial results.',
            liveLink: 'https://namustutam.vercel.app',
            githubLink: '#',
            featured: true
        },
        {
            id: 'proj-3',
            title: 'Clothing E-commerce Templates',
            category: 'Templates',
            filter: 'E-Commerce',
            price: '$99 USD',
            img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
            techStack: ['React', 'CSS3', 'Framer Motion'],
            description: 'Explore curated shopping experiences with travelers sharing authentic moments.',
            liveLink: 'https://namustutam.vercel.app',
            githubLink: '#',
            featured: true
        },
        {
            id: 'proj-4',
            title: 'MyITRDesk.com | Fullstack Web App',
            category: 'Fintech',
            filter: 'Web Application',
            price: '$199 USD',
            img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
            techStack: ['React', 'Spring Boot', 'PostgreSQL'],
            description: 'We blend financial security, automation, and intuitive visuals that convert.',
            liveLink: 'https://namustutam.vercel.app',
            githubLink: '#',
            featured: true
        },
        {
            id: 'proj-5',
            title: 'Namustutam POS Software | Multi-tenant SaaS',
            category: 'SaaS Platform',
            filter: 'SaaS Project',
            price: '$249 USD',
            img: '/dashboard1.png',
            techStack: ['React', 'Spring Boot', 'PostgreSQL', 'Docker'],
            description: 'A modern origin template for futuristic brands with real-time stock and billing.',
            liveLink: 'https://namustutam.vercel.app',
            githubLink: '#',
            featured: true
        },
        {
            id: 'proj-6',
            title: 'NatureLink India | Organic E-commerce',
            category: 'Retail',
            filter: 'E-Commerce',
            price: '$89 USD',
            img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
            techStack: ['Shopify', 'React', 'Analytics'],
            description: 'Building ideas, shaping identities, and creating meaningful shopping experiences.',
            liveLink: 'https://namustutam.vercel.app',
            githubLink: '#',
            featured: true
        }
    ],

    // ── SDLC & Process Roadmap ────────────────────────────────────────────────
    sdlcSteps: [
        { num: 1, title: 'Discovery', desc: 'Requirements gathering, stakeholder interviews, and project scoping to forge a crystal-clear roadmap.', icon: 'Search' },
        { num: 2, title: 'Design', desc: 'UX research, wireframes, and high-fidelity prototypes before a single line of code is written.', icon: 'PenTool' },
        { num: 3, title: 'Development', desc: 'Agile sprints with daily standups, CI/CD pipelines, and rigorous peer code-reviews at every step.', icon: 'Code2' },
        { num: 4, title: 'Testing', desc: 'Automated QA, security audits, load testing, and cross-device validation before go-live.', icon: 'ShieldCheck' },
        { num: 5, title: 'Launch', desc: 'Zero-downtime deployment with staged rollouts, rollback strategy, and dedicated go-live support.', icon: 'Rocket' },
        { num: 6, title: 'Onboard', desc: 'Team training, documentation hand-off, and a smooth transition so your staff fully own the product.', icon: 'Users' },
        { num: 7, title: 'Operate', desc: 'Ongoing maintenance, performance monitoring, feature iterations, and round-the-clock support.', icon: 'Settings' },
        { num: 8, title: 'Scale', desc: 'Architectural optimisations, auto-scaling infrastructure, and strategic capacity planning for growth.', icon: 'Activity' }
    ],

    // ── Team Members ──────────────────────────────────────────────────────────
    team: [
        {
            id: 'tm-1',
            name: 'Akshay Patil',
            role: 'Founder & Full-Stack / AI Engineer',
            badge: 'Freelance Architect',
            image: '/team/Akshay.png',
            bio: 'Passionate developer dedicated to delivering excellence in modern SaaS, POS, and AI architectures.',
            socials: {
                linkedin: 'https://linkedin.com',
                github: 'https://github.com',
                twitter: 'https://twitter.com',
                instagram: 'https://instagram.com'
            }
        },
        {
            id: 'tm-2',
            name: 'Santosh Patil',
            role: 'Business Strategy & Growth Lead',
            badge: 'Business Partner',
            image: '/team/sp.png',
            bio: 'Expert in client relationships, product-market fit, and scaling retail and digital ventures.',
            socials: {
                linkedin: 'https://linkedin.com',
                twitter: 'https://twitter.com'
            }
        },
        {
            id: 'tm-3',
            name: 'Amol Wagh',
            role: 'Senior Backend Engineer',
            badge: 'Core Contributor',
            image: '/team/wagh.png',
            bio: 'Specialist in Spring Boot microservices, high-throughput databases, and cloud security.',
            socials: {
                linkedin: 'https://linkedin.com',
                github: 'https://github.com'
            }
        }
    ],

    // ── Testimonials ──────────────────────────────────────────────────────────
    testimonials: [
        {
            id: 't-1',
            name: 'Priya Sharma',
            role: 'Owner, StyleHub Boutique',
            rating: 5,
            review: 'Namustutam transformed our retail operations. We cut manual billing work by 80% and our stock accuracy is now near-perfect.',
            avatar: 'P'
        },
        {
            id: 't-2',
            name: 'Rohan Mehta',
            role: 'Manager, FreshMart Supermarket',
            rating: 5,
            review: 'The POS and web integration is seamless. Our staff picked it up in minutes and customers love the speed of checkout.',
            avatar: 'R'
        },
        {
            id: 't-3',
            name: 'Ananya Kulkarni',
            role: 'CTO, TechRetail Co.',
            rating: 5,
            review: 'Best software development partner we have worked with. Clean React architecture, robust Spring Boot, and 24/7 responsiveness.',
            avatar: 'A'
        }
    ],

    // ── Marquee Ticker ────────────────────────────────────────────────────────
    marquee: {
        text: 'IT Services ✦ SaaS Development ✦ E-commerce Solutions ✦ Digital Transformation ✦ AI Automation ✦ Enterprise Cloud ✦ Custom POS ✦',
        speed: 40
    },

    // ── Top Announcement Banner ───────────────────────────────────────────────
    announcement: {
        enabled: false,
        text: '⚠️ Welcome to Namustutam — Custom Web Applications & Enterprise Software tailored to your scale! 🚀',
        bgColor: '#ff620b',
        textColor: '#ffffff',
        link: '/contact'
    },

    // ── Contact & Footer ──────────────────────────────────────────────────────
    contact: {
        brandName: 'Namustutam',
        brandDescription: 'Namustutam empowers businesses to scale and innovate with premium Web Development, SaaS Applications, AI Automation, and cutting-edge UI/UX Design tailored to your specific needs.',
        email: 'namustutam@gmail.com',
        phone: '+91 98765 43210',
        whatsapp: '+91 98765 43210',
        location: 'Remote / Global Software Consultancy',
        supportHours: 'Available 24/7 for Global Inquiries',
        copyright: '© 2026 Namustutam. All rights reserved.',
        socials: {
            github: 'https://github.com',
            linkedin: 'https://linkedin.com',
            twitter: 'https://twitter.com',
            instagram: 'https://instagram.com',
            discord: 'https://discord.com'
        }
    },

    // ── SEO & Meta ────────────────────────────────────────────────────────────
    seo: {
        pageTitle: 'Namustutam | Software Dev & Freelancer',
        metaDescription: 'I build custom software, POS solutions, business websites, and web applications tailored to your business needs — from idea to deployment.',
        keywords: 'software development, react, saas, freelance developer, pos, spring boot, e-commerce',
        author: 'Namustutam'
    },

    // ── AI Chatbot Assistant Configuration ────────────────────────────────────
    chatbot: {
        enabled: true,
        botName: 'Namustutam AI',
        botSubtitle: 'Online • AI Consultant',
        welcomeMessage: "Hello! 👋 I'm the Namustutam AI Assistant. Ask me anything about our software engineering services, SaaS platforms, or custom development!",
        provider: 'groq',
        model: 'llama-3.3-70b-versatile',
        apiKey: '',
        systemPrompt: '',
        quickPrompts: [
            'What services do you offer?',
            'Tell me about SaaS POS',
            'How much does a custom web app cost?',
            'How do I hire or contact you?'
        ]
    },

    // ── Section Visibility Controls (Enable / Disable View) ───────────────────
    sectionVisibility: {
        announcement: false,
        hero: true,
        sdlc: true,
        services: true,
        projects: true,
        testimonials: true,
        team: true,
        marquee: true,
        blogs: true,
        contact: true,
        chatbot: true
    }
};
