import { API_BASE_URL } from '../../utils/apiConfig';
import { useState, useEffect } from 'react'
import { Banner, ProjectCard, SectionHeading } from '../../components/shared/SiteComponents'
import { motion } from 'framer-motion'

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
  hidden: { opacity: 0, y: 40 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  }
}

export function PortfolioPage() {
  const [portfolioList, setPortfolioList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/portfolio`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data && Array.isArray(json.data)) {
          const baseUrl = API_BASE_URL
          const formatted = json.data.map((item) => {
            const fullImageUrl = item.thumbnail_url
              ? (item.thumbnail_url.startsWith('http') ? item.thumbnail_url : `${baseUrl}${item.thumbnail_url}`)
              : ''

            return {
              id: item.id,
              title: item.title,
              cardTitle: item.title,
              type: 'Web Development',
              service: 'Web Development',
              client: item.title,
              description: item.description,
              summary: item.description,
              detail: item.description,
              thumbnail_url: item.thumbnail_url,
              thumbnail: fullImageUrl,
              image: fullImageUrl,
              logo: item.logo_url ? `${baseUrl}${item.logo_url}` : '',
              url: item.project_url,
              projectUrl: item.project_url,
              className: 'portfolio-dynamic-item'
            }
          })
          setPortfolioList(formatted)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch portfolio:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div style={{ padding: '80px', textAlign: 'center', color: '#fff' }}>Loading portfolio...</div>
  }

  return (
    <>
      <Banner title="Our Portfolio" eyebrow="FEATURED WORK" />
      <section className="section-dark portfolio-page">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <SectionHeading kicker="PROJECTS" title={<>Projects that speak <em>for themselves.</em></>} />
        </motion.div>
        
        <motion.div 
          className="project-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {portfolioList.map((project) => (
            <motion.div key={project.id || project.title} variants={itemVariants}>
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </>
  )
}