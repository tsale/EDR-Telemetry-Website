import TemplatePage from '../components/TemplatePage'
import { useEffect } from 'react'

export default function Contact() {
  useEffect(() => {
    // Add script for iframe resizer after component mounts
    const script1 = document.createElement('script');
    script1.src = 'https://formnx.com/js/iframeResizer.js';
    script1.async = true;
    document.body.appendChild(script1);
    
    const script2 = document.createElement('script');
    script2.src = 'https://formnx.com/js/widget.js';
    script2.async = true;
    document.body.appendChild(script2);
    
    // Clean up scripts when component unmounts
    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    }
  }, []);

  return (
    <TemplatePage title="Contact - EDR Telemetry Project">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Contact Us</h1>
          <p>Get in touch with us for questions, feedback, or sponsorship inquiries.</p>
        </div>
      </div>

      <div className="content-section">
        <div className="contact-form-container">
          {/* Google Form Embed */}
          <iframe 
            id="if21ap20" 
            src="https://fill.formnx.com/f/edr-telemetry-contact-form-21ap20" 
            frameBorder="0" 
            style={{ width: '1px', minWidth: '100%', height: '600px' }}
            title="Contact Form"
          ></iframe>
        </div>
      </div>
    </TemplatePage>
  )
} 