const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Extract MONGODB_URI from .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/MONGODB_URI="?([^"\n]+)"?/);
const uri = match ? match[1] : null;

async function listUsers() {
    if (!uri) {
        console.error('Could not find MONGODB_URI in .env.local');
        return;
    }

    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('aqua-tai-db');
        const users = await db.collection('users').find({}).toArray();

        let out = "MONGODB USERS:\n";
        users.forEach(u => {
            out += `- ${u.email} (pwd_prefix: ${u.password ? u.password.substring(0, 5) : 'none'})\n`;
        });
        fs.writeFileSync('all-users-debug.txt', out);
        console.log('User list written to all-users-debug.txt');
    } catch (error) {
        console.error('Connection error:', error);
    } finally {
        await client.close();
    }
}

listUsers();
