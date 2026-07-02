export interface Job {
  id: string;
  title: string;
  company: string;
  type: string[];
  posted: string;
  description: string;
  salary: string;
  location: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  aboutCompany: string;
}

export const jobs: Job[] = [
  {
    id: "1",
    title: "Digital Marketing Intern",
    company: "Hously Finntech Realty",
    type: ["Internship", "Remote"],
    posted: "Nov 18, 2025",
    description: "Assist in planning and execution of digital marketing campaigns, manage social media, and analyze performance metrics.",
    salary: "Negotiable",
    location: "Remote",
    requirements: [
      "Enrolled in or graduate from a relevant program (Marketing, Communications, or related field)",
      "Strong understanding of digital marketing concepts (SEO, SEM, SMM, Email Marketing)",
      "Familiarity with tools like Google Analytics, Google Ads, Canva or Mailchimp (preferred)",
      "Creative thinking, attention to detail, and excellent communication skills",
      "Ability to work both independently and in a team"
    ],
    responsibilities: [
      "Assist in the planning and execution of digital marketing campaigns",
      "Manage social media accounts and create engaging content",
      "Conduct keyword research and support SEO/SEM strategies",
      "Monitor and analyze performance metrics using Google Analytics and other tools",
      "Contribute to user engagement and lead generation initiatives",
      "Collaborate with the team on marketing strategies and brand positioning"
    ],
    benefits: [
      "Hands-on experience with real digital marketing campaigns",
      "Certificate of Internship & Letter of Recommendation",
      "Opportunity to develop a professional portfolio through live projects"
    ],
    aboutCompany: "Converting innovation into technology - Hously Finntech Realty is a forward-thinking technology company that transforms innovative ideas into practical solutions. We specialize in digital transformation, AI/ML solutions, and cutting-edge web technologies."
  },
  {
    id: "2",
    title: "Python Developer Intern",
    company: "Hously Finntech Realty",
    type: ["Internship", "Hybrid"],
    posted: "Nov 14, 2025",
    description: "Work on AI/ML, Django, API automation, and blockchain-based solutions.",
    salary: "Negotiable",
    location: "Hybrid",
    requirements: [
      "Proficiency in Python programming",
      "Basic understanding of Django/Flask frameworks",
      "Knowledge of REST APIs",
      "Familiarity with databases (SQL/NoSQL)",
      "Problem-solving mindset"
    ],
    responsibilities: [
      "Develop and maintain Python applications",
      "Work on AI/ML model integration",
      "Create and maintain APIs",
      "Collaborate with frontend developers",
      "Write clean, efficient code"
    ],
    benefits: [
        "Real-world project experience",
        "Mentorship from senior developers",
        "Flexible work hours",
        "Certificate upon completion"
    ],
    aboutCompany: "Hously Finntech Realty delivers innovative web, cloud, and AI services."
  },
  {
    id: "3",
    title: "IT Documentation Intern",
    company: "Hously Finntech Realty",
    type: ["Internship", "Remote"],
    posted: "Oct 08, 2025",
    description: "Create technical documentation, system guides, and assist IT teams.",
    salary: "Negotiable",
    location: "Remote",
    requirements: [
      "Strong technical writing skills",
      "Attention to detail",
      "Ability to explain complex concepts simply",
      "Basic understanding of IT systems",
      "Good communication skills"
    ],
    responsibilities: [
      "Create technical documentation",
      "Develop system guides and manuals",
      "Assist IT teams with documentation",
      "Maintain documentation library",
      "Update existing documentation"
    ],
    benefits: [
      "Learn technical writing best practices",
      "Work with experienced IT professionals",
      "Build a portfolio of technical documents",
      "Remote work flexibility"
    ],
    aboutCompany: "Hously Finntech Realty is committed to creating clear and effective technical documentation."
  }
];

export function getJobById(id: string): Job | undefined {
  return jobs.find(job => job.id === id);
}