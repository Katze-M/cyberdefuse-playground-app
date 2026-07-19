export const s3ExposureSnippet = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::customer-data-bucket/*"
    }
  ]
}`;

export const sqlInjectionSnippet = `app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  
  // VULNERABLE: Direct string concatenation
  const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
  
  try {
    const result = await db.execute(query);
    if (result.length > 0) return res.json({ success: true, user: result[0] });
    return res.status(401).json({ error: "Invalid credentials" });
  } catch (err) {
    return res.status(500).json({ error: "Database error" });
  }
});`;

export const ssrfSnippet = `app.get("/api/fetch-image", async (req, res) => {
  const imageUrl = req.query.url;
  
  if (!imageUrl) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    // VULNERABLE: Fetches any URL without validating the destination
    const response = await fetch(imageUrl);
    const data = await response.blob();
    
    res.type(response.headers.get("content-type"));
    res.send(Buffer.from(await data.arrayBuffer()));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch image" });
  }
});`;

export const iamPrivilegeEscalationSnippet = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "iam:PutUserPolicy",
        "iam:AttachUserPolicy"
      ],
      "Resource": "*"
    }
  ]
}`;

export const storedXssSnippet = `app.get("/api/comments", async (req, res) => {
  const comments = await db.query("SELECT * FROM comments");
  
  // VULNERABLE: Returning raw comments that contain unsanitized HTML/JS
  let htmlResponse = "<html><body><h1>Comments</h1><ul>";
  
  for (let comment of comments) {
    // Missing sanitization here!
    htmlResponse += "<li>" + comment.text + "</li>";
  }
  
  htmlResponse += "</ul></body></html>";
  res.send(htmlResponse);
});`;

export const insecureDeserializationSnippet = `const serialize = require('node-serialize');

app.post("/api/profile", (req, res) => {
  const cookieData = req.cookies.profileData;
  
  if (cookieData) {
    try {
      // VULNERABLE: Unserializing untrusted user input allows Remote Code Execution (RCE)
      const userProfile = serialize.unserialize(cookieData);
      return res.json({ status: "success", profile: userProfile });
    } catch (e) {
      return res.status(400).json({ error: "Invalid profile format" });
    }
  }
  res.status(401).send("No profile found.");
});`;

export const mitmSnippet = `const http = require('http');
const express = require('express');
const app = express();

app.post("/login", (req, res) => {
  // Authentication logic here
  res.send("Logged in!");
});

// VULNERABLE: Server running on plain HTTP, exposing traffic to interception
const server = http.createServer(app);

server.listen(80, () => {
  console.log("Server listening on port 80");
});`;

export const sessionHijackingSnippet = `const session = require('express-session');
const express = require('express');
const app = express();

// VULNERABLE: Missing HttpOnly and Secure flags on the session cookie
app.use(session({
  secret: 'super-secret-key-123',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

app.get("/dashboard", (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  res.send("Welcome to your dashboard!");
});`;

export const bruteForceSnippet = `const express = require('express');
const app = express();

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  
  // VULNERABLE: No rate limiting applied to this authentication route
  const user = await db.users.find({ email });
  
  if (user && await bcrypt.compare(password, user.passwordHash)) {
    return res.json({ token: "auth-token-123" });
  }
  
  // Attacker can try again infinitely without delay
  res.status(401).json({ error: "Incorrect credentials" });
});`;

export const commandInjectionSnippet = `const { exec } = require('child_process');
const express = require('express');
const app = express();

app.post("/api/ping", (req, res) => {
  const { ip } = req.body;
  
  // VULNERABLE: Unsanitized input passed directly to the shell
  exec('ping -c 4 ' + ip, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: "Ping failed" });
    }
    res.json({ output: stdout });
  });
});`;

export const pathTraversalSnippet = `const fs = require('fs');
const express = require('express');
const app = express();

app.get("/api/download", (req, res) => {
  const filename = req.query.file;
  
  if (!filename) return res.status(400).send("File required");

  // VULNERABLE: No path sanitization allows directory traversal
  const filePath = './uploads/' + filename;
  
  try {
    const fileContent = fs.readFileSync(filePath);
    res.send(fileContent);
  } catch (err) {
    res.status(404).send("File not found");
  }
});`;

export const idorSnippet = `const express = require('express');
const app = express();

app.get("/api/users/:id", async (req, res) => {
  const userId = req.params.id;
  const loggedInUserId = req.session.userId;
  
  if (!loggedInUserId) return res.status(401).send("Unauthorized");

  // VULNERABLE: No check if loggedInUserId matches the requested userId (IDOR)
  const userData = await db.users.findById(userId);
  
  if (userData) {
    res.json(userData);
  } else {
    res.status(404).send("User not found");
  }
});`;

export const csrfSnippet = `const express = require('express');
const app = express();

app.post("/api/update-email", async (req, res) => {
  const { newEmail } = req.body;
  const userId = req.cookies.userId;
  
  if (!userId) return res.status(401).send("Not logged in");

  // VULNERABLE: No CSRF token validation. Relies solely on the cookie.
  await db.users.update({ id: userId }, { email: newEmail });
  
  res.send("Email updated successfully");
});`;

export const openRedirectSnippet = `const express = require('express');
const app = express();

app.get("/login", (req, res) => {
  const nextUrl = req.query.next || '/dashboard';
  
  // VULNERABLE: Unsanitized redirect parameter allows Open Redirect
  // E.g. /login?next=http://evil.com
  res.redirect(nextUrl);
});`;

export const ddosSnippet = `const express = require('express');
const app = express();

// VULNERABLE: A heavy endpoint with no rate limiting
app.get("/api/search", async (req, res) => {
  const query = req.query.q;
  
  // Simulating a highly CPU/DB intensive search operation
  const results = await db.execute("SELECT * FROM massive_table WHERE data LIKE '%" + query + "%'");
  
  res.json({ results });
});

app.listen(8080, () => {
  console.log("Server online");
});`;

