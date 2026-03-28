const http = require('http');

const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/api/courses',
  method: 'GET',
  family: 6 // Force IPv6 if listening on ::1
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.end();
