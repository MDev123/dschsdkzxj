const express = require('express');
const app = express();

const apiKeys = {
  'key0': true,
  'key1': true,
  'key2': true,
  '7t=;ph:qqpH&yvTsF3kt': true,
  'GZh3c0zEpJFcH3SX': true,
};

const apiLimits = {
  'key0': 1,
  'key1': 50,
  'key2': 200,
  '7t=;ph:qqpH&yvTsF3kt': Infinity
}

// ?length=16&complexity=high?

const requests = {};

// Function to update the apiKeys object with the new API key generated by the HTML page
function updateApiKeys(newApiKey) {
  apiKeys[newApiKey] = true;
}

app.get('/password', (req, res) => {
  const apiKey = req.query.key;
  if (!apiKeys[apiKey]) {
    return res.status(401).json({ message: 'Invalid API key' });
  }

  const limit = apiLimits[apiKey];
  if (limit !== Infinity) {
    requests[apiKey] = requests[apiKey] || 0;
    requests[apiKey]++;
    if (requests[apiKey] > limit) {
      return res.status(429).json({ message: 'API request limit exceeded. Please contact support for a new key.' });
    }
  }

  const length = req.query.length || 10; // default length is 10
  const complexity = req.query.complexity || 'medium'; // default complexity is medium
  const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-={}[]|:;"<>,.?/~`';
  let chars = '';
  let password = '';
  
  if (complexity === 'low') {
    chars = upperCase + lowerCase + numbers;
  } else if (complexity === 'high') {
    chars = upperCase + lowerCase + numbers + symbols;
  } else {
    chars = upperCase + lowerCase + numbers + symbols.slice(0, 10); // use only first 10 symbols for medium complexity
  }
  
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  res.json({ password });
});

app.use(function(req, res, next) {
  res.status(404).send("Sorry, the requested resource was not found.");
});


app.listen(3420, () => {
  console.log('API is running on port 3420');
});
