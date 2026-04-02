const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Extract MONGODB_URI from .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/MONGODB_URI="?([^"\n]+)"?/);
const uri = match ? match[1] : null;

async function verifyUser() {
    if (!uri) {
        console.error('Could not find MONGODB_URI in .env.local');
        return;
    }

    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('aqua-tai-db');
        const email = 'www.shaheerkhalid88601@gmail.com';

        console.log(`Checking user: ${email}`);
        const user = await db.collection('users').findOne({ email: email.toLowerCase().trim() });

        if (user) {
            console.log('Current emailVerified status:', user.emailVerified);
            if (!user.emailVerified) {
                console.log('Marking as verified...');
                await db.collection('users').updateOne(
                    { _id: user._id },
                    { $set: { emailVerified: true } }
                );
                console.log('✅ User successfully verified in MongoDB');
            } else {
                console.log('User is already verified.');
            }
        } else {
            console.log('User not found in MongoDB');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

verifyUser();
