import TemplatePage from '../components/TemplatePage'
import { useState, useEffect } from 'react'

export default function Roadmap() {
  const [roadmapData, setRoadmapData] = useState({
    timeline: [],
    inProgress: [],
    planned: [],
    backlog: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadRoadmapData() {
      try {
        setLoading(true);
        const response = await fetch('/data/roadmap.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch roadmap data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setRoadmapData(data);
        setError(null);
      } catch (error) {
        console.error('Error loading roadmap data:', error);
        setError('Failed to load roadmap data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadRoadmapData();
  }, []);

  const renderTimeline = (timelineData) => {
    return timelineData.map((item, index) => (
      <div key={index} className={`timeline-item ${item.status}`}>
        <div className="timeline-content">
          <h3>{item.quarter}</h3>
          <p>{item.title}</p>
        </div>
      </div>
    ));
  };

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
    ));
  };

  return (
    <TemplatePage title="Project Roadmap - EDR Telemetry Project">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Project Roadmap</h1>
          <p>Explore our development timeline and future plans for the EDR Telemetry Project.</p>
        </div>
      </div>

      <div className="content-section">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading roadmap data...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button 
              className="action-button primary-button" 
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="timeline-container">
              <h2>Project Timeline</h2>
              <div className="timeline">
                {renderTimeline(roadmapData.timeline)}
              </div>
            </div>

            <div className="roadmap-container">
              {/* In Progress Section */}
              <div className="roadmap-section">
                <h2>🚀 In Progress</h2>
                <div className="roadmap-items">
                  {renderRoadmapSection(roadmapData.inProgress, 'in-progress')}
                </div>
              </div>

              {/* Planned Section */}
              <div className="roadmap-section">
                <h2>📋 Planned</h2>
                <div className="roadmap-items">
                  {renderRoadmapSection(roadmapData.planned, 'planned')}
                </div>
              </div>

              {/* Backlog Section */}
              <div className="roadmap-section">
                <h2>📌 Backlog</h2>
                <div className="roadmap-items">
                  {renderRoadmapSection(roadmapData.backlog, 'backlog')}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </TemplatePage>
  )
} 