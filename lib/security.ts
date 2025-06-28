// Security compliance rule templates and service
import { SecurityComplianceRule, CreateSecurityComplianceRule, COLLECTIONS } from './models'
import { db } from './firebase'
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore'

export class SecurityComplianceService {
  
  // Get all security rules
  async getAllSecurityRules(): Promise<SecurityComplianceRule[]> {
    try {
      const rulesQuery = query(
        collection(db, COLLECTIONS.SECURITY_RULES),
        orderBy('category'),
        orderBy('severity', 'desc')
      )
      
      const snapshot = await getDocs(rulesQuery)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SecurityComplianceRule[]
      
    } catch (error) {
      console.error('Error getting security rules:', error)
      throw error
    }
  }

  // Get security rules by category
  async getSecurityRulesByCategory(category: string): Promise<SecurityComplianceRule[]> {
    try {
      const rulesQuery = query(
        collection(db, COLLECTIONS.SECURITY_RULES),
        where('category', '==', category),
        where('enabled', '==', true),
        orderBy('severity', 'desc')
      )
      
      const snapshot = await getDocs(rulesQuery)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SecurityComplianceRule[]
      
    } catch (error) {
      console.error('Error getting security rules by category:', error)
      throw error
    }
  }

  // Create security rule
  async createSecurityRule(data: CreateSecurityComplianceRule): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.SECURITY_RULES), data)
      return docRef.id
    } catch (error) {
      console.error('Error creating security rule:', error)
      throw error
    }
  }

  // Initialize default security rules
  async initializeDefaultSecurityRules(): Promise<void> {
    try {
      const defaultRules = this.getDefaultSecurityRules()
      
      for (const rule of defaultRules) {
        await this.createSecurityRule(rule)
      }
    } catch (error) {
      console.error('Error initializing default security rules:', error)
      throw error
    }
  }

  // Get default security rule templates
  private getDefaultSecurityRules(): CreateSecurityComplianceRule[] {
    return [
      // Git Security Rules
      {
        title: "No Hardcoded Secrets in Git",
        description: "Prevent committing API keys, passwords, or other secrets to git repositories",
        category: "git",
        severity: "critical",
        rule: `Never include hardcoded secrets in git commits. Always use environment variables or secure secret management:

- API keys should be in .env files (added to .gitignore)
- Database passwords should use environment variables
- Authentication tokens should be stored securely
- Use tools like git-secrets or pre-commit hooks to scan for secrets

Example of what NOT to do:
const API_KEY = "sk-1234567890abcdef"; // NEVER do this

Example of what TO do:
const API_KEY = process.env.OPENAI_API_KEY; // Use environment variables`,
        examples: [
          "Use process.env.API_KEY instead of hardcoding",
          "Add .env to .gitignore",
          "Use Azure Key Vault or AWS Secrets Manager for production",
          "Implement pre-commit hooks to scan for secrets"
        ],
        autoFix: false,
        enabled: true
      },
      {
        title: "Secure Git Branch Protection",
        description: "Ensure proper branch protection rules are in place",
        category: "git",
        severity: "high",
        rule: `Implement branch protection rules for production branches:

- Require pull request reviews before merging
- Dismiss stale reviews when new commits are pushed
- Require status checks to pass before merging
- Restrict who can push to the branch
- Require branches to be up to date before merging

GitHub branch protection settings:
- Enable "Require a pull request before merging"
- Enable "Require status checks to pass before merging"
- Enable "Restrict pushes that create files larger than 100 MB"`,
        examples: [
          "main branch requires 2 reviewers",
          "All checks must pass before merge",
          "No direct pushes to main branch",
          "Force push restrictions enabled"
        ],
        autoFix: false,
        enabled: true
      },

      // Firebase Security Rules
      {
        title: "Firebase Security Rules Validation",
        description: "Ensure Firebase security rules follow best practices",
        category: "firebase",
        severity: "critical",
        rule: `Firebase security rules must be properly configured:

- Never use allow read, write: if true; in production
- Always validate user authentication: request.auth != null
- Implement proper data validation rules
- Use resource-based security rules
- Validate data types and required fields

Example secure Firestore rules:
match /users/{userId} {
  allow read, write: if request.auth != null 
    && request.auth.uid == userId
    && validateUserData(request.resource.data);
}

function validateUserData(data) {
  return data.keys().hasAll(['name', 'email']) 
    && data.name is string 
    && data.email is string;
}`,
        examples: [
          "Authenticate users before data access",
          "Validate data structure and types",
          "Use resource.id for document-level security",
          "Test rules with Firebase emulator"
        ],
        autoFix: false,
        enabled: true
      },
      {
        title: "Firebase API Key Protection",
        description: "Properly secure Firebase configuration and API keys",
        category: "firebase",
        severity: "high",
        rule: `Firebase API keys and configuration must be properly secured:

- Firebase web API keys can be public but restrict by HTTP referrer
- Use Firebase App Check for additional security
- Implement proper authentication rules
- Monitor usage in Firebase console
- Use different projects for dev/staging/production

Firebase configuration security:
- Set up authorized domains in Firebase console
- Enable Firebase App Check for production
- Monitor authentication logs for suspicious activity
- Use Firebase Auth with proper providers`,
        examples: [
          "Configure authorized domains in Firebase console",
          "Enable Firebase App Check",
          "Use separate Firebase projects for different environments",
          "Monitor auth logs regularly"
        ],
        autoFix: false,
        enabled: true
      },

      // AWS Security Rules
      {
        title: "AWS IAM Least Privilege",
        description: "Implement least privilege access for AWS resources",
        category: "aws",
        severity: "critical",
        rule: `Follow AWS IAM least privilege principles:

- Grant only the minimum permissions required
- Use IAM roles instead of long-term access keys
- Implement resource-based policies where appropriate
- Regularly audit and rotate credentials
- Use AWS organizations for account separation

IAM best practices:
- Avoid using root account for daily tasks
- Enable MFA for all users
- Use temporary credentials via STS
- Implement policy conditions for IP restrictions
- Regular access reviews and cleanup

Example least privilege policy:
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": "arn:aws:s3:::specific-bucket/*"
    }
  ]
}`,
        examples: [
          "Use IAM roles instead of access keys",
          "Enable MFA for all privileged accounts",
          "Implement resource-specific permissions",
          "Regular credential rotation"
        ],
        autoFix: false,
        enabled: true
      },
      {
        title: "AWS S3 Bucket Security",
        description: "Secure S3 buckets against common vulnerabilities",
        category: "aws",
        severity: "high",
        rule: `S3 buckets must be properly secured:

- Block public access unless explicitly required
- Enable server-side encryption
- Use bucket policies for access control
- Enable logging and monitoring
- Implement versioning for critical data

S3 security checklist:
- Block all public access by default
- Enable S3 bucket encryption (SSE-S3 or SSE-KMS)
- Configure bucket policies for specific access
- Enable CloudTrail for access logging
- Use S3 access points for shared datasets

Example secure bucket policy:
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": ["arn:aws:s3:::bucket-name/*"],
      "Condition": {
        "Bool": {
          "aws:SecureTransport": "false"
        }
      }
    }
  ]
}`,
        examples: [
          "Enable bucket encryption by default",
          "Block public access settings",
          "Require HTTPS for all requests",
          "Enable access logging"
        ],
        autoFix: false,
        enabled: true
      },

      // General Security Rules
      {
        title: "Input Validation and Sanitization",
        description: "Implement proper input validation for all user inputs",
        category: "general",
        severity: "high",
        rule: `All user inputs must be validated and sanitized:

- Validate input types, lengths, and formats
- Sanitize inputs to prevent injection attacks
- Use parameterized queries for database operations
- Implement content security policies
- Escape outputs appropriately

Input validation checklist:
- Check data types and ranges
- Validate against allowed patterns (regex)
- Sanitize HTML and SQL inputs
- Use ORM/ODM with built-in protections
- Implement rate limiting for APIs

Example input validation:
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

const sanitizeInput = (input) => {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};`,
        examples: [
          "Validate email formats with regex",
          "Sanitize HTML inputs",
          "Use parameterized SQL queries",
          "Implement API rate limiting"
        ],
        autoFix: false,
        enabled: true
      },
      {
        title: "HTTPS and Secure Communication",
        description: "Ensure all communications use secure protocols",
        category: "general",
        severity: "high",
        rule: `All network communications must use secure protocols:

- Use HTTPS for all web traffic
- Implement proper TLS certificate management
- Use secure WebSocket connections (WSS)
- Validate SSL/TLS certificates
- Implement certificate pinning where appropriate

Secure communication checklist:
- Force HTTPS redirects
- Use HSTS headers
- Implement proper certificate validation
- Use secure cookie flags
- Encrypt sensitive data in transit

Example secure headers:
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});`,
        examples: [
          "Force HTTPS with automatic redirects",
          "Implement HSTS headers",
          "Use secure cookie flags",
          "Validate SSL certificates"
        ],
        autoFix: false,
        enabled: true
      }
    ]
  }
}

// Export singleton instance
export const securityComplianceService = new SecurityComplianceService()

// Export default security rules for easy access
export const DEFAULT_SECURITY_RULES = {
  GIT: ['No Hardcoded Secrets in Git', 'Secure Git Branch Protection'],
  FIREBASE: ['Firebase Security Rules Validation', 'Firebase API Key Protection'],
  AWS: ['AWS IAM Least Privilege', 'AWS S3 Bucket Security'],
  GENERAL: ['Input Validation and Sanitization', 'HTTPS and Secure Communication']
}