const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());
app.use(express.json());

const gcsRoutes = require('./routes/gcsRoutes');    // directly getting the data from the google cloud
const dbRoutes = require('./routes/dbRoutes');     // fetching the data from PostgreSQL;

app.use('/api/gcs', gcsRoutes);
app.use('/api', dbRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});