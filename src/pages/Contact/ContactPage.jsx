import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { Banner } from '../../components/shared/SiteComponents'
import { motion } from 'framer-motion'

export function ContactPage() {
  return (
    <>
      <Banner title="Contact Us" eyebrow="GET IN TOUCH" />
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="section-dark contact-page"
      >
        <div className="contact-info">
          <h2>Let&apos;s start a conversation</h2>
          <p>Have a question or a project in mind? Fill out the form or reach us through the channels below.</p>
          <div className="contact-item"><Mail /><span><strong>Email Us</strong><small>info@btrcommunication.com</small></span></div>
          <div className="contact-item"><Phone /><span><strong>Call Us</strong><small>8282833539 / 9874261416</small></span></div>
          <div className="contact-item"><MapPin /><span><strong>Visit Us</strong><small>129, Satyen Roy Road, Kolkata - 700034</small></span></div>
        </div>
        <form className="contact-form" onSubmit={event => { event.preventDefault(); alert('Message sent successfully') }}>
          <div><label>Full Name<input required placeholder="John Doe" /></label><label>Email Address<input required type="email" placeholder="john@example.com" /></label></div>
          <label>Subject<input required placeholder="How can we help?" /></label>
          <label>Message<textarea required rows="5" placeholder="Tell us about your project..."></textarea></label>
          <button className="button">Send message <ArrowUpRight size={15} /></button>
        </form>
      </motion.section>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="map-placeholder"
      >
        <MapPin /><span>Interactive map integration available</span>
      </motion.div>
    </>
  )
}
