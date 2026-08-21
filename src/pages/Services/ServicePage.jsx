import { API_BASE_URL } from '../../utils/apiConfig';
import { useEffect, useState } from 'react'
import { ArrowUpRight, Check, IndianRupee, X, Loader2 } from 'lucide-react'
import { Banner } from '../../components/shared/SiteComponents'
import { motion } from 'framer-motion'
import { go } from '../../utils/navigation'

export function ServicePage({ service: initialService, onApply, slug }) {
  const [service, setService] = useState(initialService || null)
  const [allServices, setAllServices] = useState([])
  const [pricingPlans, setPricingPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [pricingLoading, setPricingLoading] = useState(true)

  // Lead capture state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [submittingLead, setSubmittingLead] = useState(false)
  const [leadSuccess, setLeadSuccess] = useState(false)
  const [leadError, setLeadError] = useState('')

  const getSlugFromUrl = () => {
    return slug || window.location.pathname.split('/services/')[1] || ''
  }

  useEffect(() => {
    // Fetch all services for the sidebar
    fetch(`${API_BASE_URL}/api/services`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data && Array.isArray(json.data)) {
          const activeServices = json.data.filter((s) => s.is_active === 1 || s.is_active === undefined)
          setAllServices(activeServices)
        }
      })
      .catch((err) => {
        console.error('Failed to load services for sidebar:', err)
      })
  }, [])

  useEffect(() => {
    const currentSlug = getSlugFromUrl()
    if (!currentSlug) {
       // If no slug, just set it from initial if available or first of allServices
       if (initialService) setService(initialService)
       else if (allServices.length > 0) setService(allServices[0])
       setLoading(false)
       return;
    }
    
    setLoading(true)
    fetch(`${API_BASE_URL}/api/services/by-slug/${currentSlug}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.status === 200 && json.data) {
          setService(json.data)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load dynamic service details:', err)
        setLoading(false)
      })
  }, [slug, allServices.length])

  useEffect(() => {
    if (!service || !service.id) return;
    
    setPricingLoading(true);
    fetch(`${API_BASE_URL}/api/pricing/service/${service.id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.status === 200 && Array.isArray(json.data)) {
          setPricingPlans(json.data)
        } else {
          setPricingPlans([])
        }
        setPricingLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch pricing:', err)
        setPricingLoading(false)
      })
  }, [service])

  const handleServiceChange = (targetSlug) => {
    const matched = allServices.find((item) => item.slug === targetSlug)
    if (matched) {
      setService(matched)
      go(`/services/${targetSlug}`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleOpenLeadModal = (plan = null) => {
    setSelectedPlan(plan)
    setLeadError('')
    setLeadSuccess(false)
    setIsModalOpen(true)
  }

  const handleCloseLeadModal = () => {
    setIsModalOpen(false)
    setSelectedPlan(null)
    setLeadSuccess(false)
    setLeadForm({ name: '', email: '', phone: '', message: '' })
  }

  const handleLeadSubmit = async (e) => {
    e.preventDefault()
    setSubmittingLead(true)
    setLeadError('')

    // Formats pricing plan string with both Name and Price
    const planString = selectedPlan
      ? `${selectedPlan.plan_name} (Rs. ${parseFloat(selectedPlan.price).toLocaleString()})`
      : ''

    const payload = {
      name: leadForm.name,
      email: leadForm.email,
      phone: leadForm.phone,
      message: leadForm.message,
      service: service?.name || service?.title || '',
      service_id: service?.id || null,
      pricing_plan: planString,
      plan_id: selectedPlan?.id || null,
      source: 'service_details'
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/leads/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok && (data.status === 200 || data.success)) {
        setLeadSuccess(true)
        setTimeout(() => {
          handleCloseLeadModal()
        }, 2500)
      } else {
        setLeadError(data.message || 'Failed to submit enquiry. Please try again.')
      }
    } catch (err) {
      console.error('Error submitting lead:', err)
      setLeadError('Network error. Please try again later.')
    } finally {
      setSubmittingLead(false)
    }
  }

  if (loading) {
    return <div style={{ padding: '80px', textAlign: 'center', color: '#ffffff' }}>Loading service details...</div>
  }

  if (!service) {
    return <div style={{ padding: '80px', textAlign: 'center', color: '#ffffff' }}>Service not found.</div>
  }

  const imageSrc = service.banner_image_url
    ? `${API_BASE_URL}${service.banner_image_url}`
    : service.image

  const title = service.name || service.title

  return (
    <div style={{ backgroundColor: '#090a0f', color: '#ffffff', minHeight: '100vh' }}>
      <Banner title={title} eyebrow={service.eyebrow || 'OUR SERVICES'} />



      {/* Main Service Overview */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 20px',
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: '50px'
      }}>
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="detail-copy" 
          style={{ textAlign: 'justify', lineHeight: '1.8' }}
        >
          <span className="section-kicker" style={{ color: '#ff4d4d', fontWeight: '700', letterSpacing: '2px', fontSize: '0.85rem' }}>
            OVERVIEW
          </span>
          <h2 style={{ fontSize: '2.2rem', margin: '12px 0 24px 0', color: '#ffffff' }}>{title}</h2>

          {service.service_description_text || service.description ? (
            <div
              className="rich-description"
              style={{ color: '#c5cbd8', fontSize: '1.05rem', lineHeight: '1.85' }}
              dangerouslySetInnerHTML={{ __html: service.service_description_text || service.description }}
            />
          ) : (
            <p style={{ color: '#c5cbd8', fontSize: '1.05rem', lineHeight: '1.85' }}>{service.detail}</p>
          )}

          <button
            className="button"
            onClick={() => handleOpenLeadModal()}
            style={{
              marginTop: '32px',
              padding: '14px 28px',
              backgroundColor: '#ff4d4d',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            Start a project <ArrowUpRight size={18} />
          </button>
        </motion.div>

        {/* Navigation Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="detail-side" 
          style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}
        >
          <div style={{
            width: '100%',
            height: '240px',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <img
              src={imageSrc}
              alt={`${title} preview`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          
          <div className="side-card" style={{
            backgroundColor: '#11141c',
            padding: '28px',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#ffffff' }}>Other Services</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {allServices.map((item) => {
                const isActive = item.slug === service.slug
                return (
                  <button
                    key={item.id}
                    onClick={() => handleServiceChange(item.slug)}
                    style={{
                      textAlign: 'left',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      backgroundColor: isActive ? 'rgba(255,77,77,0.15)' : 'transparent',
                      color: isActive ? '#ff4d4d' : '#a0a6b5',
                      border: isActive ? '1px solid #ff4d4d' : '1px solid rgba(255,255,255,0.05)',
                      fontWeight: isActive ? '600' : '400',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <span style={{ fontSize: '0.8rem' }}>▣</span> {item.name || item.title}
                  </button>
                )
              })}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Scope of Work Section */}
      {service.scope_content && (
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 20px 60px' }}
        >
          <span className="section-kicker" style={{ color: '#ff4d4d', fontWeight: '700', letterSpacing: '2px', fontSize: '0.85rem', textTransform: 'uppercase' }}>
            {service.scope_title || 'SCOPE OF WORK'}
          </span>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '30px 60px',
            marginTop: '24px'
          }}>
            {(() => {
              const parser = new DOMParser();
              const doc = parser.parseFromString(service.scope_content, 'text/html');
              const items = [];
              let currentItem = null;
              
              Array.from(doc.body.children).forEach(node => {
                if (node.querySelector('b') || node.querySelector('strong') || ['H2','H3','H4','H5'].includes(node.tagName)) {
                  const text = node.textContent.trim();
                  if (text) {
                    if (currentItem) items.push(currentItem);
                    currentItem = { title: text, content: [] };
                  }
                } else {
                  const text = node.textContent.trim();
                  if (text && currentItem) {
                    currentItem.content.push(node.innerHTML);
                  } else if (text && !currentItem) {
                    currentItem = { title: 'Overview', content: [node.innerHTML] };
                  }
                }
              });
              if (currentItem) items.push(currentItem);

              if (items.length === 0) {
                return <div className="scope-of-work-grid" dangerouslySetInnerHTML={{ __html: service.scope_content }} />
              }

              return items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <Check size={18} style={{ color: '#ff4d4d', flexShrink: 0, marginTop: '2px' }} />
                    <h4 style={{ color: '#ff4d4d', fontSize: '1.05rem', margin: '0 0 10px 0', fontWeight: '600', lineHeight: '1.4' }}>
                      {item.title}
                    </h4>
                  </div>
                  <div style={{ paddingLeft: '28px' }}>
                    {item.content.map((htmlStr, i) => (
                      <p key={i} style={{ color: '#c5cbd8', fontSize: '0.95rem', lineHeight: '1.7', margin: '0 0 10px 0' }} dangerouslySetInnerHTML={{ __html: htmlStr }} />
                    ))}
                  </div>
                </div>
              ))
            })()}
          </div>
        </motion.section>
      )}

      {/* Pricing Section */}
      <section className="pricing-section section-dark" style={{ padding: '80px 20px', backgroundColor: '#06070a', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="pricing-header" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px' }}>
          <span className="section-kicker" style={{ color: '#ff4d4d', fontWeight: '700', letterSpacing: '2px', fontSize: '0.85rem' }}>
            OUR PRICING PLANS
          </span>
          <h2 style={{ fontSize: '2.4rem', color: '#ffffff', marginTop: '10px' }}>
            Choose the Perfect Plan for Your Business
          </h2>
          <p style={{ color: '#a0a6b5', fontSize: '1.05rem', marginTop: '12px', lineHeight: '1.6' }}>
            Transparent pricing with no hidden fees. Select a plan that fits your needs and budget.
          </p>
        </div>

        {!pricingLoading && pricingPlans.length > 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                style={{
                  backgroundColor: '#11141c',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '32px 40px',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '40px',
                  flexWrap: 'wrap'
                }}
              >
                {/* Plan Info */}
                <div style={{ flex: '1 1 250px', textAlign: 'left' }}>
                  <h3 style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: '700', margin: '0 0 8px 0' }}>
                    {plan.plan_name}
                  </h3>
                  <p style={{ color: '#a0a6b5', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                    {plan.category || 'PLAN'}
                  </p>
                </div>

                {/* Features List */}
                <div style={{ flex: '2 1 300px' }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {plan.features && Array.isArray(plan.features) ? (
                      plan.features.map((feature, index) => (
                        <li
                          key={index}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                            color: '#ffffff',
                            fontSize: '0.95rem',
                          }}
                        >
                          <Check size={18} style={{ color: '#ff4d4d', flexShrink: 0, marginTop: '2px' }} />
                          <span>{feature}</span>
                        </li>
                      ))
                    ) : (
                      <li style={{ color: '#a0a6b5', fontSize: '0.85rem' }}>No features listed</li>
                    )}
                  </ul>
                </div>

                {/* Price and Button */}
                <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ color: '#ffffff', fontSize: '2.2rem', fontWeight: '700' }}>
                      ₹{parseFloat(plan.price).toFixed(2)}
                    </span>
                    <span style={{ color: '#a0a6b5', fontSize: '0.85rem' }}>/Project</span>
                  </div>

                  <button
                    onClick={() => handleOpenLeadModal(plan)}
                    className="pricing-btn-hover"
                    style={{
                      backgroundColor: 'transparent',
                      color: '#ffffff',
                      border: '1px solid #ffffff',
                      padding: '10px 24px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}
                  >
                    GET QUOTE
                    <ArrowUpRight size={16} style={{ transition: 'transform 0.3s ease' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!pricingLoading && pricingPlans.length === 0 && (
          <div style={{ textAlign: 'center', color: '#a0a6b5', padding: '40px' }}>
            No pricing plans available.
          </div>
        )}
      </section>

      {/* Lead Capture Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#11141c',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '32px',
            maxWidth: '500px',
            width: '100%',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <button
              onClick={handleCloseLeadModal}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                color: '#a0a6b5',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            {leadSuccess ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid rgba(34, 197, 94, 0.4)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  color: '#22c55e'
                }}>
                  <Check size={32} />
                </div>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '8px', color: '#22c55e', fontWeight: '700' }}>
                  Enquiry Received!
                </h3>
                <p style={{ color: '#c5cbd8', fontSize: '0.98rem', lineHeight: '1.6' }}>
                  Thank you for reaching out. Our team will contact you shortly regarding <strong>{title}</strong>{selectedPlan ? ` (${selectedPlan.plan_name})` : ''}.
                </p>
                <p style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '16px' }}>
                  This window will close automatically...
                </p>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '4px', color: '#ffffff' }}>
                  Inquire About {title}
                </h3>
                <p style={{ color: '#a0a6b5', fontSize: '0.88rem', marginBottom: '24px' }}>
                  Fill out your details below and we will contact you to discuss project specifications.
                </p>

                {leadError && (
                  <div style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ef4444',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    marginBottom: '16px'
                  }}>
                    {leadError}
                  </div>
                )}

                <form onSubmit={handleLeadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#c5cbd8', marginBottom: '6px' }}>Service</label>
                    <input
                      type="text"
                      disabled
                      value={title}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        backgroundColor: '#050608',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        color: '#ff4d4d',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        outline: 'none',
                        cursor: 'not-allowed'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#c5cbd8', marginBottom: '6px' }}>Pricing Plan</label>
                    <select
                      value={selectedPlan?.id || ''}
                      onChange={(e) => {
                        const matched = pricingPlans.find(p => p.id.toString() === e.target.value)
                        setSelectedPlan(matched || null)
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        backgroundColor: '#090a0f',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    >
                      <option value="">General Inquiry / Custom Quote</option>
                      {pricingPlans.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.plan_name} - ₹{parseFloat(plan.price).toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#c5cbd8', marginBottom: '6px' }}>Full Name *</label>
                    <input
                      type="text"
                      required
                      value={leadForm.name}
                      onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                      placeholder="John Doe"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        backgroundColor: '#090a0f',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#c5cbd8', marginBottom: '6px' }}>Email Address *</label>
                    <input
                      type="email"
                      required
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      placeholder="john@example.com"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        backgroundColor: '#090a0f',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#c5cbd8', marginBottom: '6px' }}>Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        backgroundColor: '#090a0f',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#c5cbd8', marginBottom: '6px' }}>Project Notes (Optional)</label>
                    <textarea
                      rows={3}
                      value={leadForm.message}
                      onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                      placeholder="Briefly describe your requirements..."
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        backgroundColor: '#090a0f',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingLead}
                    style={{
                      marginTop: '8px',
                      padding: '12px',
                      backgroundColor: '#ff4d4d',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: submittingLead ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      opacity: submittingLead ? 0.7 : 1
                    }}
                  >
                    {submittingLead ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Submitting...
                      </>
                    ) : (
                      'Submit Request'
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}