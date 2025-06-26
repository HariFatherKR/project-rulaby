// Sample data for testing Firestore models
import { CreatePromptRule, CreateContextProfile } from './models'

export const samplePromptRules: CreatePromptRule[] = [
  {
    title: "Use Given-When-Then",
    content: "Use G-W-T format when writing test prompts for better clarity",
    category: "testing",
    createdBy: "uid_sample_user"
  },
  {
    title: "Include Context in Code Reviews",
    content: "Always provide sufficient context when asking for code reviews",
    category: "code-review",
    createdBy: "uid_sample_user"
  },
  {
    title: "Specify Technology Stack",
    content: "Always mention the technology stack when asking for implementation help",
    category: "development",
    createdBy: "uid_sample_user"
  }
]

export const sampleContextProfiles: CreateContextProfile[] = [
  {
    role: "Frontend Engineer",
    basePrompt: "You are an experienced frontend React developer with expertise in TypeScript, Next.js, and modern web development practices. Focus on component design, performance, and user experience.",
    maintainedBy: "uid_frontend_lead"
  },
  {
    role: "Backend Engineer", 
    basePrompt: "You are a senior backend developer experienced with Node.js, databases, and API design. Focus on scalable architecture, security, and performance optimization.",
    maintainedBy: "uid_backend_lead"
  },
  {
    role: "DevOps Engineer",
    basePrompt: "You are a DevOps specialist with expertise in cloud infrastructure, CI/CD, and deployment automation. Focus on reliability, monitoring, and efficient deployment processes.",
    maintainedBy: "uid_devops_lead"
  }
]