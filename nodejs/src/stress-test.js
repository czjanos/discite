const axios = require('axios');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');
const { performance } = require('perf_hooks');

// Create a wrapped Axios instance with cookie support
const client = wrapper(axios.create());

function parseCsrfToken(responseData) {
  // Regular expression to match CSRF token value
  const csrfTokenRegex = /CSRFToken=([a-f0-9]+)/;

  // Searching for the CSRF token in the response data
  const match = csrfTokenRegex.exec(responseData);

  if (match && match[1]) {
    // Return the captured group which contains the token
    return match[1];
  } else {
    // Token not found or response is in an unexpected format
    throw new Error("CSRF token not found in the response");
  }
}

async function sendRequest(login_time) {
  const cookieJar = new CookieJar();

  try {
    // Visit the index page to get the CSRF token
    const indexResponse = await client.get('http://localhost:3000/', { jar: cookieJar, withCredentials: true });
    console.log(`[stress] Index Response Code: ${indexResponse.status}`);
    // Parse the CSRF token from the indexResponse
    const token = parseCsrfToken(indexResponse.data); // Implement this function based on your response structure
    console.log(`[stress] CSRF token: ${token}`);

    // Use the CSRF token for the try-out request
    const loginResponse = await client.get(`http://localhost:3000/try-out?CSRFToken=${token}`, { jar: cookieJar, withCredentials: true });
    console.log(`[stress] Login Response Code: ${loginResponse.status}`);

    // Wait for 10 seconds
    await new Promise(resolve => setTimeout(resolve, login_time * 1000));

    // Use the CSRF token for the logout request
    const logoutResponse = await client.get(`http://localhost:3000/logout?CSRFToken=${token}`, { jar: cookieJar, withCredentials: true });
    console.log(`[stress] Logout Response Code: ${logoutResponse.status}`);
  } catch (error) {
    console.error(`[stress] Error: ${error.message}`);
  }
}

async function stressTest(instances, login_time, duration) {
  const startTime = performance.now();
  const promises = [];

  for (let i = 0; i < instances; i++) {
    if (performance.now() - startTime > duration * 1000) {
      break;
    }

    promises.push(sendRequest(login_time));

    await new Promise(resolve => setTimeout(resolve, duration * 1000 / instances));
  }

  await Promise.all(promises);
}

const VISITS = 10;
const DURATION = 10; // Duration in seconds

//stressTest(VISITS, DURATION);

module.exports ={
  stressTest
}