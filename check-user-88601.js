const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Extract MONGODB_URI from .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/MONGODB_URI="?([^"\n]+)"?/);
const uri = match ? match[1] : null;

async function checkUser() {
    if (!uri) {
        console.error('Could not find MONGODB_URI in .env.local');
        return;
    }

    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('aqua-tai-db');
        const email = 'www.shaheerkhalid88601@gmail.com';
        const user = await db.collection('users').findOne({ email: email.toLowerCase().trim() });

        if (user) {
            console.log('--- USER FOUND ---');
            console.log('Email:', user.email);
            console.log('Has Password:', !!user.password);
            if (user.password) {
                console.log('Password starts with $2:', user.password.startsWith('$2'));
                console.log('Password Prefix (first 5):', user.password.substring(0, 5));
            }
            console.log('Role:', user.role);
        } else {
            console.log('--- USER NOT FOUND IN MONGODB ---');
        }
    } catch (error) {
        console.error('Connection error:', error);
    } finally {
        await client.close();
    }
}

checkUser();
