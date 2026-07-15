import { useState } from 'react';

const testimonials = [
    {
        company: 'OSCILAR',
        quote: '"We wanted to do something really cool with 3D, really bring our brand to life, and Spline was the only tool that would let me do that."',
        highlight: 'appeal to an enterprise audience.',
        author: 'Andrew Pons',
        role: 'Principal Brand Designer',
        color: '#3B82F6',
    },
    {
        company: 'Resend',
        quote: '"With Spline, we can create interactive 3D objects that make our product feel tangible. It\'s more than decoration. It\'s how we show we care about the details."',
        highlight: 'create interactive 3D objects that make our product feel tangible.',
        author: 'Zeh Fernandes',
        role: 'Founding Designer',
        color: '#8B5CF6',
    },
    {
        company: 'Koji Studio',
        quote: '"Spline is very easy and fast to learn. The learning curve is low, even junior designers can step in and integrate 3D experiences into a Webflow project."',
        highlight: 'very easy and fast to learn.',
        author: 'Pavel Dergachev',
        role: 'Founder & Creative Director',
        color: '#10B981',
    },
];

const Testimonials = () => {
    const [active, setActive] = useState(0);

    return (
        <section className="testimonials" id="testimonials">
            <div className="container">
                <div className="testimonials__header fade-in" style={{ textAlign: 'center', marginBottom: '64px' }}>
                    <h2 className="section-title">
                        Loved by innovative teams<br />
                        <span className="section-title-gradient">around the world</span>
                    </h2>
                </div>

                <div className="testimonials__carousel fade-in">
                    <div className="testimonial-card" key={active}>
                        <div className="testimonial-card__company" style={{ color: testimonials[active].color }}>
                            {testimonials[active].company}
                        </div>
                        <blockquote className="testimonial-card__quote">
                            {testimonials[active].quote}
                        </blockquote>
                        <div className="testimonial-card__author">
                            <div className="testimonial-card__avatar" style={{ background: testimonials[active].color }}>
                                {testimonials[active].author.charAt(0)}
                            </div>
                            <div>
                                <div className="testimonial-card__name">{testimonials[active].author}</div>
                                <div className="testimonial-card__role">{testimonials[active].role}</div>
                            </div>
                        </div>
                    </div>

                    <div className="testimonials__dots">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                className={`testimonials__dot ${i === active ? 'active' : ''}`}
                                onClick={() => setActive(i)}
                                id={`testimonial-dot-${i}`}
                                aria-label={`Testimonial ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
