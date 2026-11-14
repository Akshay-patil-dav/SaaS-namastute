/**
 * landingPageDefaultData.js
 * Default content configuration for the Namustutam Landing Page.
 * Can be customized and saved dynamically via the Admin Panel.
 */

export const DEFAULT_LANDING_DATA = {
    // ── Hero Section ──────────────────────────────────────────────────────────
    hero: {
        greeting: 'Namaste!',
        namePrefix: "I'm",
        name: 'Akshay Patil',
        roleHighlight: 'Akshay Patil',
        paragraphs: [
            'a graphic designer & full-stack developer who enjoys turning ideas into clear and meaningful visuals. I work across social media, branding, digital campaigns & print design.',
            'My goal is simple - to create designs that not only look good, but also communicate clearly and help brands stand out.',
            'I focus on clean, thoughtful, and professional design that leaves a strong impression.'
        ],
        personImage: '/team/Akshay_namustutam.png',
        milestonesTitle: 'Creative',
        milestonesScript: 'Milestones',
        milestones: [
            { num: '21000+', label: 'Hours Behind the Screen' },
            { num: '2500+', label: 'Social Media Designs' },
            { num: '4+ Years', label: 'Creating & Designing' },
            { num: '30+', label: 'Clients Worked With' },
            { num: 'Designing for Multiple', label: 'MLAs of Assam', isSpecial: true }
        ],
        countingText: 'and still counting...',
        badge: 'Freelance Software Developer • IT Solutions',
        titlePrefix: 'Building Digital',
        rotatingWords: ['Solutions', 'Excellence', 'Innovation', 'Experiences'],
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

    // ── Legal & Policy CMS Content & Metadata ────────────────────────────────
    legal: {
        lastUpdated: 'November 12, 2026',
        jurisdiction: 'Maharashtra, India',
        refundReviewDays: '7',
        refundProcessingDays: '5–7 business days',
        privacy: {
            title: 'Privacy Policy',
            subtitle: 'How Namustutam collects, protects, and handles your personal, store, and business data.',
            sections: [
                {
                    id: 'introduction',
                    shortTitle: '1. Introduction',
                    heading: '1. Introduction & Scope',
                    paragraphs: [
                        'Welcome to {brandName}. This Privacy Policy explains how {brandName} collects, uses, stores, discloses, and safeguards your personal and business information when you visit our website, book a consultation, or use our cloud POS and SaaS platforms.',
                        'By accessing our website or registering for {brandName} POS Software, you agree to the data practices described in this policy.'
                    ],
                    note: 'Effective Date: {lastUpdated}. We never sell your personal contact details or your store\'s inventory, sales, or customer records to third-party brokers.'
                },
                {
                    id: 'information-collected',
                    shortTitle: '2. Information We Collect',
                    heading: '2. Information We Collect',
                    paragraphs: [
                        'Depending on how you interact with our website and software products, we collect only the information required to operate and support your services:'
                    ],
                    bullets: [
                        {
                            title: 'Account & Contact Information',
                            text: 'Your full name, business or store name, email address, phone/WhatsApp number, city, and inquiry details submitted through our contact or demo forms.'
                        },
                        {
                            title: 'POS & Store Operational Data',
                            text: 'Product catalogs, inventory levels, GST tax settings, invoices, supplier/customer ledger (Khata) records, and store staff roles managed inside your tenant workspace.'
                        },
                        {
                            title: 'Billing & Transaction Metadata',
                            text: 'Subscription plan tier (Starter, Growth, or Premium), billing timestamps, and payment verification references processed securely via Razorpay or authorized payment partners. We do not store raw card numbers or UPI PINs.'
                        },
                        {
                            title: 'Technical & Usage Logs',
                            text: 'IP address, browser type, device characteristics, session status, and error diagnostics needed to maintain security and uptime.'
                        }
                    ]
                },
                {
                    id: 'how-we-use',
                    shortTitle: '3. How We Use Data',
                    heading: '3. How We Use Your Information',
                    paragraphs: [
                        '{brandName} uses collected information strictly to deliver, maintain, and improve our software and engineering services:'
                    ],
                    bullets: [
                        'Create, authenticate, and manage your merchant or client workspace and staff access permissions.',
                        'Process monthly POS software subscriptions, generate GST-compliant receipts, and send WhatsApp digital invoices when enabled by your store.',
                        'Respond to demo requests, contact inquiries, onboarding requests, and technical support tickets.',
                        'Detect and prevent unauthorized access, automated abuse, or security incidents.',
                        'Comply with applicable tax, accounting, and legal obligations.'
                    ]
                },
                {
                    id: 'data-sharing',
                    shortTitle: '4. Sharing & Processors',
                    heading: '4. Third-Party Processors & Disclosure',
                    paragraphs: [
                        'We share limited data only with trusted infrastructure and service providers strictly necessary to run the platform:'
                    ],
                    bullets: [
                        {
                            title: 'Payment Gateways',
                            text: 'Razorpay and banking partners used to verify subscription orders and prevent payment fraud.'
                        },
                        {
                            title: 'Cloud & Database Infrastructure',
                            text: 'Managed hosting, PostgreSQL storage, and encrypted backup providers with restricted access controls.'
                        },
                        {
                            title: 'Messaging & Notifications',
                            text: 'Email and WhatsApp Business delivery services triggered directly by your store actions or support requests.'
                        },
                        {
                            title: 'Legal Compliance',
                            text: 'Disclosure required by a valid court order, statutory authority, or law enforcement request.'
                        }
                    ]
                },
                {
                    id: 'data-security',
                    shortTitle: '5. Security & Storage',
                    heading: '5. Data Security & Storage Standards',
                    paragraphs: [
                        'We enforce modern security controls to protect tenant records, passwords, and sensitive client information:',
                        'All communication is encrypted via TLS/HTTPS, passwords use BCrypt salting, API access is gated by signed JWTs, and database snapshots are encrypted at rest.'
                    ],
                    bullets: [
                        'Tenant-level data isolation ensures one store never sees another merchant\'s sales or customer database.',
                        'Role-Based Access Control (RBAC) restricts sensitive actions to verified administrators.',
                        'Automated vulnerability reviews and audit logging monitor system integrity.'
                    ]
                },
                {
                    id: 'rights',
                    shortTitle: '6. Your Privacy Rights',
                    heading: '6. Your Privacy Rights & Choices',
                    paragraphs: [
                        'Depending on your jurisdiction, you have the right to request access to the personal data we hold about you, request corrections to inaccurate entries, or ask for account deletion.'
                    ],
                    bullets: [
                        'Export your product catalog, sales invoices, and customer Khata ledger in standard formats (Excel, CSV) anytime from your POS dashboard.',
                        'Update or modify your contact information through the Admin Panel or store settings.',
                        'Request total account termination and tenant database purge by emailing our privacy desk.'
                    ]
                },
                {
                    id: 'retention',
                    shortTitle: '7. Data Retention',
                    heading: '7. Data Retention & Deletion Timeline',
                    paragraphs: [
                        'Active accounts: We retain your operational data for the active lifetime of your subscription or service engagement.',
                        'Cancelled or inactive accounts: Upon cancellation or prolonged inactivity (over 180 days after subscription expiry), you may download a data export. After the retention window, merchant records are scheduled for secure deletion, except tax records required by law.'
                    ]
                },
                {
                    id: 'updates',
                    shortTitle: '8. Updates & Contact',
                    heading: '8. Policy Updates & Inquiries',
                    paragraphs: [
                        'We may update this Privacy Policy from time to time to reflect operational or legal enhancements. Changes will be posted to this page with an updated Effective Date.',
                        'If you have questions about our data practices or wish to submit a privacy request, please contact our team via our official contact channels.'
                    ]
                }
            ]
        },
        terms: {
            title: 'Terms of Service',
            subtitle: 'The legal terms and operational conditions governing your use of Namustutam services and cloud POS platforms.',
            sections: [
                {
                    id: 'acceptance',
                    shortTitle: '1. Acceptance',
                    heading: '1. Acceptance of Terms',
                    paragraphs: [
                        'These Terms of Service ("Terms") govern your access to and use of the {brandName} website, custom software engineering services, and the {brandName} cloud POS & Retail SaaS platform.',
                        'By accessing our website, creating an account, or executing a project agreement with us, you confirm that you have the authority to accept these Terms on behalf of yourself or your business.'
                    ]
                },
                {
                    id: 'services-scope',
                    shortTitle: '2. Services Covered',
                    heading: '2. Services & Platform Scope',
                    paragraphs: [
                        '{brandName} provides two primary categories of services:'
                    ],
                    bullets: [
                        {
                            title: 'Namustutam POS & Retail SaaS',
                            text: 'Cloud-hosted point-of-sale billing, inventory management, multi-store sync, digital Khata ledger, GST reporting, and WhatsApp receipt automation offered on monthly subscription plans.'
                        },
                        {
                            title: 'Custom Software & Web Engineering',
                            text: 'Custom web applications, e-commerce platforms, SaaS MVPs, UI/UX design systems, and AI automation workflows delivered under agreed project proposals and milestones.'
                        }
                    ]
                },
                {
                    id: 'accounts',
                    shortTitle: '3. Accounts & Security',
                    heading: '3. Merchant Accounts & Responsibilities',
                    paragraphs: [
                        'When registering a store or administrative workspace, you agree to provide accurate business details and keep your login credentials confidential.',
                        'You are responsible for managing staff user roles, counter permissions, and tax/GST rates configured in your POS account. Notify us immediately if you suspect unauthorized access.'
                    ]
                },
                {
                    id: 'billing-plans',
                    shortTitle: '4. Monthly Plans & Billing',
                    heading: '4. Monthly Subscriptions & Pricing',
                    paragraphs: [
                        '{brandName} POS Software operates on transparent monthly billing cycles (30-day access periods) with no hidden fees or forced annual lock-in:'
                    ],
                    bullets: [
                        {
                            title: 'Starter Plan (₹499 / month)',
                            text: '1 store location, up to 1,000 products, POS billing & inventory, basic sales analytics, and WhatsApp/email support.'
                        },
                        {
                            title: 'Growth Plan (₹999 / month)',
                            text: 'Up to 3 store locations, unlimited products, POS & online order management, advanced analytics, barcode/QR printing, multi-role staff access, and priority support.'
                        },
                        {
                            title: 'Premium Plan (₹1,999 / month)',
                            text: 'Unlimited locations and products, all channels & API access, custom analytics/exports, dedicated account manager, white-label option, and 99.9% uptime SLA.'
                        }
                    ],
                    note: 'Plan fees are billed in advance for each 30-day cycle via authorized payment gateways. You may upgrade or cancel before your next renewal date.'
                },
                {
                    id: 'acceptable-use',
                    shortTitle: '5. Acceptable Use',
                    heading: '5. Acceptable Use & Restrictions',
                    paragraphs: [
                        'You agree not to misuse our platform or attempt to disrupt service reliability for other merchants. Prohibited actions include:'
                    ],
                    bullets: [
                        'Attempting unauthorized vulnerability scanning, reverse engineering, or penetration testing without prior written consent.',
                        'Using the POS platform to process illegal, counterfeit, or prohibited goods under local or national laws.',
                        'Scraping, automated bulk querying, or sublicensing tenant access to unauthorized third parties.',
                        'Transmitting malicious payloads, spyware, or phishing attempts through form endpoints or integrated messaging.'
                    ]
                },
                {
                    id: 'ip-ownership',
                    shortTitle: '6. IP & Data Ownership',
                    heading: '6. Intellectual Property & Store Data Ownership',
                    paragraphs: [
                        'Your Data Belongs to You: You retain 100% full ownership, rights, and title to your catalog, pricing, customer lists, invoices, and transaction records uploaded to the POS platform.',
                        'Platform IP: {brandName} retains all proprietary rights, trademarks, patents, source code, UI designs, and documentation comprising the POS SaaS system and website.'
                    ]
                },
                {
                    id: 'sla-uptime',
                    shortTitle: '7. Uptime & Support',
                    heading: '7. Platform Availability & Support SLA',
                    paragraphs: [
                        'We work continuously to provide a fast, dependable, and high-uptime billing experience.',
                        'Scheduled maintenance windows are announced in advance. Our target cloud service availability is 99.9% uptime for cloud point-of-sale services.'
                    ],
                    bullets: [
                        'Online Support Desk: Operational Monday through Saturday during regular business hours.',
                        'Critical Checkout Outages: P1 incidents receive expedited response from our on-call engineering team.'
                    ]
                },
                {
                    id: 'liability',
                    shortTitle: '8. Liability Limits',
                    heading: '8. Limitation of Liability & Warranties',
                    paragraphs: [
                        '{brandName} provides cloud services on an "as is" and "as available" basis. While we maintain rigorous backups and automated checks, we do not guarantee uninterrupted operation free from third-party Internet disruptions or hardware incompatibilities.',
                        'To the maximum extent permitted by applicable law, {brandName}\'s aggregate liability for any claims arising under these Terms is limited to the subscription fees paid by you in the preceding three (3) months.'
                    ]
                },
                {
                    id: 'termination',
                    shortTitle: '9. Suspension & Cancellation',
                    heading: '9. Term, Suspension & Termination',
                    paragraphs: [
                        'You may cancel your monthly subscription at any time prior to renewal from your account billing tab.',
                        'We reserve the right to suspend or terminate service access with reasonable notice in cases of non-payment, verified security risks, or material violations of these Terms.'
                    ]
                },
                {
                    id: 'governing-law',
                    shortTitle: '10. Governing Law',
                    heading: '10. Governing Law & Dispute Resolution',
                    paragraphs: [
                        'These Terms are governed by and construed in accordance with the substantive laws of {jurisdiction}, without regard to conflict of law principles.',
                        'Any disputes arising from these Terms shall be resolved through friendly mutual consultation, and if unresolved, through the competent courts located in {jurisdiction}.'
                    ]
                }
            ]
        },
        cookies: {
            title: 'Cookie Policy',
            subtitle: 'How we utilize cookies, local session storage, and security tokens across our web platforms.',
            sections: [
                {
                    id: 'what-are-cookies',
                    shortTitle: '1. What Are Cookies',
                    heading: '1. What Are Cookies & Local Storage?',
                    paragraphs: [
                        'Cookies and browser storage (such as localStorage and sessionStorage) are small files stored on your device when you visit {brandName} websites or sign in to our POS web application.',
                        'They help keep your session secure, remember your currency or workspace settings, and make pages load faster on repeat visits.'
                    ]
                },
                {
                    id: 'cookies-we-use',
                    shortTitle: '2. Categories We Use',
                    heading: '2. Categories of Cookies & Storage We Use',
                    paragraphs: [
                        'We classify our storage mechanisms into three distinct tiers:'
                    ],
                    bullets: [
                        {
                            title: '1. Strictly Necessary & Authentication Tokens (Required)',
                            text: 'Essential for you to log in, maintain admin/merchant sessions, remember security credentials, and keep shopping cart and billing counters active. These cannot be disabled.'
                        },
                        {
                            title: '2. Preference & Customization Tokens (Optional)',
                            text: 'Stores UI theme choices (dark/light mode), default invoice currency, sidebar expanded/collapsed state, and table pagination sizing.'
                        },
                        {
                            title: '3. Performance & Diagnostics (Optional)',
                            text: 'Helps us measure page load times, detect UI rendering bottlenecks, and assess feature adoption without tracking individual identities across the web.'
                        }
                    ],
                    note: 'We do not sell cookie data or run invasive third-party cross-site advertising trackers on our platforms.'
                },
                {
                    id: 'third-party-cookies',
                    shortTitle: '3. Third Parties',
                    heading: '3. Third-Party Services & Integrations',
                    paragraphs: [
                        'Some third-party tools embedded in our website may store session indicators:'
                    ],
                    bullets: [
                        {
                            title: 'Payment Processors (Razorpay)',
                            text: 'Temporary tokens used to verify payment security, 3D Secure challenges, and fraud protection during checkout.'
                        },
                        {
                            title: 'Vercel Analytics & Hosting',
                            text: 'Aggregated, privacy-friendly telemetry assessing page load performance and regional latency.'
                        },
                        {
                            title: 'External Fonts & CDN Assets',
                            text: 'Standard caching headers applied by global delivery networks to make website icons and fonts render swiftly.'
                        }
                    ]
                },
                {
                    id: 'manage-cookies',
                    shortTitle: '4. Cookie Management',
                    heading: '4. Managing Your Cookie Preferences',
                    paragraphs: [
                        'You have full control over cookie storage through your browser settings and our built-in preferences switcher:',
                        'You can clear cookies at any time through your browser history, or configure your browser to block third-party cookies by default.'
                    ],
                    bullets: [
                        'Chrome: Settings → Privacy & Security → Cookies and other site data.',
                        'Firefox: Settings → Privacy & Security → Cookies and Site Data.',
                        'Safari: Preferences → Privacy → Block all cookies.'
                    ]
                },
                {
                    id: 'updates',
                    shortTitle: '5. Policy Updates',
                    heading: '5. Policy Updates & Inquiries',
                    paragraphs: [
                        'We may update this Cookie Policy when we introduce new features or integrate new trusted services. Check back periodically for updates.',
                        'If you have questions regarding our use of cookies or privacy settings, contact our privacy desk.'
                    ]
                }
            ]
        },
        refunds: {
            title: 'Refund & Cancellation Policy',
            subtitle: 'Clear, transparent rules regarding POS software subscriptions, trials, and refund eligibility.',
            sections: [
                {
                    id: 'overview',
                    shortTitle: '1. Overview',
                    heading: '1. Fair & Transparent Refund Overview',
                    paragraphs: [
                        'At {brandName}, we aim for complete transparency across both our monthly POS Software subscriptions and our custom software/web engineering engagements.',
                        'Because our POS software runs exclusively on flexible 30-day monthly plans (with no annual lock-in), you are always in control of your renewals.'
                    ]
                },
                {
                    id: 'pos-subscriptions',
                    shortTitle: '2. POS Monthly Plans',
                    heading: '2. POS Software Monthly Subscriptions',
                    paragraphs: [
                        'All POS SaaS plans — Starter (₹499/month), Growth (₹999/month), and Premium (₹1,999/month) — follow these billing and refund terms:'
                    ],
                    bullets: [
                        {
                            title: 'Cancel Anytime Before Renewal',
                            text: 'You may cancel or choose not to renew your monthly subscription at any time before the end of your current 30-day cycle with zero cancellation penalty.'
                        },
                        {
                            title: '{refundReviewDays}-Day First-Time Billing Review',
                            text: 'If you experience a duplicate charge, accidental payment, or unresolved critical technical blocker within {refundReviewDays} calendar days of your initial subscription purchase, contact our support team for a full or pro-rated refund review.'
                        },
                        {
                            title: 'Active Cycle Usage',
                            text: 'Once a monthly billing cycle has been actively used beyond the initial review window, partial-month refunds are generally not issued; however, your workspace remains active until the end of the paid 30-day period.'
                        }
                    ]
                },
                {
                    id: 'custom-projects',
                    shortTitle: '3. Custom Development',
                    heading: '3. Custom Software, Web & AI Projects',
                    paragraphs: [
                        'For custom software, bespoke web applications, e-commerce stores, and AI automation contracts:'
                    ],
                    bullets: [
                        {
                            title: 'Milestone-Based Releases',
                            text: 'Custom engagements are billed based on pre-approved milestones (e.g. Discovery & Architecture, UI/UX Prototypes, Development, Staging Review, and Final Production Deployment).'
                        },
                        {
                            title: 'Deposit & Upfront Retainers',
                            text: 'Initial mobilization deposits are non-refundable once engineering research, sprint planning, or UI design work has commenced.'
                        },
                        {
                            title: 'Dispute & Scope Changes',
                            text: 'If a project is paused or discontinued mutually prior to final sign-off, payments are reconciled against the actual completed deliverables, hours committed, and staging assets delivered.'
                        }
                    ]
                },
                {
                    id: 'how-to-request',
                    shortTitle: '4. How to Request',
                    heading: '4. How to Request a Refund or Cancellation',
                    paragraphs: [
                        'Submitting a billing review or refund inquiry is straightforward:'
                    ],
                    bullets: [
                        'Submit your request within the applicable refund window with your registered account email, merchant store name, and Razorpay transaction reference.',
                        'Include a brief description of the billing reason (e.g., accidental duplicate charge or technical impediment).',
                        'Our billing desk acknowledges all requests within 24 to 48 hours.'
                    ]
                },
                {
                    id: 'processing-time',
                    shortTitle: '5. Processing Time',
                    heading: '5. Refund Method & Processing Time',
                    paragraphs: [
                        'Approved refunds are credited back directly to the original payment source (bank account, UPI, debit/credit card) used during checkout.',
                        'Financial processing timeline: Razorpay and banking networks typically reflect the returned amount within {refundProcessingDays} from the date of refund approval.'
                    ],
                    note: '{brandName} does not levy any administrative or processing penalty on approved refund disbursements.'
                },
                {
                    id: 'contact-support',
                    shortTitle: '6. Support Desk',
                    heading: '6. Escalations & Support Desk',
                    paragraphs: [
                        'If you have questions about an invoice, renewal reminder, or need assistance modifying your subscription tier, reach out to our team.',
                        'Our customer support team is available Monday through Saturday to ensure your retail business runs without disruption.'
                    ]
                }
            ]
        }
    },

    // ── POS Software Flagship Showcase & Pricing ────────────────────────────
    posSoftware: {
        stats: [
            {
                id: 'total',
                target: 15,
                prefix: '',
                accent: '+',
                title: 'Total Clients',
                label: 'Retail businesses actively using Namustutam POS across modern retail & boutiques'
            },
            {
                id: 'online',
                target: 5,
                prefix: '',
                accent: '+',
                title: 'Online Customers',
                label: 'Cloud-connected stores running live web billing, e-invoicing & WhatsApp sync'
            },
            {
                id: 'offline',
                target: 10,
                prefix: '',
                accent: '+',
                title: 'Offline Customers',
                label: 'In-store counter & desktop billing clients operating reliably with zero downtime'
            },
            {
                id: 'speed',
                target: 2,
                prefix: '< ',
                accent: 's',
                title: 'Checkout Speed',
                label: 'Average barcode scan & thermal receipt completion time per customer queue'
            }
        ],
        pricingPlans: [
            {
                id: 'STARTER',
                name: 'Starter POS',
                monthly: '399',
                sub: 'Essential tools for single-counter retail stores and boutique shops.',
                billedNote: '₹399 billed monthly • Cancel anytime',
                badge: '',
                featured: false,
                ctaLabel: 'Get Started Free',
                ctaHref: 'https://billing.namustutam.in/register',
                features: [
                    '1 POS Billing Register',
                    '1 Store Location',
                    'Up to 1,500 Active SKUs',
                    'Unlimited GST Sales Invoices',
                    'Barcode Scanner & Thermal Print',
                    'Basic WhatsApp Digital Bills'
                ]
            },
            {
                id: 'GROWTH',
                name: 'Growth Retail',
                monthly: '799',
                sub: 'Multi-counter billing, batch control, and Khata tools for busy stores.',
                billedNote: '₹799 billed monthly • Cancel anytime',
                badge: 'MOST POPULAR',
                featured: true,
                ctaLabel: 'Upgrade Now →',
                ctaHref: 'https://billing.namustutam.in/register',
                features: [
                    'Up to 3 POS Registers',
                    '2 Store Outlets Included',
                    'Unlimited Products & Catalog',
                    'Customer Digital Khata Ledger',
                    'Batch Number & Expiry Tracking',
                    'Automated WhatsApp Reminders'
                ]
            },
            {
                id: 'ENTERPRISE',
                name: 'Enterprise Chain',
                monthly: '1,599',
                sub: 'Full operating control for retail chains, franchises, and warehouses.',
                billedNote: '₹1,599 billed monthly • Dedicated Support',
                badge: '',
                featured: false,
                ctaLabel: 'Contact Sales',
                ctaHref: '#demo',
                features: [
                    'Unlimited POS Registers',
                    'Unlimited Stores & Warehouses',
                    'Centralized Pricing & Catalog Sync',
                    'Inter-Warehouse Stock Gate Passes',
                    'Granular Staff Role Permissions',
                    'Dedicated Onboarding & Priority SLA'
                ]
            }
        ],
        demoInfo: {
            tag: 'GET IN TOUCH',
            title: 'See Namustutam POS In Action With a Retail Specialist',
            description: 'Request a personalized 15-minute walkthrough tailored to your retail category. We\'ll demonstrate live barcode scanning, bill printing, inventory setup, and data migration.',
            bullets: [
                'Free 14-day full featured trial account',
                'Free product catalog migration from Excel, Tally, or Busy',
                'Zero setup fee, zero card details required'
            ],
            whatsappCta: 'Quick WhatsApp Chat with POS Expert →'
        }
    },

    // ── Section Visibility Controls (Enable / Disable View) ───────────────────
    sectionVisibility: {
        topContactBar: false,
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
        chatbot: true,
        posSoftware: true,
        legal: true
    }
};
