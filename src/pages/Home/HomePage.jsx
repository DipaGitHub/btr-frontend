import { API_BASE_URL } from '../../utils/apiConfig'
import { useState, useEffect } from 'react'
import { ArrowUpRight, Play, ExternalLink, ArrowRight } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { projects as fallbackProjects, serviceData as fallbackServices } from '../../data/siteData'
import { go } from '../../utils/navigation'
import { ProjectCard, SectionHeading, ServiceCard, CountUp } from '../../components/shared/SiteComponents'
import { DigitalExcellence, FaqSection, LatestInsights, Testimonials, AboutUsSection, ProcessSection } from './HomeSections'
import { OrbitSystem } from '../../components/animations/Orbit'
import { Marquee } from '../../components/animations/Marquee'
import { Reveal } from '../../components/shared/Reveal'
import { HeroBackground } from '../../components/animations/HeroBackground'
import { HeroHeadline } from '../../components/animations/HeroHeadline'

// ── Service strip items (hero top band) ──────────────────────
const SERVICE_STRIP_ITEMS = [
  'Ecommerce',
  'Mobile Application',
  'Customised Software',
  'AI Modules',
  'MERN Stack',
  'Cloud Solution',
  'Blockchain',
  'UI/UX Design',
]

// Helper to resolve Google / Material SVG icon for a service
function getServiceGoogleIcon(serviceName = '') {
  const name = serviceName.toLowerCase()
  if (name.includes('web') || name.includes('code'))
    return 'https://fonts.gstatic.com/s/i/productlogos/chrome/v9/web-64dp/1x/web_64dp.png'
  if (name.includes('graphic') || name.includes('design'))
    return 'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/palette/default/48px.svg'
  if (name.includes('ui') || name.includes('ux'))
    return 'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/devices/default/48px.svg'
  if (name.includes('seo') || name.includes('search'))
    return 'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/search/default/48px.svg'
  return 'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/widgets/default/48px.svg'
}

