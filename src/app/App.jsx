import { useEffect, useState } from 'react'
import { ApplicationModal } from '../components/forms/ApplicationModal'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { UpdateDetailsPage } from '../components/UpdateDetailsPage'
import { blogs, projects, serviceData } from '../data/siteData'
import { AboutPage } from '../pages/About/AboutPage'
import { BlogsPage } from '../pages/Blogs/BlogsPage'
import { BlogDetailPage } from '../pages/Blogs/BlogDetailPage'
import { ContactPage } from '../pages/Contact/ContactPage'
import { HomePage } from '../pages/Home/HomePage'
import { PortfolioPage } from '../pages/Portfolio/PortfolioPage'
import { PortfolioDetailPage } from '../pages/Portfolio/PortfolioDetailPage'
import { ServicePage } from '../pages/Services/ServicePage'
import { ServicesIndexPage } from '../pages/Services/ServicesIndexPage'

function resolvePage(path, onApply) {
  if (path === '/about') return <AboutPage />
  if (path === '/contact') return <ContactPage />
  if (path === '/blogs') return <BlogsPage />
  
  // FIXED: Pass the ID as a prop instead of the blog object
  if (path.startsWith('/blogs/')) {
    const blogId = path.split('/blogs/')[1]
    return <BlogDetailPage blogId={blogId} />
  }

  // ADDED: Handles /updates/:id routing
  if (path.startsWith('/updates/')) {
    const updateId = path.split('/updates/')[1]
    return <UpdateDetailsPage updateId={updateId} />
  }

  if (path === '/portfolio') return <PortfolioPage />
  if (path.startsWith('/portfolio/')) {
    const projectId = path.split('/portfolio/')[1]
    // You should pass the ID similarly for portfolio detail
    return <PortfolioDetailPage projectId={projectId} />
  }
  
  if (path === '/services') {
    return <ServicesIndexPage />
  }
  if (path.startsWith('/services/')) {
    const slug = path.split('/services/')[1]
    return <ServicePage slug={slug} onApply={onApply} />
  }
  
  return <HomePage onApply={onApply} />
}

export function App() {
  const [path, setPath] = useState(location.pathname)
  const [modal, setModal] = useState(false)

  useEffect(() => {
    const handleNavigation = () => setPath(location.pathname)
    addEventListener('popstate', handleNavigation)
    return () => removeEventListener('popstate', handleNavigation)
  }, [])

  const openApplication = () => setModal(true)

  return (
    <div className="site-shell">
      <Header onApply={openApplication} />
      <main>{resolvePage(path, openApplication)}</main>
      <Footer />
      {modal && <ApplicationModal onClose={() => setModal(false)} />}
    </div>
  )
}