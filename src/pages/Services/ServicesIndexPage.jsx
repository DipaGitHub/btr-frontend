import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../utils/apiConfig'
import { Banner, SectionHeading } from '../../components/shared/SiteComponents'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { go } from '../../utils/navigation'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  }
}

function stripHtml(html) {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

export function ServicesIndexPage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/services`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data && Array.isArray(json.data)) {
          const activeServices = json.data.filter((s) => s.is_active === 1 || s.is_active === undefined)
          setServices(activeServices)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load services:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div style={{ padding: '80px', textAlign: 'center', color: '#fff' }}>Loading services...</div>
  }

  return (
    <>
      <Banner title="Our Services" eyebrow="WHAT WE OFFER" />
      <section className="section-dark services-page" style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ marginBottom: '60px' }}
        >
          <div style={{ textAlign: 'center' }}>
             <h2 style={{ fontSize: '2.5rem', color: '#ffffff', marginBottom: '16px' }}>Comprehensive digital solutions for<br />your business</h2>
             <p style={{ textAlign: 'center', color: '#a0a6b5', maxWidth: '800px', margin: '0 auto', fontSize: '0.95rem', lineHeight: '1.6' }}>
               From strategy to execution, we provide end-to-end digital services that help you stay ahead of the competition and achieve sustainable growth.
             </p>
          </div>
        </motion.div>
        
        <motion.div 
          className="services-index-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {services.map((service) => {
            const iconUrl = service.image_url ? `${API_BASE_URL}${service.image_url}` : null;
            const rawDescription = service.description || service.service_description_text || '';
            const cleanDescription = stripHtml(rawDescription).substring(0, 140) + '...';
            
            return (
              <motion.article 
                key={service.id} 
                className="service-index-card"
                variants={itemVariants}
                onClick={() => { go(`/services/${service.slug}`); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              >
                <div className="service-icon-wrapper">
                  {iconUrl ? (
                    <img src={iconUrl} alt={service.name || service.title} className="service-icon" />
                  ) : (
                    <div className="service-icon-placeholder"></div>
                  )}
                </div>
                <h3>{service.name || service.title}</h3>
                <p>{cleanDescription}</p>
                <button className="learn-more-link">
                  LEARN MORE <span className="arrow"><ArrowRight size={14} /></span>
                </button>
              </motion.article>
            )
          })}
        </motion.div>
        
        <div style={{ textAlign: 'center', marginTop: '80px' }}>
          <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '10px' }}>Ready to start your project?</h3>
          <p style={{ color: '#a0a6b5', marginBottom: '24px', fontSize: '0.9rem' }}>Let's discuss how we can help transform your business with our digital expertise.</p>
          <button 
             onClick={() => { go('/contact'); window.scrollTo(0,0) }} 
             style={{ 
               backgroundColor: '#ff4d4d', color: '#fff', border: 'none', 
               padding: '12px 24px', borderRadius: '24px', fontWeight: 'bold', 
               cursor: 'pointer', fontSize: '0.8rem' 
             }}>
             GET IN TOUCH
          </button>
        </div>
      </section>
    </>
  )
}
