const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const PORT = process.env.PORT || 5000;

app.get('/api/weather', async (req, res) => {
  const { location } = req.query;
  if (!location) {
    return res.status(400).send({ error: "Location is required" });
  }

  try {
    const response = await axios.get(`http://api.weatherstack.com/current
    ?access_key = 43d196694d09aa6d55ea7ad22469e729`, {
      params: {
        key: WEATHER_API_KEY,
        q: location,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch weather data" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));