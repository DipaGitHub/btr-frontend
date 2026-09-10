import { API_BASE_URL } from '../../utils/apiConfig';
import { useState } from 'react'
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react'
import { go } from '../../utils/navigation'
import { Logo } from '../shared/SiteComponents'

export function Header({ onApply }) {
  const [mobile, setMobile] = useState(false)
  const [drop, setDrop] = useState(false)
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetched, setFetched] = useState(false)

  const links = [
    ['Home', '/'],
    ['About us', '/about'],
    ['Portfolio', '/portfolio'],
    ['Blogs', '/blogs'],
    ['Contact us', '/contact']
  ]

  // Fetch top services only when hovered for the first time
  const handleMouseEnter = () => {
    setDrop(true)
    if (!fetched) {
      setLoading(true)
      fetch(`${API_BASE_URL}/api/services`)
        .then((res) => res.json())
        .then((json) => {
          if (json.data && Array.isArray(json.data)) {
            setServices(json.data)
          }
          setFetched(true)
          setLoading(false)
        })
        .catch((err) => {
          console.error('Failed to fetch header services:', err)
          setLoading(false)
        })
    }
  }

  // Slice first 4 services for dropdown preview
  const topFourServices = services.slice(0, 4)

  return (
    <header className="site-header">
      <button className="brand" onClick={() => go('/')}>
        <Logo className="header-logo" />
      </button>

      <button className="menu-toggle" onClick={() => setMobile(!mobile)}>
        {mobile ? <X /> : <Menu />}
      </button>

      <nav className={`nav ${mobile ? 'open' : ''}`}>
        {links.slice(0, 2).map(([label, path]) => (
          <button
            key={path}
            className={location.pathname === path ? 'active' : ''}
            onClick={() => {
              go(path)
              setMobile(false)
            }}
          >
            {label}
          </button>
        ))}

        <div
          className="services-nav"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={() => setDrop(false)}
        >
          <button
            className={location.pathname.startsWith('/services') ? 'active' : ''}
            onClick={() => setDrop(!drop)}
          >
            Services <ChevronDown size={13} />
          </button>

          {drop && (
            <div className="service-dropdown">
              {loading ? (
                <div style={{ padding: '8px 12px', fontSize: '13px', color: '#888' }}>
                  Loading...
                </div>
              ) : (
                <>
                  {topFourServices.map((service) => (
                    <button
                      key={service.id || service.slug}
                      onClick={() => {
                        go(`/services/${service.slug || service.id}`)
                        setDrop(false)
                        setMobile(false)
                      }}
                    >
                      {service.name || service.title}
                      <ArrowUpRight size={13} />
                    </button>
                  ))}

                  {/* All Services option */}
                  <button
                    className="all-services-link"
                    style={{
                      borderTop: '1px solid rgba(255,255,255,0.1)',
                      fontWeight: 'bold',
                      marginTop: '4px',
                      paddingTop: '8px'
                    }}
                    onClick={() => {
                      go('/services')
                      setDrop(false)
                      setMobile(false)
                    }}
                  >
                    All Services
                    <ArrowUpRight size={13} />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {links.slice(2).map(([label, path]) => (
          <button
            key={path}
            className={location.pathname === path ? 'active' : ''}
            onClick={() => {
              go(path)
              setMobile(false)
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      <button className="button button-small header-cta" onClick={onApply}>
        Get started <ArrowUpRight size={15} />
      </button>
    </header>
  )
}