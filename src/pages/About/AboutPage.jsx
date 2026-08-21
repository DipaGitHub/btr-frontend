import { Banner, Stats } from '../../components/shared/SiteComponents'
import { motion } from 'framer-motion'

function InfoSection({ title, items }) {
  return (
    <div>
      <h3>{title}</h3>
      {items.map(({ title: itemTitle, description }) => (
        <p className="check-item" key={itemTitle}>
          ✓ <strong>{itemTitle}:</strong>
          <small> {description}</small>
        </p>
      ))}
    </div>
  )
}

export function AboutPage() {
  const whatWeDoItems = [
    {
      title: 'Search Engine Optimization (SEO)',
      description: 'We help businesses improve their online visibility and rank higher on search engine results pages.'
    },
    {
      title: 'Social Media Marketing',
      description: 'We help businesses reach and engage their target audience on popular social media platforms like Facebook, Twitter, Instagram, and LinkedIn.'
    },
    {
      title: 'Pay-Per-Click Advertising (PPC)',
      description: 'We create and manage effective PPC campaigns to help businesses drive traffic, leads, and sales.'
    },
    {
      title: 'Content Marketing',
      description: 'We help businesses create high-quality content that educates and engages their target audience.'
    },
    {
      title: 'Website Design and Development',
      description: 'We design and develop stunning, user-friendly websites that help businesses convert visitors into customers.'
    }
  ]

  const whyChooseUsItems = [
    {
      title: 'Experience',
      description: 'Our team of experts has years of experience in the digital marketing industry and has worked with businesses of all sizes across various industries.'
    },
    {
      title: 'Customization',
      description: "We don't believe in a one-size-fits-all approach to marketing. We take the time to understand each client's unique needs and create customized strategies to help them achieve their marketing goals."
    },
    {
      title: 'Transparency',
      description: 'We believe in complete transparency with our clients. We provide regular reports and updates on our progress and work closely with our clients to ensure they are always in the loop.'
    },
    {
      title: 'Results',
      description: 'At the end of the day, we measure our success by the success of our clients. We work tirelessly to help businesses achieve their marketing goals and see real, measurable results.'
    }
  ]

  return (
    <>
      {/* Embedded CSS Styles */}
      <style>{`
        .mission-vision-section {
          padding: 40px 20px;
        }

        .mission-vision-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .mv-card {
          background-color: #0b0f17;
          border: 1px solid #1f2937;
          border-radius: 12px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .mv-card .icon-wrapper {
          background-color: #2a1215;
          border-radius: 8px;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .mv-card h2 {
          color: #ffffff;
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0 0 12px 0;
        }

        .mv-card p {
          color: #9ca3af;
          font-size: 0.95rem;
          line-height: 1.6;
          margin: 0;
        }
      `}</style>

      <Banner title="About Us" />

      {/* Story Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="section-dark about-page"
      >
        <div className="about-story">
          <div>
            <span className="section-kicker">OUR STORY</span>
            <h2>Helping Businesses Thrive</h2>
            <p>
              In today's fast-paced world, it is crucial for businesses to have a strong online presence.
              BTR Marketing Agency understands the importance of digital marketing and provides top-notch
              services to help businesses grow and succeed in the digital space.
            </p>
            <p>
              We are a full-service digital marketing agency specializing in comprehensive marketing solutions.
              Our experienced team crafts customized strategies that drive measurable business growth.
            </p>
          </div>
          <div className="years-card">
            <div>✦</div>
            <strong>15+ Years</strong>
            <small>of delivering digital excellence</small>
          </div>
        </div>
      </motion.section>

      {/* What We Do & Why Choose Us */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="section-dark split-panel"
      >
        <InfoSection title="What We Do ?" items={whatWeDoItems} />
        <InfoSection title="Why Choose Us ?" items={whyChooseUsItems} />
      </motion.section>

      {/* Stats Section */}
      <Stats />

      {/* Mission & Vision Section matching design */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="section-dark mission-vision-section"
      >
        <div className="mission-vision-container">
          <div className="mv-card">
            <div className="icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18h6" />
                <path d="M10 22h4" />
                <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
              </svg>
            </div>
            <h2>Mission</h2>
            <p>
              Our mission is to deliver innovative, reliable, and scalable IT solutions that help businesses grow and succeed in the digital world. We are committed to providing high-quality services, embracing the latest technologies, and building long-term relationships with our clients through trust, transparency, and excellence.
            </p>
          </div>

          <div className="mv-card">
            <div className="icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18h6" />
                <path d="M10 22h4" />
                <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
              </svg>
            </div>
            <h2>Vision</h2>
            <p>
              Our vision is to become a leading IT solutions provider recognized for creativity, technological expertise, and customer satisfaction. We aim to empower businesses worldwide by transforming ideas into powerful digital experiences that drive progress and innovation.
            </p>
          </div>
        </div>
      </motion.section>
    </>
  )
}