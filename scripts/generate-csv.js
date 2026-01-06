import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXERCISES_URL = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json';

async function generateCSV() {
    console.log('📥 Downloading exercise database...');
    const response = await fetch(EXERCISES_URL);
    if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
    }
    const exercises = await response.json();
    console.log(`✅ Loaded ${exercises.length} exercises`);

    // Define columns
    const headers = ['Name', 'Category', 'Equipment', 'Primary Muscle', 'Level', 'Mechanic'];

    const rows = exercises.map(ex => {
        // Handle array fields or nulls safely
        const name = `"${(ex.name || '').replace(/"/g, '""')}"`;
        const category = `"${(ex.category || '').replace(/"/g, '""')}"`;
        const equipment = `"${(ex.equipment || '').replace(/"/g, '""')}"`;
        const primaryMuscle = `"${(ex.primaryMuscles?.[0] || '').replace(/"/g, '""')}"`;
        const level = `"${(ex.level || '').replace(/"/g, '""')}"`;
        const mechanic = `"${(ex.mechanic || '').replace(/"/g, '""')}"`;

        return [name, category, equipment, primaryMuscle, level, mechanic].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');

    // Save to the root of the project for easy access by user
    const outputPath = path.join(__dirname, '..', 'exercises.csv');
    fs.writeFileSync(outputPath, csvContent);

    console.log(`🎉 CSV generated at: ${outputPath}`);
}

generateCSV().catch(console.error);
