const express = require('express');
const router = express.Router();
const { bucket } = require('../gcs/gcsClient');

router.get('/', (req, res) => {
    res.send('Hello from Google Cloud Storage');
});

// this is listing all the files in the bucket
router.get('/files', async (req, res) => {
    try {
      const [files] = await bucket.getFiles();
      const fileNames = files.map(file => file.name);
      res.json({ files: fileNames });
    } catch (error) {
      console.error('Error fetching files:', error);
      res.status(500).json({ error: 'Failed to list files' });
    }
  });

  // this is streaiming downloading the file
  router.get('/download/:filename', async (req, res) => {
    const { filename } = req.params;
    const file = bucket.file(filename);
  
    try {
      const [exists] = await file.exists();
      if (!exists) return res.status(404).send('File not found');
  
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      file.createReadStream().pipe(res);
    } catch (error) {
      console.error('Error downloading file:', error);
      res.status(500).send('Failed to download file');
    }
  });

  // this is generating a signed url for the file
  // Redirect to the signed URL for secure download
router.get('/signed-url/:filename', async (req, res) => {
  const { filename } = req.params;
  const key = req.query.key; // simple auth via secret key

  if (key !== process.env.DOWNLOAD_SECRET) {
    return res.status(403).json({ error: 'Unauthorized access' });
  }

  const file = bucket.file(filename);
  try {
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: expiresAt,
    });

    return res.redirect(url); 
  } catch (error) {
    console.error('Error redirecting to signed URL:', error);
    res.status(500).json({ error: 'Failed to redirect to signed URL' });
  }
});


    // this is used to show all the metadata of the file
    router.get('/metadata/:filename', async (req, res) => {
        const { filename } = req.params;
        const file = bucket.file(filename);
        try {
            const [exists] = await file.exists();
            if (!exists) return res.status(404).send('File not found');

        const [meta] = await file.getMetadata();
        const metadata = {
            name: meta.name,
            size: meta.size, 
            contentType: meta.contentType,
            timeCreated: meta.timeCreated,
            updated: meta.updated,
            storageClass: meta.storageClass,
            
          };
          res.json({ metadata });
        } catch (error) {
            console.error('Error fetching metadata:', error);
            res.status(500).json({ error: 'Failed to fetch metadata' });
        }
    });

    // this is used to upload a file to the bucket
    router.post('/upload', async (req, res) => {
    });

module.exports = router;