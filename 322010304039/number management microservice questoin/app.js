var express = require('express');
var axios = require('axios');
var app = express();
const timeout = 500; // milliseconds

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;
  if (!urls) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }
  const urlList = Array.isArray(urls) ? urls : [urls];
  const fetchData = async (url) => {
    try {
      const response = await axios.get(url, { timeout:timeout });
      return response.data.numbers || [];
    } catch (error) {
      console.error(`got an error ${url}: ${error.message}`);
      return [];
    }
  };
  const uniqueNumbers = new Set();
  for (const url of urlList) {
    const numbers = await fetchData(url);
    numbers.forEach(number => uniqueNumbers.add(number));
  }
  const sortedNumbers = Array.from(uniqueNumbers).sort((a, b) => a - b);
  res.json({ numbers: sortedNumbers });
});
app.listen(4500);