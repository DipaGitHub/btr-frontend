import { API_BASE_URL } from '../../utils/apiConfig';
import { useEffect, useState, useRef } from 'react'
import { ArrowUpRight, ChevronDown, Code2, MonitorCog, Brain, MousePointerClick, Lightbulb, Mountain, TrendingUp, Settings } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { go } from '../../utils/navigation'
import { Reveal } from '../../components/shared/Reveal'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const fallbackReviews = [
  { initials: 'MC', name: 'Michael Chen', role: 'CTO · GLOBAL SOLUTIONS INC', rating: 5, text: 'Outstanding service and innovative solutions. They truly understand business technology.' },
  { initials: 'ER', name: 'Emily Rodriguez', role: 'DIRECTOR · INNOVATION LABS', rating: 5, text: 'A strategic partner that delivers results. Highly recommended for digital transformation.' },
  { initials: 'DL', name: 'David Lee', role: 'VP OF OPERATIONS · FUTURE DYNAMICS', rating: 4, text: 'The team exceeded all expectations. We saw a 30% increase in efficiency within the first quarter.' },
  { initials: 'SJ', name: 'Sarah Johnson', role: 'CEO · TECHCORP INDUSTRIES', rating: 5, text: 'Geemadhura Innovations transformed our business operations. Their expertise and dedication are unmatched.' },
  { initials: 'DC', name: 'Debraj Chakraborty', role: 'SR SOFTWARE DEVELOPER · GOOGLE', rating: 4, text: 'Great team culture and technical expertise in execution.' },
  { initials: 'SK', name: 'Shovan Kantal', role: 'DEVELOPER · BTR TECH', rating: 4, text: 'Clear communication and fast delivery of product requirements.' },
]

const fallbackFaqs = [
  { id: 8, qus: 'What is the total cost?', answers: 'Every project is scoped around its goals, complexity, timeline, and support requirements. We provide a clear quote before work begins.' },
  { id: 7, qus: 'Do you guarantee results?', answers: 'We set practical goals, measure performance, and optimize continuously. Exact outcomes depend on the market, audience, and project scope.' },
  { id: 6, qus: 'Can you help with SEO too?', answers: 'Yes. We support technical SEO, content strategy, on-page optimization, local visibility, and performance reporting.' },
  { id: 5, qus: 'Is there WhatsApp support?', answers: 'Yes. Our team provides convenient WhatsApp communication throughout active projects and support periods.' },
  { id: 4, qus: 'Do you offer technical support?', answers: 'Yes. Flexible post-launch support covers maintenance, updates, performance, security, and future improvements.' },
  { id: 3, qus: 'How long does a website take?', answers: 'Most websites move through discovery, design, development, testing, and launch within an agreed project timeline.' },
  { id: 2, qus: 'What if my requirements change?', answers: 'We review the new requirement with you, explain any timeline or cost impact, and agree on the change before proceeding.' },
  { id: 1, qus: 'Can you work with an existing website?', answers: 'Absolutely. We can audit, redesign, optimize, maintain, or extend an existing website and its technology stack.' },
]

export function DigitalExcellence() {
  return (
    <section className="digital-excellence relative">
      <div className="digital-excellence-bg" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div 
          style={{
            backgroundImage: "url('/digital-excellence-bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            width: '100%',
            height: '100%',
            position: 'absolute',
            inset: 0,
            zIndex: -1
          }}
        />
        <div className="digital-excellence-overlay"></div>
      </div>
      <Reveal direction="right" delay={0.12}>
        <div className="digital-copy">
          <span className="section-kicker">BUILT FOR PROGRESS</span>
          <h2>Driving Digital Excellence:<br />Unleash the Power of BTR Communication</h2>
          <p>BTR Communication provides professional digital solutions to help businesses establish and grow their online presence. Our services include website design and development, e-commerce solutions, UI/UX design, website maintenance, and performance optimization.</p>
          <button className="button" onClick={() => go('/services')}>Discover more <ArrowUpRight size={16} /></button>
        </div>
      </Reveal>
    </section>
  )
}

