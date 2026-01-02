/**
 * MongoDB Connection Test Script
 * Run: node test-db-connection.js
 * 
 * Requires MONGODB_URI environment variable to be set
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

async function testConnection() {
    console.log('\n🔌 Testing MongoDB Connection...\n');

    if (!MONGODB_URI) {
        console.error('❌ ERROR: MONGODB_URI environment variable is not set!');
        console.log('\nTo run this test:');
        console.log('  Windows (PowerShell): $env:MONGODB_URI="your-connection-string"; node test-db-connection.js');
        console.log('  Windows (CMD): set MONGODB_URI=your-connection-string && node test-db-connection.js');
        console.log('  Linux/Mac: MONGODB_URI="your-connection-string" node test-db-connection.js');
        process.exit(1);
    }

    try {
        // 1. Test Connection
        console.log('📡 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
            maxPoolSize: 5,
        });
        console.log('✅ Connected successfully!\n');

        // 2. Get connection info
        const db = mongoose.connection;
        console.log(`📊 Database: ${db.name}`);
        console.log(`🖥️  Host: ${db.host}`);
        console.log(`🔌 ReadyState: ${db.readyState} (1 = connected)\n`);

        // 3. Test CRUD Operations
        console.log('🧪 Testing CRUD operations...\n');

        // Create a temporary test collection
        const TestSchema = new mongoose.Schema({
            testField: String,
            timestamp: { type: Date, default: Date.now }
        });
        const TestModel = mongoose.model('ConnectionTest', TestSchema);

        // CREATE
        console.log('  ➡️  CREATE: Inserting test document...');
        const testDoc = await TestModel.create({ testField: 'connection-test-' + Date.now() });
        console.log(`  ✅ Created document with ID: ${testDoc._id}`);

        // READ
        console.log('  ➡️  READ: Finding test document...');
        const foundDoc = await TestModel.findById(testDoc._id);
        console.log(`  ✅ Found document: ${foundDoc.testField}`);

        // DELETE
        console.log('  ➡️  DELETE: Removing test document...');
        await TestModel.deleteOne({ _id: testDoc._id });
        console.log('  ✅ Deleted test document');

        // Clean up - drop the test collection
        await mongoose.connection.dropCollection('connectiontests').catch(() => { });

        console.log('\n🎉 All tests passed! MongoDB connection is working correctly.\n');

        // 4. List existing collections
        const collections = await db.db.listCollections().toArray();
        if (collections.length > 0) {
            console.log('📂 Existing collections in database:');
            collections.forEach(col => console.log(`   - ${col.name}`));
        } else {
            console.log('📂 No existing collections (fresh database)');
        }

    } catch (error) {
        console.error('\n❌ Connection FAILED!');
        console.error('Error:', error.message);

        if (error.message.includes('bad auth')) {
            console.log('\n💡 Tip: Check your username and password in the connection string');
        } else if (error.message.includes('ENOTFOUND')) {
            console.log('\n💡 Tip: Check your cluster hostname - it may be incorrect');
        } else if (error.message.includes('ETIMEDOUT')) {
            console.log('\n💡 Tip: Check if your IP address is whitelisted in MongoDB Atlas');
        }

        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('\n👋 Disconnected from MongoDB');
    }
}

testConnection();
