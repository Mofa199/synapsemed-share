async function testAdmin() {
  console.log("Starting Admin API Tests...");
  
  // 1. Login
  const loginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'mofas199@gmail.com', password: 'admin123' })
  });
  
  const loginData = await loginRes.json();
  console.log("Login Status:", loginRes.status, loginData.success ? "Success" : "Failed");
  
  if (!loginData.success) {
    console.log("Failed to login as admin. Check credentials or ensure the server is running.");
    return;
  }
  
  // Get cookies (Node fetch handles multiple Set-Cookie headers by joining them with comma, which is fine for Cookie header)
  let cookiesToUse = '';
  // Try to parse the raw headers if available to construct a better cookie string
  const rawCookies = loginRes.headers.get('set-cookie');
  if (rawCookies) {
      cookiesToUse = rawCookies;
      console.log("Cookies acquired.");
  } else {
      console.log("Warning: No cookies found in login response.");
  }

  const routesToTest = [
    '/admin',
    '/admin/users',
    '/admin/content',
    '/admin/analytics',
    '/admin/curriculum',
    '/admin/team',
    '/admin/messages',
    '/api/admin/stats',
    '/api/users',
    '/api/admin/activities'
  ];

  for (const route of routesToTest) {
    try {
      const res = await fetch(`http://localhost:3000${route}`, {
        headers: {
          'Cookie': cookiesToUse
        }
      });
      
      console.log(`[${res.status}] GET ${route}`);
      
      if (res.status >= 500) {
        const text = await res.text();
        console.log(`ERROR from ${route}:`, text.substring(0, 150), '...');
      }
    } catch (e) {
      console.log(`Exception fetching ${route}:`, e.message);
    }
  }
}

testAdmin();
