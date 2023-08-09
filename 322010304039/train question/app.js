const express = require('express');
const axios = require('axios');
const app = express();
const CLIENT_ID = '322010304039';
const CLIENT_SECRET = 'oJnNPG';
const AUTH_TOKEN = 'oJnNPG';

app.get('/trains', async (req, res) => {
  try {
    const response = await axios.get('http://20.244.56.144/train/trains', {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    const filteredTrains = response.data.filter(train => {
      const currentTime = new Date();
      const departureTime = new Date(train.departureTime);
      const timeDifference = departureTime.getTime() - currentTime.getTime();
      const minutesUntilDeparture = timeDifference / (1000 * 60);
      return minutesUntilDeparture > 30;
    });
    const sortedTrains = filteredTrains.sort((a, b) => {
      if (a.price.AC === b.price.AC) {
        if (a.price.sleeper === b.price.sleeper) {
          return b.seatsAvailable.AC - a.seatsAvailable.AC;
        }
        return a.price.sleeper - b.price.sleeper;
      }
      return a.price.AC - b.price.AC;
    });
    res.json(sortedTrains);
  } catch (error) {
    console.error('got an error:', error.message);
    res.status(500).json({ error: 'error in server' });
  }
});

app.listen(4500);