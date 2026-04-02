const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Extract MONGODB_URI from .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/MONGODB_URI="?([^"\n]+)"?/);
const uri = match ? match[1] : null;

async function scanCluster() {
    if (!uri) {
        console.error('Could not find MONGODB_URI in .env.local');
        return;
    }

    const client = new MongoClient(uri);
    try {
        await client.connect();
        const admin = client.db().admin();
        const dbs = await admin.listDatabases();

        console.log('--- SCANNING ALL DATABASES ---');
        for (const dbInfo of dbs.databases) {
            console.log(`Database: ${dbInfo.name}`);
            const db = client.db(dbInfo.name);
            const collections = await db.listCollections().toArray();
            for (const col of collections) {
                if (col.name === 'users') {
                    const count = await db.collection(col.name).countDocuments();
                    console.log(`  Collection: ${col.name} (Count: ${count})`);
                    if (count > 0) {
                        const users = await db.collection(col.name).find({}).toArray();
                        users.forEach(u => console.log(`    User Found: ${u.email}`));
                    }
                }
            }
        }
    } catch (error) {
        console.error('Scan error:', error);
    } finally {
        await client.close();
    }
}

scanCluster();
