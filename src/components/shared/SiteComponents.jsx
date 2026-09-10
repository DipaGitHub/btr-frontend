import { ArrowUpRight } from 'lucide-react'
import { go } from '../../utils/navigation'
import { useEffect, useRef } from 'react'
import { motion, useInView, useSpring, useTransform } from 'framer-motion'

export function Logo({ light = false, className = '' }) {
  const isHeader = className.includes('header-logo');
  const logoSrc = isHeader
    ? "/BTR_Logo_Header.png"
    : "/BTR Communication Logo_Trans-BG.png";

  return (
    <div className={`logo-brand ${light ? 'logo-brand-light' : ''} ${className}`}>
      <img
        src={logoSrc}
        alt="BTR Communication"
        className="logo-brand-img"
      />
    </div>
  );
}

export function Banner({ title, eyebrow = 'WHO WE ARE' }) {
  return (
    <section className="page-banner">
      <div className="banner-balls">
        <div className="red-ball rb-1"></div>
        <div className="red-ball rb-2"></div>
        <div className="red-ball rb-3"></div>
        <div className="red-ball rb-4"></div>
        <div className="red-ball rb-5"></div>
      </div>
      <span>{eyebrow}</span>
      <h1>{title}</h1>
      <small>Home&nbsp; / &nbsp;{title}</small>
    </section>
  )
}

export function SectionHeading({ kicker, title }) {
  return <div className="section-heading"><span className="section-kicker">{kicker}</span><h2>{title}</h2><p>Focused expertise for every stage of your digital journey.</p></div>
}

export function ServiceCard({ service }) {
  return (
    <article className="service-card" style={{ height: '100%' }} onClick={() => go(`/services/${service.slug}`)}>
      {service.image_url && (
        <div className="service-image-container">
          <img src={service.image_url} alt={service.name} className="service-img" />
        </div>
      )}
      <h3>{service.title || service.name}</h3>
      <p>{service.detail || service.description}</p>
      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center' }}>
        <button className="button" onClick={(e) => { e.stopPropagation(); go(`/services/${service.slug}`); }}>
          Learn more
        </button>
      </div>
    </article>
  )
}

export function ProjectCard({ project }) {
  const openProject = () => {
    if (project.url && project.url.startsWith('http')) {
      window.open(project.url, '_blank')
    } else {
      go(`/portfolio/${project.id}`)
    }
  }

  return (
    <article
      className="project-card"
      role="link"
      tabIndex="0"
      onClick={openProject}
      onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') openProject() }}
    >
      <div className={`project-art ${project.className || ''}`}>
        {project.thumbnail && <img src={project.thumbnail} alt={project.cardTitle || project.title} className="project-img" />}
      </div>
      <div className="project-meta">
        <h3>{project.cardTitle || project.title}</h3>
        <p>{project.description ? project.description.slice(0, 110) + '...' : 'A considered digital experience designed to help a growing business turn visits into momentum.'}</p>
        <button className="card-link" onClick={event => { event.stopPropagation(); openProject() }}>
          View Details <span className="arrow-icon">&rarr;</span>
        </button>
      </div>
    </article>
  )
}

export function CountUp({ to, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  
  const springValue = useSpring(0, {
    bounce: 0,
    duration: 2500
  })

  useEffect(() => {
    if (inView) {
      springValue.set(to)
    }
  }, [inView, springValue, to])

  const displayValue = useTransform(springValue, (val) => Math.floor(val) + suffix)

  return <motion.span ref={ref}>{displayValue}</motion.span>
}

export function Stats() {
  return (
    <section className="stats stats-band">
      <b><CountUp to={350} suffix="+" /><small>Projects Completed</small></b>
      <b><CountUp to={14} suffix="+" /><small>Team Members</small></b>
      <b><CountUp to={9} suffix="+" /><small>Years Experience</small></b>
      <b><CountUp to={230} suffix="+" /><small>Happy Clients</small></b>
    </section>
  )
}