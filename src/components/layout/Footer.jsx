import { serviceData } from '../../data/siteData'
import { go } from '../../utils/navigation'
import { Logo } from '../shared/SiteComponents'

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <Logo className="header-logo" />
          <p style={{ marginTop: '20px' }}>
            Transforming Ideas into Digital Excellence. Elevate your online presence with our innovative solutions and strategic digital services.
          </p>
          <div className="footer-social" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <a href="#" className="footer-social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="#" className="footer-social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
            </a>
            <a href="#" className="footer-social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a href="#" className="footer-social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path><path d="m10 15 5-3-5-3z"></path></svg>
            </a>
          </div>
        </div>

        <div>
          <h4>Services</h4>
          {serviceData.map(service => (
            <button key={service.slug} onClick={() => go(`/services/${service.slug}`)}>{service.title}</button>
          ))}
        </div>

        <div>
          <h4>Company</h4>
          <button onClick={() => go('/about')}>About us</button>
          <button onClick={() => go('/about')}>Our Team</button>
          <button onClick={() => go('/portfolio')}>Portfolio</button>
          <button onClick={() => go('/services')}>Services</button>
          <button onClick={() => go('/contact')}>Contact</button>
        </div>

        <div>
          <h4>Support</h4>
          <a href="tel:+918282823353" className="footer-support-link">Phone: 8282823353/ 9874261416 (Whatsapp)</a>
          <a href="mailto:info@btrcommunication.com" className="footer-support-link">Email: info@btrcommunication.com</a>
          <a href="https://maps.google.com/?q=129+Satyen+Roy+Road+Kolkata+700034" target="_blank" rel="noopener noreferrer" className="footer-support-link">Location: 129, Satyen Roy Road, Kolkata - 700034</a>
          <a href="https://maps.google.com/?q=129+Satyen+Roy+Road+Kolkata+700034" target="_blank" rel="noopener noreferrer" className="footer-support-link">View Map</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 BTR Communication. All rights reserved. Powered by BTR Communication.</span>
        <div className="footer-legal">
          <a href="#">Terms of Use</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </footer>
  )
}
