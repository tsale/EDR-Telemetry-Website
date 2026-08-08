import fs from 'fs'
import path from 'path'
import TemplatePage from '../components/TemplatePage'

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'public/data/roadmap.json')
  const roadmapData = JSON.parse(fs.readFileSync(filePath, 'utf8'))

  return {
    props: {
      roadmapData,
    },
  }
}

export default function Roadmap({ roadmapData }) {
  const renderTimeline = (timelineData) => {
    return timelineData.map((item, index) => (
      <div key={index} className={`timeline-item ${item.status}`}>
        <div className="timeline-content">
          <h3>{item.quarter}</h3>
          <p>{item.title}</p>
        </div>
      </div>
    ))
  }

  const renderRoadmapSection = (items, sectionClass) => {
    return items.map((item, index) => (
      <div key={index} className={`roadmap-item ${sectionClass}`}>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        {item.items && (
          <ul>
            {item.items.map((subItem, subIndex) => (
              <li key={subIndex}>{subItem}</li>
            ))}
          </ul>
        )}
        <span className="status">{item.status}</span>
      </div>
    ))
  }

  return (
    <TemplatePage
      title="Project Roadmap - EDR Telemetry Project"
      description="Development timeline and upcoming plans for Windows, Linux, and macOS EDR telemetry coverage, scoring, and community contributions."
    >
      <div className="hero-section">
        <div className="hero-content">
          <h1>Project Roadmap</h1>
          <p>Explore our development timeline and future plans for the EDR Telemetry Project.</p>
        </div>
      </div>

      <div className="content-section">
        <div className="timeline-container">
          <h2>Project Timeline</h2>
          <div className="timeline">
            {renderTimeline(roadmapData.timeline)}
          </div>
        </div>

        <div className="roadmap-container">
          <div className="roadmap-section">
            <h2>🚀 In Progress</h2>
            <div className="roadmap-items">
              {renderRoadmapSection(roadmapData.inProgress, 'in-progress')}
            </div>
          </div>

          <div className="roadmap-section">
            <h2>📋 Planned</h2>
            <div className="roadmap-items">
              {renderRoadmapSection(roadmapData.planned, 'planned')}
            </div>
          </div>

          <div className="roadmap-section">
            <h2>📌 Backlog</h2>
            <div className="roadmap-items">
              {renderRoadmapSection(roadmapData.backlog, 'backlog')}
            </div>
          </div>
        </div>
      </div>
    </TemplatePage>
  )
}
