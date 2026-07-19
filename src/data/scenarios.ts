import * as snippets from "./snippets";

export type Language = "json" | "javascript" | "sql";

export interface Scenario {
  id: string;
  title: string;
  description: string;
  vulnerabilityContext: string;
  initialCode: string;
  language: Language;
  mentorBriefing: string;
}

export const scenarios: Scenario[] = [
  {
    id: "s3-exposure",
    title: "S3 Bucket Exposure",
    description: "An S3 bucket has an overly permissive IAM policy, leaking customer data.",
    vulnerabilityContext: "The system currently has an S3 bucket with an overly permissive IAM policy allowing public 's3:GetObject'. Evaluate if the patch restricts access (e.g., removing wildcards, adding conditions, or denying public access).",
    initialCode: snippets.s3ExposureSnippet,
    language: "json",
    mentorBriefing: "Welcome to CyberDefuse_OS. We have an active breach! An S3 bucket is leaking customer data. Review the IAM policy in the terminal and deploy a patch to restrict access immediately!"
  },
  {
    id: "sql-injection",
    title: "SQL Injection",
    description: "An API endpoint is vulnerable to SQL injection via user input.",
    vulnerabilityContext: "An Express endpoint constructs a SQL query by concatenating user input directly into the string, allowing SQL Injection. Evaluate if the patch correctly implements parameterized queries or escapes input to prevent injection.",
    initialCode: snippets.sqlInjectionSnippet,
    language: "javascript",
    mentorBriefing: "Alert! Hackers are trying to bypass authentication using SQL Injection. They are injecting malicious payloads into the login form. Update the backend code to use parameterized queries and stop the breach!"
  },
  {
    id: "ssrf",
    title: "Server-Side Request Forgery (SSRF)",
    description: "An image fetcher service can be tricked into making requests to internal servers.",
    vulnerabilityContext: "A proxy/fetcher endpoint takes a user-provided URL and fetches it. It currently doesn't check if the URL points to internal IP addresses (like localhost, 127.0.0.1, 169.254.169.254, or internal network ranges). Evaluate if the patch validates the URL and blocks internal requests.",
    initialCode: snippets.ssrfSnippet,
    language: "javascript",
    mentorBriefing: "Critical! Our image preview service is being used as a proxy to scan our internal network (SSRF). Attackers are probing internal metadata servers. Add validation to block requests to localhost and private IP ranges!"
  },
  {
    id: "iam-privilege-escalation",
    title: "IAM Privilege Escalation",
    description: "An attacker compromises an identity with low-level permissions and exploits a poorly configured policy to grant themselves administrative or root control.",
    vulnerabilityContext: "The IAM policy currently allows 'iam:PutUserPolicy' or 'iam:AttachUserPolicy' with a wildcard Resource, which allows a user to grant themselves any permissions including AdministratorAccess. Evaluate if the patch correctly restricts the resources or removes these escalation vectors.",
    initialCode: snippets.iamPrivilegeEscalationSnippet,
    language: "json",
    mentorBriefing: "Warning! A compromised junior developer account is trying to escalate to AdministratorAccess by attaching policies to themselves. Restrict the IAM policy immediately so they can only attach policies to specific limited resources."
  },
  {
    id: "stored-xss",
    title: "Stored Cross-Site Scripting (XSS)",
    description: "A hacker injects a malicious JavaScript snippet into a comment section, which runs inside the browser of any innocent user.",
    vulnerabilityContext: "An Express endpoint accepts a user comment and stores it in the database. When rendering it to other users, it directly injects the raw HTML/script tags into the DOM without sanitization. Evaluate if the patch implements HTML encoding/sanitization or uses a safe templating engine.",
    initialCode: snippets.storedXssSnippet,
    language: "javascript",
    mentorBriefing: "Red alert! Attackers are dropping malicious JavaScript in our product reviews, stealing session cookies from any customer who visits the page. Update the route to sanitize or encode the comment text before sending it out!"
  },
  {
    id: "insecure-deserialization",
    title: "Insecure Deserialization",
    description: "An attacker tampers with serialized data strings, executing malicious code directly on the backend.",
    vulnerabilityContext: "An application parses a serialized object from a user-controlled cookie using a vulnerable function (like eval or vulnerable implementations of node-serialize). Evaluate if the patch switches to a safe parsing mechanism like JSON.parse().",
    initialCode: snippets.insecureDeserializationSnippet,
    language: "javascript",
    mentorBriefing: "We have an RCE breach! An attacker manipulated their 'profileData' serialized cookie to execute system commands on our server. Switch the deserialization library to a safe alternative like standard JSON parsing."
  },
  {
    id: "mitm",
    title: "Man-in-the-Middle (MitM)",
    description: "An attacker intercepts unencrypted data packets (like passwords or cookies) as they travel across the network.",
    vulnerabilityContext: "The application is initializing its server over plain HTTP instead of HTTPS, exposing all traffic in plaintext. Evaluate if the patch correctly changes the server creation to use HTTPS with TLS certificates, or enforces Strict-Transport-Security (HSTS).",
    initialCode: snippets.mitmSnippet,
    language: "javascript",
    mentorBriefing: "Traffic alert! An attacker is sitting on a public Wi-Fi network intercepting our users' passwords because our login server is using plain HTTP. Update the server configuration to use HTTPS and encrypt the traffic!"
  },
  {
    id: "session-hijacking",
    title: "Session Hijacking",
    description: "An attacker steals a user's valid login session cookie to bypass the login screen entirely.",
    vulnerabilityContext: "The application creates a session cookie but fails to set the 'HttpOnly' and 'Secure' flags. This allows JavaScript (XSS) to read the cookie and means it can be sent over unencrypted connections. Evaluate if the patch adds both the HttpOnly and Secure flags to the cookie configuration.",
    initialCode: snippets.sessionHijackingSnippet,
    language: "javascript",
    mentorBriefing: "Security incident! Attackers are stealing session cookies using XSS because our cookies are accessible via JavaScript. Add the 'HttpOnly' and 'Secure' flags to the session configuration immediately!"
  },
  {
    id: "brute-force",
    title: "Credential Stuffing / Brute Force",
    description: "Automated bots flood a login endpoint with thousands of leaked or guessed password combinations every second.",
    vulnerabilityContext: "The login endpoint has no rate limiting or lockout mechanism. An attacker can try millions of passwords without being stopped. Evaluate if the patch introduces a rate limiter middleware (like express-rate-limit) to the login route.",
    initialCode: snippets.bruteForceSnippet,
    language: "javascript",
    mentorBriefing: "We are under a massive botnet attack! Thousands of login attempts per second are hitting our authentication endpoint. Import and apply rate-limiting middleware to the login route to shut down the brute force attack."
  },
  {
    id: "command-injection",
    title: "Command Injection",
    description: "An attacker injects OS commands into a backend utility, gaining unauthorized shell access.",
    vulnerabilityContext: "A backend ping utility uses child_process.exec() but doesn't sanitize the user's IP input. An attacker can inject shell commands using semicolons (e.g. 127.0.0.1; cat /etc/passwd). Evaluate if the patch switches to child_process.execFile() or spawns a command with strict argument escaping.",
    initialCode: snippets.commandInjectionSnippet,
    language: "javascript",
    mentorBriefing: "Critical incident! Hackers are dropping malicious shell payloads into our network ping tool to explore our local filesystem. Fix the backend code so it safely handles arguments without passing them to a raw shell!"
  },
  {
    id: "path-traversal",
    title: "Path Traversal (Directory Traversal)",
    description: "An endpoint reads files directly from the filesystem using unsanitized user input, leaking system secrets.",
    vulnerabilityContext: "A file download endpoint directly concatenates user input to read a file from the server. An attacker can use '../' to navigate outside the intended directory. Evaluate if the patch sanitizes the input (e.g., using path.basename or path.normalize) and ensures the resolved path is within the safe directory.",
    initialCode: snippets.pathTraversalSnippet,
    language: "javascript",
    mentorBriefing: "Warning! We are leaking sensitive files like /etc/shadow because an attacker is using '../' sequences in our download API. Update the file handling logic to strictly sanitize the file path and prevent directory traversal."
  },
  {
    id: "idor",
    title: "Broken Access Control (IDOR)",
    description: "An Insecure Direct Object Reference (IDOR) allows an attacker to fetch data belonging to other users.",
    vulnerabilityContext: "An API endpoint fetches user data based on the URL parameter without verifying if the logged-in user actually owns that ID. Evaluate if the patch correctly checks if req.session.userId matches req.params.id (or if the user has admin roles) before returning the data.",
    initialCode: snippets.idorSnippet,
    language: "javascript",
    mentorBriefing: "Data breach! Regular users are viewing the profiles of administrators by simply changing the user ID in the API URL. Implement an authorization check to ensure users can only access their own data."
  },
  {
    id: "csrf",
    title: "Cross-Site Request Forgery (CSRF)",
    description: "An attacker tricks an innocent user into executing state-changing requests without their knowledge.",
    vulnerabilityContext: "A sensitive endpoint (like updating an email) relies only on session cookies for authentication, without a CSRF token. Evaluate if the patch introduces CSRF protection, such as verifying a CSRF token from the request body against the session, or enforcing the SameSite cookie attribute.",
    initialCode: snippets.csrfSnippet,
    language: "javascript",
    mentorBriefing: "Attackers are tricking our users into clicking malicious links that automatically change their account emails! The session cookie is sent automatically by the browser. Implement CSRF protection to verify the origin of these requests."
  },
  {
    id: "open-redirect",
    title: "Open Redirect",
    description: "A login page redirects users to a malicious site using an unsanitized URL parameter.",
    vulnerabilityContext: "A redirect endpoint takes a user-supplied URL and redirects to it without validation. Attackers use this to craft phishing links that look legitimate. Evaluate if the patch validates that the redirect URL is a relative path (e.g., starts with '/') or belongs to a whitelist of trusted domains.",
    initialCode: snippets.openRedirectSnippet,
    language: "javascript",
    mentorBriefing: "Phishing alert! Attackers are sending our users links like '/login?next=http://evil.com', which silently redirects them to a fake login page after they authenticate. Secure the redirect logic to only allow relative paths."
  },
  {
    id: "ddos",
    title: "Distributed Denial of Service (DDoS)",
    description: "A botnet floods a resource-intensive API endpoint, exhausting server capacity and crashing the service.",
    vulnerabilityContext: "A public search API performs a highly CPU/Database intensive operation without any rate limiting. Evaluate if the patch implements an IP-based rate limiter (e.g., using express-rate-limit) to reject requests if they exceed a reasonable threshold.",
    initialCode: snippets.ddosSnippet,
    language: "javascript",
    mentorBriefing: "RED ALERT! A massive botnet is hammering our heavy database search endpoint! Our CPU usage is at 100% and legitimate users are timing out. Implement a rate limiter immediately to drop the flood of malicious traffic before the server completely crashes."
  }
];
