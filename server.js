const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public')); // Untuk menyajikan file statis

// Konfigurasi multer untuk handle file upload
const upload = multer({ dest: 'uploads/' });

const BASE_URL = "https://www.aiease.ai";
const SECRET_KEY = "Q@D24=oueV%]OBS8i,%eK=5I|7WU$PeE";
const KEY = crypto.createHash("SHA256").update(SECRET_KEY).digest();

// Fungsi-fungsi yang sudah ada (req, encrypt, decrypt, visit, getTemp, upload, img2img, task, GetFilterList, AIFilter)

// Endpoint untuk mendapatkan daftar filter
app.get('/filters', async (req, res) => {
    const filters = await GetFilterList();
    res.json(filters);
});

// Endpoint untuk menerapkan filter pada gambar yang diupload
app.post('/apply-filter', upload.single('image'), async (req, res) => {
    try {
        const file = req.file;
        const filterId = req.body.filterId;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Baca file yang diupload
        const buff = require('fs').readFileSync(file.path);

        // Proses gambar menggunakan fungsi AIFilter
        const result = await AIFilter(buff, filterId);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
