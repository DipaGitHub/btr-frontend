import { API_BASE_URL } from '../../utils/apiConfig';
import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { go } from '../../utils/navigation';
import { motion } from 'framer-motion';

function ProjectPreview({ project }) {
  const baseUrl = API_BASE_URL;

  // Determine dynamic thumbnail image URL
  const rawImage = project.thumbnail_url || project.thumbnail || project.image || '';
  const imageUrl = rawImage 
    ? (rawImage.startsWith('http') ? rawImage : `${baseUrl}${rawImage}`)
    : '';

  const clientName = project.client || project.title || '';

  return (
    <div className={`portfolio-preview ${project.className || ''}`}>
      <div className="preview-nav">
        <b>{clientName}</b>
        <span>Home&nbsp;&nbsp; About&nbsp;&nbsp; Services&nbsp;&nbsp; Contact</span>
      </div>

      <div className="preview-hero">
        <small>WELCOME TO {clientName.toUpperCase()}</small>
        <h2>{project.cardTitle || project.title}</h2>
        <p>Professional solutions, exceptional experiences.</p>
        <button>Learn more</button>
      </div>

      <div className="preview-content">
        <div>
          <small>WHO WE ARE</small>
          <strong>Purposeful digital experiences</strong>
          <span>Thoughtfully designed around people and business goals.</span>
        </div>

        {/* Dynamic Image Placement inside original mockup layout */}
        <div 
          className="preview-photo" 
          style={{ 
            backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            overflow: 'hidden'
          }}
        >
          {imageUrl && (
            <img 
              src={imageUrl} 
              alt={project.title || 'Project Preview'} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function PortfolioDetailPage({ projectId }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        // Try to fetch specific project or all projects
        const response = await fetch(`${API_BASE_URL}/api/portfolio`);
        
        if (!response.ok) {
          throw new Error('Portfolio API not available');
        }
        
        const data = await response.json();
        
        if (data.data && Array.isArray(data.data)) {
          const baseUrl = API_BASE_URL;
          const formattedProjects = data.data.map((item) => ({
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
            thumbnail: item.thumbnail_url ? `${baseUrl}${item.thumbnail_url}` : '',
            image: item.thumbnail_url ? `${baseUrl}${item.thumbnail_url}` : '',
            logo: item.logo_url ? `${baseUrl}${item.logo_url}` : '',
            url: item.project_url,
            projectUrl: item.project_url,
            className: 'portfolio-dynamic-item'
          }));

          // Find the specific project by ID
          const foundProject = formattedProjects.find(p => p.id === parseInt(projectId));
          if (foundProject) {
            setProject(foundProject);
          } else {
            setError('Project not found');
          }
        } else {
          setError('No portfolio data available');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load portfolio details');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProjectDetails();
    } else {
      setError('No project ID provided');
      setLoading(false);
    }
  }, [projectId]);

  // Loading state
  if (loading) {
    return (
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="portfolio-detail-loading" 
        style={{ padding: '80px', textAlign: 'center' }}
      >
        <div className="loading-spinner">Loading project details...</div>
      </motion.section>
    );
  }

  // Error state
  if (error || !project) {
    return (
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="portfolio-detail-error" 
        style={{ padding: '80px', textAlign: 'center' }}
      >
        <h2>{error || 'Project not found'}</h2>
        <button 
          onClick={() => go('/portfolio')}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#333',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Back to Portfolio
        </button>
      </motion.section>
    );
  }

  const liveUrl = project.url || project.projectUrl || project.project_url;

  return (
    <>
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="portfolio-detail-banner"
      >
        <span>PORTFOLIO DETAILS</span>
        <h1>{project.title}</h1>
        <button onClick={() => go('/')}>Home</button>
        
        <button onClick={() => go('/portfolio')}>Portfolio Details</button>
      </motion.section>

      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="portfolio-detail-body"
      >
        {/* Keeps original mockup preview UI with dynamic API image */}
        <ProjectPreview project={project} />

        <article className="portfolio-detail-copy">
          <span className="section-kicker">{project.service || project.type || 'Web Development'}</span>
          <h2>{project.title}</h2>
          <p>{project.description || project.summary}</p>

          <dl>
            <div>
              <dt>Client</dt>
              <dd>{project.client || project.title}</dd>
            </div>
            <div>
              <dt>Service</dt>
              <dd>{project.service || project.type || 'Web Development'}</dd>
            </div>
          </dl>

          {liveUrl && (
            <a className="portfolio-live-link" href={liveUrl} target="_blank" rel="noreferrer">
              Visit Live Website <ArrowUpRight size={16} />
            </a>
          )}
        </article>
      </motion.section>
    </>
  );
}