// ── Updates marquee (below hero) ─────────────────────────────
function TechMarquee() {
  const [updates, setUpdates] = useState([])

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/latestUpdates`)
      .then(res => res.json())
      .then(json => {
        if (json.success && Array.isArray(json.data)) setUpdates(json.data)
      })
      .catch(err => console.error('Failed to fetch marquee items:', err))
  }, [])

  if (updates.length === 0) return null

  const marqueeList = [...updates, ...updates]

  return (
    <section
      className="tech-marquee-wrapper"
      style={{ display: 'flex', alignItems: 'center', backgroundColor: '#0b0c10', overflow: 'hidden' }}
    >
      <div
        className="marquee-label"
        style={{
          backgroundColor: '#e52e2e',
          color: '#ffffff',
          fontWeight: '700',
          padding: '12px 24px',
          borderTopRightRadius: '16px',
          borderBottomRightRadius: '16px',
          zIndex: 2,
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        Updates
      </div>
      <div className="tech-marquee" aria-label="Our updates" style={{ flexGrow: 1, overflow: 'hidden' }}>
        <div className="marquee-track">
          {marqueeList.map((item, index) => (
            <span
              key={`${item.id}-${index}`}
              onClick={() => go(`/updates/${item.id}`)}
              style={{ cursor: 'pointer' }}
            >
              {item.title}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Main HomePage ─────────────────────────────────────────────
export function HomePage({ onApply }) {
  const [services, setServices]         = useState(fallbackServices)
  const [portfolioList, setPortfolioList] = useState(fallbackProjects)
  const [heroDescription, setHeroDescription] = useState('We create digital experiences that make ambitious brands easier to find, easier to trust, and impossible to forget.')

  // Fetch services
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/services`)
      .then(res => res.json())
      .then(json => {
        if (json.data && Array.isArray(json.data)) {
          const formatted = json.data.map(item => {
            let plainText = ''
            if (item.service_description_text) {
              const parser = new DOMParser()
              const doc = parser.parseFromString(item.service_description_text, 'text/html')
              plainText = doc.body.textContent || doc.body.innerText || ''
              plainText = plainText.replace(/\s+/g, ' ').trim()
              if (plainText.length > 130) plainText = plainText.slice(0, 130) + '...'
            }
            const iconUrl = getServiceGoogleIcon(item.name)
            const resolvedImage = item.image_url 
              ? (item.image_url.startsWith('http') ? item.image_url : `${API_BASE_URL}${item.image_url.startsWith('/') ? '' : '/'}${item.image_url}`) 
              : iconUrl
            return {
              ...item,
              title: item.name,
              name: item.name,
              slug: item.slug,
              image: resolvedImage,
              image_url: resolvedImage,
              icon: iconUrl,
              description: plainText,
              detail: plainText,
            }
          })
          setServices(formatted)
        }
      })
      .catch(err => console.error('Failed to fetch dynamic services:', err))
  }, [])

  // Fetch portfolio
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/portfolio`)
      .then(res => res.json())
      .then(json => {
        if (json.data && Array.isArray(json.data)) {
          const baseUrl = API_BASE_URL
          const formatted = json.data.map(item => ({
            id: item.id,
            title: item.title,
            cardTitle: item.title,
            type: 'Web Development',
            description: item.description,
            thumbnail: item.thumbnail_url ? `${baseUrl}${item.thumbnail_url}` : '',
            logo: item.logo_url ? `${baseUrl}${item.logo_url}` : '',
            projectUrl: item.project_url,
            className: 'portfolio-dynamic-item',
          }))
          setPortfolioList(formatted)
        }
      })
      .catch(err => console.error('Failed to fetch dynamic portfolio:', err))
  }, [])

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero section-dark">
        <HeroBackground />
        
        {/* Main hero content */}
        <div className="hero-content-row">
          <div className="hero-copy">
            <div className="eyebrow">BTR COMMUNICATION</div>
            <HeroHeadline onDescriptionChange={setHeroDescription} />
            <p>
              {heroDescription}
            </p>
            <div className="hero-glow-buttons">
              <div className="hero-glow-wrapper">
                <div className="glow-spinner-box">
                  <div className="glow-spinner primary-spinner"></div>
                </div>
                <button className="glow-btn-inner" onClick={onApply}>
                  <span>Launch a project</span> <ArrowUpRight size={16} />
                </button>
              </div>

              <div className="hero-glow-wrapper-secondary">
                <div className="glow-spinner-box">
                  <div className="glow-spinner secondary-spinner"></div>
                </div>
                <button className="glow-btn-inner-secondary" onClick={() => go('/portfolio')}>
                  <span>View our work</span> <Play size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Orbital animation */}
          <OrbitSystem />
        </div>
      </section>

      {/* ── UPDATES MARQUEE ── */}
      <TechMarquee />

      {/* ── WHY BTR ── */}
      <Reveal direction="up">
        <section className="section-dark home-intro">
          <div>
            <span className="section-kicker">WHY BTR</span>
            <h2>We make digital <em>work harder.</em></h2>
            <p>
              We are a full-service digital agency blending thoughtful strategy,
              standout creative, and reliable technology.
            </p>
          </div>
          <div className="stats">
            <b><CountUp to={350} suffix="+" /><small>Projects completed</small></b>
            <b><CountUp to={14} suffix="+" /><small>Team members</small></b>
            <b><CountUp to={9} suffix="+" /><small>Years experience</small></b>
            <b><CountUp to={230} suffix="+" /><small>Happy clients</small></b>
          </div>
        </section>
      </Reveal>

      {/* ── SERVICES ── */}
      <section className="section-dark services">
        <Reveal direction="up">
          <SectionHeading
            kicker="WHAT WE OFFER"
            title={<>Our professional <em>services.</em></>}
          />
        </Reveal>
        <div className="service-grid">
          {services.map((service, i) => {
            let dir = 'up';
            if (i % 4 === 0) dir = 'left';
            else if (i % 4 === 3) dir = 'right';
            
            return (
              <Reveal key={service.slug || service.id} direction={dir} delay={i * 0.08} style={{ height: '100%' }}>
                <div className="service-card-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>
                  <ServiceCard service={service} />
                </div>
              </Reveal>
            );
          })}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '60px' }}>
          <Reveal direction="up" delay={0.2}>
            <button className="button button-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => go('/services')}>
              View all services <ArrowRight size={16} />
            </button>
          </Reveal>
        </div>
      </section>

      {/* ── ABOUT US ── */}
      <AboutUsSection />

      {/* ── PROCESS ── */}
      <ProcessSection />

      {/* ── PORTFOLIO ── */}
      <section className="section-dark portfolio">
        <div className="container">
          <Reveal direction="up">
            <div className="portfolio-intro">
              <h2>Projects that speak for themselves</h2>
              <p>Browse through our latest work across industries and disciplines.</p>
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.1}>
            <Swiper 
              modules={[Autoplay]}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={true}
              slidesPerView={1} 
              spaceBetween={20} 
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="portfolio-swiper"
            >
              {portfolioList.map((project, index) => (
                <SwiperSlide key={project.id || index} style={{ height: 'auto' }}>
                  <Reveal direction="zoom" delay={index * 0.15} style={{ height: '100%' }}>
                    <div className="portfolio-slide-card">
                      <div className="portfolio-image-wrapper">
                        <img 
                          src={project.thumbnail || (project.image_url ? `${API_BASE_URL.replace('/api', '')}${project.image_url}` : '')} 
                          alt={project.title} 
                        />
                        <div className="portfolio-image-overlay">
                          <a 
                            href={project.link || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="portfolio-external-link"
                          >
                            <ExternalLink size={20} />
                          </a>
                        </div>
                      </div>
                      <div className="portfolio-card-content">
                        <h3>{project.title}</h3>
                        <p>{project.description || 'A considered digital experience designed to help a growing business turn visits into momentum.'}</p>
                        <div className="portfolio-card-footer">
                          <a 
                            href={`/portfolio/${project.id}`} 
                            onClick={(e) => { e.preventDefault(); go(`/portfolio/${project.id}`) }}
                          >
                            View Details <ArrowRight size={16} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </SwiperSlide>
              ))}
            </Swiper>
          </Reveal>

          <Reveal direction="up" delay={0.2}>
            <div className="portfolio-footer">
              <button 
                className="portfolio-view-all" 
                onClick={() => go('/portfolio')}
              >
                <span>View All Portfolio</span>
                <span className="portfolio-view-all-hover"></span>
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <DigitalExcellence />
      <Testimonials />
      <FaqSection />
      <LatestInsights />

      {/* ── CONTACT CTA ── */}
      <section className="section-dark contact-cta">
        <div>
          <span className="section-kicker">LET&apos;S TALK</span>
          <h2>Ready to make your <em>next move?</em></h2>
        </div>
        <button className="button" onClick={onApply}>
          Start a conversation <ArrowUpRight size={17} />
        </button>
      </section>
    </>
  )
}