export function ServicesSection() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/services`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data && Array.isArray(json.data)) {
          const baseUrl = API_BASE_URL
          const formatted = json.data.map((service) => {
            let imageUrl = service.image_url || service.icon || ''
            if (imageUrl.startsWith('/')) {
              imageUrl = `${baseUrl}${imageUrl}`
            }
            return {
              id: service.id,
              title: service.title || service.name,
              description: service.description || service.short_description,
              image: imageUrl,
            }
          })
          setServices(formatted)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch services:', err)
        setLoading(false)
      })
  }, [])

  return (
    <section className="home-services section-dark" style={{ padding: '60px 20px' }}>
      <SectionTitle
        eyebrow="OUR SERVICES"
        title="Focused expertise for every stage of your digital journey."
      />
      {!loading && services.length > 0 && (
        <div
          className="services-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            maxWidth: '1140px',
            margin: '40px auto 0 auto',
          }}
        >
          {services.map((service) => (
            <article
              key={service.id}
              className="service-card"
              style={{
                backgroundColor: '#11141c',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <div
                className="service-icon-wrapper"
                style={{
                  width: '48px',
                  height: '48px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {service.image ? (
                  <img
                    src={service.image}
                    alt={service.title}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : (
                  <Code2 color="#ff4d4d" size={32} />
                )}
              </div>
              <h3 style={{ color: '#ffffff', fontSize: '20px', marginBottom: '12px' }}>
                {service.title}
              </h3>
              <p style={{ color: '#a0a6b5', fontSize: '14px', lineHeight: '1.6' }}>
                {service.description}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export function Testimonials() {
  const [reviews, setReviews] = useState(fallbackReviews)
  const [loading, setLoading] = useState(true)
  const swiperRef = useRef(null)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/testimonials`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          const baseUrl = API_BASE_URL
          const formatted = json.data.map((item) => {
            const initials = item.client_name
              ? item.client_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
              : 'CL'
            let imageUrl = item.image_url || ''
            if (imageUrl.startsWith('/public')) imageUrl = `${baseUrl}${imageUrl}`
            const role = [item.client_position, item.client_company].filter(Boolean).join(' • ').toUpperCase()
            return {
              id: item.client_name + item.client_company,
              initials, name: item.client_name,
              role: role || 'VALUED CLIENT',
              rating: Number(item.review_stars) || 5,
              text: item.comment, image: imageUrl,
            }
          })
          setReviews(formatted)
        }
        setLoading(false)
      })
      .catch((err) => { console.error('Failed to fetch testimonials:', err); setLoading(false) })
  }, [])

  return (
    <section className="home-testimonials">
      <Reveal direction="up">
        <SectionTitle eyebrow="CLIENT STORIES" title="Client Feedback & Reviews" />
      </Reveal>
      {!loading && reviews.length > 0 && (
        <Reveal direction="up" delay={0.15} className="review-carousel-wrapper">
          <Swiper
            modules={[Autoplay, Pagination]}
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={false}
            slidesPerView={1}
            spaceBetween={20}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            pagination={
              reviews.length > 3
                ? {
                    clickable: true,
                    el: '.carousel-dots',
                    bulletClass: 'carousel-dot',
                    bulletActiveClass: 'active',
                  }
                : false
            }
            onReachEnd={() => {
              if (swiperRef.current && reviews.length > 3) {
                swiperRef.current.params.autoplay.reverseDirection = true;
                swiperRef.current.autoplay.start();
              }
            }}
            onReachBeginning={() => {
              if (swiperRef.current && reviews.length > 3) {
                swiperRef.current.params.autoplay.reverseDirection = false;
                swiperRef.current.autoplay.start();
              }
            }}
            className="testimonials-swiper"
          >
            {reviews.map((review, idx) => (
              <SwiperSlide key={`${review.id || review.name}-${idx}`} style={{ height: 'auto' }}>
                <article className="testimonial-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div className="testimonial-avatar">
                    {review.image ? (
                      <img src={review.image} alt={review.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.currentTarget.style.display = 'none' }} />
                    ) : review.initials}
                  </div>
                  <div className="testimonial-stars">
                    {'★'.repeat(review.rating)}
                    <span style={{ color: 'rgba(255,255,255,0.15)' }}>{'★'.repeat(Math.max(0, 5 - review.rating))}</span>
                  </div>
                  <p className="testimonial-text">"{review.text}"</p>
                  <div style={{ marginTop: 'auto' }}>
                    <div className="testimonial-name">{review.name}</div>
                    <div className="testimonial-role">{review.role}</div>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
          {reviews.length > 3 && (
            <div className="carousel-dots" style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px' }}></div>
          )}
        </Reveal>
      )}
    </section>
  )
}

export function FaqSection() {
  const [faqsList, setFaqsList] = useState(fallbackFaqs)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/faqs`)
      .then((res) => res.json())
      .then((json) => {
        if (json.status === 200 && Array.isArray(json.data) && json.data.length > 0) {
          setFaqsList(json.data)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch FAQs:', err)
        setLoading(false)
      })
  }, [])

  return (
    <section className="home-faq section-dark">
      <SectionTitle
        eyebrow="FREQUENTLY ASKED QUESTIONS"
        title="Your Questions, Our Expertise."
        subtitle="We've compiled answers to the most common questions about our services, process, and commitment to your success."
      />
      {!loading && (
        <div className="faq-grid">
          {faqsList.map((faq, index) => {
            const question = faq.qus || faq[0]
            const answer = faq.answers || faq[1]
            const id = faq.id || index

            return (
              <motion.article 
                className={open === index ? 'open' : ''} 
                key={id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              >
                <button aria-expanded={open === index} onClick={() => setOpen(open === index ? null : index)}>
                  <span>{question}</span>
                  <ChevronDown size={18} />
                </button>
                <div className="faq-answer">
                  <p>{answer}</p>
                </div>
              </motion.article>
            )
          })}
        </div>
      )}
    </section>
  )
}

export function LatestInsights() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/blogs`)
        const data = await response.json()
        if (data.success && Array.isArray(data.data)) {
          const formattedBlogs = data.data.map(blog => ({
            id: blog.id,
            title: blog.title,
            description: blog.short_description,
            publish_date: blog.publish_date,
            banner_image: blog.banner_image,
            tags: blog.tags.split(',').map(tag => tag.trim()),
            author: blog.author,
            formattedDate: new Date(blog.publish_date).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric'
            })
          }))
          setBlogs(formattedBlogs)
        }
        setLoading(false)
      } catch (err) {
        console.error('Error fetching blogs:', err)
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  return (
    <section className="latest-insights">
      <Reveal direction="up">
        <SectionTitle
          eyebrow="FROM OUR BLOG"
          title="Latest Insights"
          subtitle="Ideas, guidance, and digital perspectives from our team."
        />
      </Reveal>
      {!loading && blogs.length > 0 && (
        <Reveal direction="up" delay={0.2} className="insight-grid">
          {blogs.slice(0, 3).map((blog) => (
            <article key={blog.id} onClick={() => go(`/blogs/${blog.id}`)}>
              <div
                className="insight-art"
                style={{
                  backgroundImage: blog.banner_image ? `url(${API_BASE_URL}${blog.banner_image})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="insight-art-overlay" />
                <div className="insight-art-inner">
                  <span>✦ · ✦ · ✦</span>
                  <strong>{blog.title}</strong>
                </div>
              </div>
              <div className="insight-meta">
                <span>{blog.tags[0] || 'BLOG'}</span>
                <small>{blog.formattedDate}</small>
              </div>
              <h3>{blog.title}</h3>
              <p>{blog.description}</p>
              <button onClick={(e) => { e.stopPropagation(); go(`/blogs/${blog.id}`) }}>
                Read article <ArrowUpRight size={14} />
              </button>
            </article>
          ))}
        </Reveal>
      )}
      {!loading && blogs.length === 0 && (
        <p style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>No blog posts available</p>
      )}
    </section>
  )
}

function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="home-section-title">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  )
}

export function AboutUsSection() {
  const [logos, setLogos] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/logo-carousel`)
      .then(res => res.json())
      .then(json => {
        if (json.status === 200 && Array.isArray(json.data)) {
          let duplicated = [...json.data];
          if (duplicated.length > 0) {
            // Duplicate array items enough times to fill the marquee track smoothly
            while (duplicated.length < 8) {
              duplicated = [...duplicated, ...json.data];
            }
          }
          setLogos(duplicated);
        }
      })
      .catch(err => console.error('Failed to fetch logos:', err));
  }, []);

  return (
    <section className="about-wrapper">
      {/* Image — positioned absolutely on desktop to fill right half */}
      <div className="about-image">
        <img src="/about-us-tech.jpg" alt="About Us Technology" />
      </div>

      <div className="about-inner">
        <Reveal direction="left">
          <div className="about-content">
            <h2>About Us</h2>
            <p>In today's fast-paced world, it is crucial for businesses to have a strong online presence. BTR Marketing Agency understands the importance of digital marketing and provides top-notch services to help businesses grow and succeed in the digital space.</p>
            <p>We are a full-service digital marketing agency that specializes in comprehensive marketing solutions for businesses of all sizes. Our experienced team creates customized strategies that deliver measurable results.</p>
            
            <div className="about-features">
              {['Search Engine Optimization (SEO)', 'Social Media Marketing', 'Pay-Per-Click Advertising (PPC)', 'Content Marketing', 'Website Design and Development'].map(feature => (
                <div key={feature} className="about-feature">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {logos.length > 0 && (
              <div className="about-clients-band">
                <div className="about-clients-label">
                  Our Clients
                </div>
                <div className="about-marquee-container">
                  <div className="about-marquee-track">
                    {logos.map((logo, index) => {
                      const resolvedImage = logo.image_url.startsWith('http') 
                        ? logo.image_url 
                        : `${API_BASE_URL}${logo.image_url.startsWith('/') ? '' : '/'}${logo.image_url}`;
                      return (
                        <div key={`track1-${logo.id}-${index}`} className="about-logo-item">
                          <img src={resolvedImage} alt={logo.title || 'Client Logo'} />
                        </div>
                      )
                    })}
                  </div>
                  <div className="about-marquee-track" aria-hidden="true">
                    {logos.map((logo, index) => {
                      const resolvedImage = logo.image_url.startsWith('http') 
                        ? logo.image_url 
                        : `${API_BASE_URL}${logo.image_url.startsWith('/') ? '' : '/'}${logo.image_url}`;
                      return (
                        <div key={`track2-${logo.id}-${index}`} className="about-logo-item">
                          <img src={resolvedImage} alt={logo.title || 'Client Logo'} />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function ProcessSection() {
  const processSteps = [
    { icon: <Brain size={28} />, title: "Discovery", subtitle: "Research & Strategy", text: "We deeply analyze your brand, competitors and audience before starting." },
    { icon: <MousePointerClick size={28} />, title: "Planning", subtitle: "Wireframe & Flow", text: "We design structure and define user journey for optimal experience." },
    { icon: <Lightbulb size={28} />, title: "Creation", subtitle: "Design & Develop", text: "We craft high-performing, beautiful and conversion-driven interfaces." },
    { icon: <Mountain size={28} />, title: "Growth", subtitle: "Launch & Optimize", text: "We launch, monitor and continuously improve performance." },
  ]

  // Map each index to its specific starting position
  const getInitialState = (index) => {
    switch(index) {
      case 0: return { opacity: 0, x: -150 }; // from left
      case 1: return { opacity: 0, y: 150 };  // from bottom
      case 2: return { opacity: 0, y: -150 }; // from top
      case 3: return { opacity: 0, x: 150 };  // from right
      default: return { opacity: 0, y: 50 };
    }
  }

  return (
    <section className="process-section">
      <div className="process-header">
        <h2>Our Process</h2>
      </div>
      
      <div className="process-grid">
        {processSteps.map((step, index) => (
          <motion.div
            key={index}
            className="process-card"
            initial={getInitialState(index)}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <div className="process-number">0{index + 1}</div>
            
            <div className="process-icon">{step.icon}</div>
            <h3>{step.title}</h3>
            <span className="process-subtitle">{step.subtitle}</span>
            <p>{step.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}