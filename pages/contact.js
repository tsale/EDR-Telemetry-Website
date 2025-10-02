import TemplatePage from '../components/TemplatePage'
import { useEffect } from 'react'
import Script from 'next/script'

export default function Contact() {

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    // Add script for iframe resizer after component mounts
    const script1 = document.createElement('script')
    script1.src = 'https://formnx.com/js/iframeResizer.js'
    script1.async = true
    document.body.appendChild(script1)

    const script2 = document.createElement('script')
    script2.src = 'https://formnx.com/js/widget.js'
    script2.async = true
    document.body.appendChild(script2)

    // Clean up scripts when component unmounts
    return () => {
      if (script1.parentNode) {
        script1.parentNode.removeChild(script1)
      }

      if (script2.parentNode) {
        script2.parentNode.removeChild(script2)
      }
    }
  }, [])

  // no Cal script initialization needed when using iframe embed

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
            style={{ width: '1px', minWidth: '100%', height: '600px' }}
            title="Contact Form"
          ></iframe>
        </div>
      </div>

      <section className="calendar-section">
        <div className="section-header" style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
          <h2>Schedule a Consultation</h2>
          <p>Book a time to discuss your telemetry goals with Defendpoint Consulting.</p>
        </div>
        <div style={{ width: '100%', minHeight: 720 }}>
          <div
            style={{ width: '100%', height: '100%', overflow: 'scroll', minHeight: 720 }}
            id="my-cal-inline-edr-telemetry-discussion-call"
          ></div>
        </div>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          If the calendar does not load, open the scheduling page directly at{' '}
          <a
            href="https://cal.com/kostas-hcq78e/edr-telemetry-discussion-call"
            target="_blank"
            rel="noopener noreferrer"
          >
            cal.com/kostas-hcq78e/edr-telemetry-discussion-call
          </a>
          .
        </p>
      </section>
      <Script id="cal-inline-embed-contact" strategy="afterInteractive">
        {`(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
Cal("init", "edr-telemetry-discussion-call", {origin:"https://app.cal.com"});

Cal.ns["edr-telemetry-discussion-call"]("inline", {
  elementOrSelector:"#my-cal-inline-edr-telemetry-discussion-call",
  config: {"layout":"month_view","theme":"auto"},
  calLink: "kostas-hcq78e/edr-telemetry-discussion-call",
});

Cal.ns["edr-telemetry-discussion-call"]("ui", {"hideEventTypeDetails":false,"layout":"month_view"});`}
      </Script>
    </TemplatePage>
  )
}