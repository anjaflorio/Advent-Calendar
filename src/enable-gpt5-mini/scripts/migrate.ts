import { Client } from '../src/models/client';
import { Database } from '../src/config/database'; // Assuming you have a database configuration file
import { FeatureFlag } from '../src/types';

async function migrate() {
    const db = new Database();
    await db.connect();

    try {
        // Example migration: Add a new feature flag to the database
        const newFeatureFlag: FeatureFlag = {
            name: 'gpt5-mini',
            enabled: false,
            description: 'Enable GPT-5 mini for clients',
        };

        await db.insertFeatureFlag(newFeatureFlag);

        // Example migration: Update existing clients to have a default setting for the new feature
        const clients = await Client.findAll();
        for (const client of clients) {
            client.features['gpt5-mini'] = false; // Default to false
            await client.save();
        }

        console.log('Migration completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await db.disconnect();
    }
}

migrate();