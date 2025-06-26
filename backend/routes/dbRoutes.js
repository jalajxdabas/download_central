const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
    res.send('Hello from the database');
});

// fetch the meta data that is stored in the PostgreSQL using GET
router.get('/files', async(req, res) => {
    try {
        const result = await db.query('SELECT * FROM files_metadata ORDER BY time_created DESC');
        res.json({files: result.rows});
    }catch(error){
        console.error('Error fetching files from DB:', error);
        res.status(500).json({ error: 'Failed to fetch files from DB' });
    }
});

// now to sync the files of the GCS to the postgreSQL, POST use
router.post('/files/sync', async (req, res) => {
    try {
        const { Storage } = require('@google-cloud/storage');
        const storage = new Storage({ keyFilename: process.env.SERVICE_ACCOUNT_KEY_PATH });
        const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

        const [files] = await bucket.getFiles();

        for(const file of files){
            const [meta] = await file.getMetadata();

            await db.query(`
                    INSERT INTO files_metadata (
                        name, full_name, size, content_type,
                        time_created, updated, storage_class, gcs_path
                    )
                    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
                    ON CONFLICT (full_name) DO UPDATE SET
                    size = EXCLUDED.size,
                    updated = EXCLUDED.updated,
                    storage_class = EXCLUDED.storage_class,
                    synced_at = CURRENT_TIMESTAMP
                `, [
                    meta.name.split('.')[0],
                    meta.name,
                    parseInt(meta.size),
                    meta.contentType,
                    meta.timeCreated,
                    meta.updated,
                    meta.storageClass,
                    meta.name
                ]);
            }

            res.json({ message: 'Metadata synced from GCS to DB successfully' });
    }catch(error){
        console.error('Error syncing GCS to DB:', error);
        res.status(500).json({ error: 'Failed to sync data' });
    }
});

// to download the file, we need to get the signes url from the data base 
router.get('/files/download/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const result = await db.query('SELECT full_name FROM files_metadata WHERE id = $1', [id]);

        if (result.rowCount === 0) return res.status(404).json({ error: 'File not found' });

        const filename = result.rows[0].full_name;

        const { Storage } = require('@google-cloud/storage');
        const storage = new Storage({ keyFilename: process.env.SERVICE_ACCOUNT_KEY_PATH });
        const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

        const [url] = await bucket.file(filename).getSignedUrl({
            version: 'v4',
            action: 'read',
            expires: Date.now() + 5 * 60 * 1000,
          });
      
          res.redirect(url);
    }catch(err){
        console.error('Download error:', err);
        res.status(500).json({ error: 'Failed to generate signed URL' });
    }
});


module.exports = router;