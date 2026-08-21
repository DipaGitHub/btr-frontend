import { API_BASE_URL } from '../utils/apiConfig';
import { useEffect, useState } from 'react'
import { go } from '../utils/navigation'

export function UpdateDetailsPage({ updateId }) {
  const [update, setUpdate] = useState(null)
  const [allUpdates, setAllUpdates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch all updates from the API
    fetch(`${API_BASE_URL}/api/latestUpdates`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setAllUpdates(json.data)
          // Find the specific update matching the URL ID
          const current = json.data.find((item) => String(item.id) === String(updateId))
          setUpdate(current || json.data[0])
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching update details:', err)
        setLoading(false)
      })
  }, [updateId])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',  // Changed from 'LONG' to 'long'
      day: 'numeric',
      month: 'long',    // Changed from 'LONG' to 'long'
      year: 'numeric',  // Changed from 'NUMERIC' to 'numeric'
    }).toUpperCase()   // Converts the final formatted string to uppercase
  }

  if (loading) {
    return <div style={{ padding: '80px', textAlign: 'center', color: '#fff' }}>Loading update details...</div>
  }

  if (!update) {
    return <div style={{ padding: '80px', textAlign: 'center', color: '#fff' }}>Update not found.</div>
  }

  return (
    <div style={{ backgroundColor: '#090a0f', color: '#ffffff', minHeight: '100vh' }}>
      {/* Hero Header Banner */}
      <section style={{ textAlign: 'center', padding: '60px 20px', borderBottom: '1px solid #1a1d26' }}>
        <span style={{ fontSize: '12px', letterSpacing: '2px', opacity: 0.6, textTransform: 'uppercase' }}>
          {formatDate(update.update_date)}
        </span>
        <h1 style={{ fontSize: '42px', margin: '16px 0 12px 0', fontWeight: '700' }}>
          {update.title}
        </h1>
        <p style={{ fontSize: '14px', opacity: 0.5 }}>
          Home / Update Details
        </p>
      </section>

      {/* Main Content Area */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '30px' }}>
        
        {/* Left Column: Details */}
        <div style={{ backgroundColor: '#12141d', padding: '30px', borderRadius: '12px', border: '1px solid #1e2230' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: '600' }}>Update Details</h3>
          <p style={{ lineHeight: '1.7', opacity: 0.8, whiteSpace: 'pre-line' }}>
            {update.description}
          </p>

          <hr style={{ borderColor: '#1e2230', margin: '30px 0' }} />

          <span style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '12px' }}>Share this update</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['Twitter', 'Facebook', 'LinkedIn'].map((platform) => (
              <button key={platform} style={{ backgroundColor: '#1a1d29', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer' }}>
                {platform}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: All Updates List */}
        <div style={{ backgroundColor: '#12141d', padding: '24px', borderRadius: '12px', border: '1px solid #1e2230', height: 'fit-content' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📅 All Updates
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {allUpdates.map((item) => {
              const isCurrent = String(item.id) === String(update.id)
              return (
                <div
                  key={item.id}
                  onClick={() => go(`/updates/${item.id}`)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    backgroundColor: isCurrent ? '#2a1a20' : 'transparent',
                    border: isCurrent ? '1px solid #e52e2e' : '1px solid transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <span style={{ color: isCurrent ? '#ff4d4d' : '#ffffff', fontSize: '14px', fontWeight: '500' }}>
                    {item.title}
                  </span>
                  {isCurrent && (
                    <span style={{ fontSize: '11px', color: '#ff4d4d', opacity: 0.8 }}>Currently Viewing</span>
                  )}
                </div>
              )
            })}
          </div>

          <button 
            onClick={() => go('/updates')}
            style={{ width: '100%', marginTop: '20px', backgroundColor: '#e52e2e', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
          >
            View All Updates ↗
          </button>
        </div>

      </section>
    </div>
  )
}