import express from 'express';
import multer from 'multer';
import { createHelia } from 'helia';
import { unixfs } from '@helia/unixfs';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'node:fs';

// 1. Load Setup & Config
dotenv.config();
const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

// --- 2. MongoDB Connection ---
// Using the direct link to ensure your network connects successfully
const dbURI = "mongodb://anshu:Dharani2026@ac-kgu0my4-shard-00-00.og9tkxo.mongodb.net:27017,ac-kgu0my4-shard-00-01.og9tkxo.mongodb.net:27017,ac-kgu0my4-shard-00-02.og9tkxo.mongodb.net:27017/dharani?ssl=true&replicaSet=atlas-t5cgmk-shard-0&authSource=admin&appName=Cluster0";

mongoose.connect(dbURI)
    .then(() => console.log("✨ MongoDB Cloud Connected!"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// 3. Define the Property Schema
const propertySchema = new mongoose.Schema({
    ownerName: String,
    propertyId: String,
    ipfsHash: String,
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});
const Property = mongoose.model('Property', propertySchema);

// 4. Initialize IPFS
let heliaNode;
let ipfsFS;

async function initIPFS() {
    try {
        heliaNode = await createHelia();
        ipfsFS = unixfs(heliaNode);
        console.log('✅ IPFS Node is active and ready');
    } catch (err) {
        console.error('Failed to start IPFS:', err);
    }
}
initIPFS();

// --- ROUTES ---

// A. Home Route
app.get('/', (req, res) => {
    res.send("Dharani Backend is Running...");
});

// B. Upload Route
app.post('/upload', upload.single('propertyDeed'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send('No file uploaded.');

        const fileData = fs.readFileSync(req.file.path);
        const cid = await ipfsFS.addBytes(fileData);
        const ipfsHash = cid.toString();

        const newProperty = new Property({
            ownerName: req.body.ownerName,
            propertyId: req.body.propertyId,
            ipfsHash: ipfsHash
        });
        await newProperty.save();

        fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            message: "Property registered in DB and IPFS",
            data: newProperty
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// C. Get All Properties Route
app.get('/api/properties', async (req, res) => {
    try {
        const list = await Property.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            count: list.length,
            properties: list
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 5. Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Dharani Server running on http://localhost:${PORT}`);
});