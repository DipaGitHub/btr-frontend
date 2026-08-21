import { API_BASE_URL } from '../../utils/apiConfig';
import { useState, useEffect } from 'react'
import { ArrowUpRight, Check, X } from 'lucide-react'

export function ApplicationModal({ onClose, initialService = '', initialPlan = '', source = 'header' }) {
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [services, setServices] = useState([])
  const [pricingPlans, setPricingPlans] = useState([])

  const isFromServicePage = source === 'service_details'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: initialService || '',
    pricing_plan: initialPlan || ''
  })

  // Fetch Services & Pricing options dynamically
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/services`)
      .then(res => res.json())
      .then(json => {
        if (json.data && Array.isArray(json.data)) {
          setServices(json.data.filter(s => s.is_active === 1 || s.is_active === undefined))
        }
      })
      .catch(err => console.error('Failed to fetch services:', err))

    fetch(`${API_BASE_URL}/api/pricing`)
      .then(res => res.json())
      .then(json => {
        if (json.status === 200 && Array.isArray(json.data)) {
          setPricingPlans(json.data)
        }
      })
      .catch(err => console.error('Failed to fetch pricing plans:', err))
  }, [])

  // Sync initial parameters when props change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      service: initialService || prev.service,
      pricing_plan: initialPlan || prev.pricing_plan
    }))
  }, [initialService, initialPlan])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const payload = {
      ...formData,
      source: source
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/leads/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        setSent(true)
        setTimeout(() => {
          onClose()
        }, 2500)
      } else {
        alert('Failed to submit application. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting lead:', error)
      alert('An error occurred. Please check your connection.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={event => event.stopPropagation()} role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose}>
          <X />
        </button>

        {sent ? (
          <div className="success-state" style={{ textAlign: 'center', padding: '20px 0' }}>
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
            <h2 style={{ color: '#22c55e', fontSize: '1.6rem', fontWeight: '700', marginBottom: '8px' }}>
              Application Received!
            </h2>
            <p style={{ color: '#c5cbd8', fontSize: '0.95rem' }}>
              Thanks. Our team will contact you shortly.
            </p>
            <p style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '16px' }}>
              Closing window...
            </p>
          </div>
        ) : (
          <>
            <h2>Service Application Form</h2>
            <form onSubmit={handleSubmit}>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name *"
              />
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email *"
              />
              <input
                required
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone *"
              />

              {/* Service Selection */}
              {isFromServicePage ? (
                <input
                  type="text"
                  name="service"
                  value={formData.service}
                  disabled
                  readOnly
                  style={{
                    opacity: 0.8,
                    cursor: 'not-allowed',
                    backgroundColor: '#000',
                    color: '#ff4d4d',
                    fontWeight: 'bold'
                  }}
                />
              ) : (
                <select
                  required
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select Service *</option>
                  {services.map(service => {
                    const serviceName = service.name || service.title
                    return (
                      <option key={service.id || service.slug} value={serviceName}>
                        {serviceName}
                      </option>
                    )
                  })}
                </select>
              )}

              {/* Pricing Plan Selection */}
              <select
                required={isFromServicePage}
                name="pricing_plan"
                value={formData.pricing_plan}
                onChange={handleChange}
              >
                <option value="">
                  {isFromServicePage ? 'Select Pricing Plan *' : 'Select Pricing Plan (Optional)'}
                </option>
                {pricingPlans.map(plan => {
                  const planValue = `${plan.plan_name} (Rs. ${parseFloat(plan.price).toLocaleString()})`
                  return (
                    <option key={plan.id} value={planValue}>
                      {plan.plan_name} - ₹{parseFloat(plan.price).toLocaleString()}
                    </option>
                  )
                })}
              </select>

              <button className="button" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit application'} <ArrowUpRight size={15} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}