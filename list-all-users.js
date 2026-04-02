const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Extract MONGODB_URI from .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/MONGODB_URI="?([^"\n]+)"?/);
const uri = match ? match[1] : null;

async function listAll() {
    if (!uri) {
        console.error('Could not find MONGODB_URI in .env.local');
        return;
    }

    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('aqua-tai-db');
        const mongoUsers = await db.collection('users').find({}).toArray();

        console.log('--- ALL USERS IN MONGODB ---');
        mongoUsers.forEach(u => console.log(`Email: ${u.email}`));

        const dbPath = path.join(process.cwd(), 'data', 'database.json');
        if (fs.existsSync(dbPath)) {
            const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
            console.log('--- ALL USERS IN JSON ---');
            (data.users || []).forEach(u => console.log(`Email: ${u.email}`));
        }
    } catch (error) {
        console.error('Connection error:', error);
    } finally {
        await client.close();
    }
}

listAll();
