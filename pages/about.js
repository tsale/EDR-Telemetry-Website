import TemplatePage from '../components/TemplatePage'
import { useEffect } from 'react'
import Link from 'next/link'
import { Target, Database, Users, MessageCircle, Twitter, Linkedin, Mail, ExternalLink, Shield, CheckCircle, TrendingUp } from 'lucide-react'

export default function About() {
  useEffect(() => {
    // Page initialization if needed
  }, []);

  return (
    <TemplatePage title="About the EDR Telemetry Project"
      description="Learn the mission, methodology, and transparency principles behind the EDR Telemetry Project.">
      
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-900/20 blur-[100px]"></div>
          <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-indigo-900/20 blur-[100px]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-6 backdrop-blur-sm">
            <Shield className="w-4 h-4 mr-2" />
            Our Mission & Values
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 !text-white">
            About the EDR Telemetry Project
          </h1>
          
          <div className="w-full flex justify-center">
            <p className="mt-6 text-xl !text-slate-300 max-w-3xl leading-relaxed text-center">
              EDR-Telemetry is an initiative by Defendpoint Consulting, designed to benchmark EDR products and show exactly what telemetry they capture.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Intro Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-slate-200">
            <p className="text-lg text-slate-700 leading-relaxed">
               Our mission is to give organizations clarity on their visibility gaps and help them build stronger, evidence-based security strategies. As part of Defendpoint Consulting&apos;s expertise, the project turns hands-on testing into practical guidance for defenders. We focus on repeatable benchmarking, transparent reporting, and advisory support that connects telemetry results to real-world security programs.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h2 id="project-goals" className="text-xl font-bold text-slate-900 mb-4">Project Goals</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-slate-600">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Compare EDR telemetry data collection</span>
                </li>
                <li className="flex items-start gap-2 text-slate-600">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Identify platform strengths and weaknesses</span>
                </li>
                <li className="flex items-start gap-2 text-slate-600">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Guide security professionals in tool selection</span>
                </li>
                <li className="flex items-start gap-2 text-slate-600">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Promote transparency in EDR capabilities</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 id="data-collection" className="text-xl font-bold text-slate-900 mb-4">Data Collection</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-slate-600">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Controlled environment testing</span>
                </li>
                <li className="flex items-start gap-2 text-slate-600">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Process monitoring analysis</span>
                </li>
                <li className="flex items-start gap-2 text-slate-600">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Network connection tracking</span>
                </li>
                <li className="flex items-start gap-2 text-slate-600">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>File activity monitoring</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h2 id="how-to-contribute" className="text-xl font-bold text-slate-900 mb-4">Contribute</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-slate-600">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <Link href="/contribute" className="text-blue-600 hover:underline font-medium">Contribution Page</Link>
                </li>
                <li className="flex items-start gap-2 text-slate-600">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <a href="https://detect.fyi/edr-telemetry-project-a-comprehensive-comparison-d5ed1745384b" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Read the Blog Post</a>
                </li>
                <li className="flex items-start gap-2 text-slate-600">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Submit issues and suggestions</span>
                </li>
                <li className="flex items-start gap-2 text-slate-600">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <Link href="/sponsorship" className="text-blue-600 hover:underline font-medium">Join our community</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Community-Driven Approach Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">A Community-Driven Project</h2>
            <p className="text-lg text-slate-600 mb-8">The EDR Telemetry Project operates within Defendpoint Consulting and is guided by a dedicated community of security professionals, researchers, and enthusiasts. While Kostas maintains the project, critical decisions and direction are shaped by:</p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Public Feedback</h3>
                <p className="text-slate-600">Input from users, researchers, and industry professionals helps ensure the project remains relevant and accurate. Every contribution matters.</p>
              </div>
              
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Discord Community</h3>
                <p className="text-slate-600">A trusted Discord community of contributors and supporters collaborates, discusses findings, and helps validate data. This active community plays a crucial role in maintaining quality and expanding coverage.</p>
              </div>
              
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Join Us</h3>
                <p className="text-slate-600">Our community welcomes anyone interested in EDR telemetry. You can join our Discord by <Link href="/contribute" className="text-blue-600 hover:underline font-medium">contributing to the project</Link> or <Link href="/sponsorship" className="text-blue-600 hover:underline font-medium">subscribing via the Support Us page</Link>. We value diverse perspectives and expertise levels.</p>
              </div>
            </div>
          </div>

          {/* Author Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 mb-12">
            <div className="md:flex">
              <div className="md:flex-shrink-0 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-8">
                <img 
                  src="https://pbs.twimg.com/profile_images/1324840358405046272/mAwSPmaX_400x400.jpg" 
                  alt="Kostas profile picture" 
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg" 
                />
              </div>
              <div className="p-8">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
                  <Shield className="w-4 h-4 mr-2" />
                  Project Maintainer
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Kostas</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  <strong>Kostas</strong> is a security researcher who focuses on Threat Intelligence, malware, Incident Response, and Threat Hunting. He leads Defendpoint Consulting&apos;s advisory research practice and serves as the main maintainer of the EDR Telemetry initiative, coordinating community efforts and ensuring the project stays true to its mission of providing transparent, evidence-based EDR telemetry comparisons.
                </p>
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-3">Connect with Kostas:</p>
                  <div className="flex flex-wrap gap-3">
                    <a 
                      href="https://twitter.com/kostastsale" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-lg transition-colors font-medium"
                    >
                      <Twitter className="w-4 h-4" />
                      @Kostastsale
                    </a>
                    <a 
                      href="https://www.linkedin.com/in/kostastsale/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-lg transition-colors font-medium"
                    >
                      <Linkedin className="w-4 h-4" />
                      /in/kostastsale
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-8 text-center border border-blue-100">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Get in Touch</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                If you have any questions, feedback, or are interested in contributing to the project or joining our Discord community, we&apos;d love to hear from you. For consulting engagements, reach out to the Defendpoint Consulting team directly.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  href="/contact" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
                >
                  Contact Us
                </Link>
                <Link 
                  href="/sponsorship" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-colors border border-slate-200 shadow-md hover:shadow-lg"
                >
                  Join Our Community
                </Link>
                <a
                  href="https://defendpoint.ca/#contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-colors border border-slate-200 shadow-md hover:shadow-lg"
                >
                  Defendpoint Consulting
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TemplatePage>
  )
} 
