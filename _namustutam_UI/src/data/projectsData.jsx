import { FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaJs } from 'react-icons/fa';
import { SiMongodb, SiTypescript, SiExpress, SiPostgresql } from 'react-icons/si';
import p1 from "../assets/project/p1.png";
import p2 from "../assets/project/p2.jpg";
import p3 from "../assets/project/p3.jpg";
import p4 from "../assets/project/p6.png";
import p5 from "../assets/project/p5.png";
import p7 from "../assets/project/p7.png"
// import p4 from from "./"

export const projectsData = [
    {
        title: 'Krón',
        author: 'Pranasari',
        category: 'NEW',
        filter: 'Business Page',
        price: '$59 USD',
        img: p1, 
        techStack: [{ name: 'React', icon: <FaReact />, color: '#8b5cf6' }],
        description: 'Design beyond limits. A sharp visual execution for eye-popping brands.',
        liveLink: '#', githubLink: '#'
    },
    {
        title: 'Frentavo',
        author: 'Flow Design Agency',
        category: 'NEW',
        filter: 'Business Page',
        price: '$129 USD',
        img: p2,
        techStack: [{ name: 'React', icon: <FaReact />, color: '#8b5cf6' }],
        description: 'Growth consulting solutions designed to drive results.',
        liveLink: '#', githubLink: '#'
    },
    {
        title: 'Safeers',
        author: 'Weabers',
        category: 'NEW',
        filter: 'SaaS Project',
        price: '$99 USD',
        img: p3,
         techStack: [{ name: 'React', icon: <FaReact />, color: '#8b5cf6' }],
        description: 'Explore the best natural places with travelers sharing lovely moments.',
        liveLink: '#', githubLink: '#'
    },
    {
        title: 'Fullstack Studio',
        author: 'Div Supply',
        category: 'NEW',
        filter: 'E-Commerce',
        price: '$99 USD',
        img: p4 ,
          techStack: [{ name: 'React', icon: <FaReact />, color: '#8b5cf6' }],
        description: 'We blend creativity and visuals that are functional.',
        liveLink: '#', githubLink: '#'
    },
    {
        title: 'ORIGIN®',
        author: 'Creative UI',
        category: 'NEW',
        filter: 'Business Page',
        price: '$49 USD',
        img: p5,
          techStack: [{ name: 'React', icon: <FaReact />, color: '#8b5cf6' }],
        description: 'A modern origin template for futuristic brands.',
        liveLink: '#', githubLink: '#'
    },
    {
        title: 'ORVO',
        author: 'Design Flow',
        category: 'NEW',
        filter: 'SaaS Project',
        price: '$89 USD',
        img: p7,
        techStack: [{ name: 'React', icon: <FaReact />, color: '#8b5cf6' }],
        description: 'Building ideas, shaping identities, and creating meaningful experiences.',
        liveLink: '#', githubLink: '#'
    },
    {
        title: 'Buy. Sell. Rent',
        author: 'RealEstate Co',
        category: 'NEW',
        filter: 'E-Commerce',
        price: '$149 USD',
        img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
        techStack: [{ name: 'React', icon: <FaReact />, color: '#8b5cf6' }],
        description: 'Curated properties for refined living.',
        liveLink: '#', githubLink: '#'
    },
    {
        title: 'AXURE',
        author: 'UX Studio',
        category: 'NEW',
        filter: 'Business Page',
        price: '$79 USD',
        img: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800',
        techStack: [{ name: 'React', icon: <FaReact />, color: '#8b5cf6' }],
        description: 'Focused, intentional, human-centered design for brands that want to stand out.',
        liveLink: '#', githubLink: '#'
    }
];
