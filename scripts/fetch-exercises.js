/**
 * Fetch Exercises from Free Exercise DB (GitHub)
 * Source: https://github.com/yuhonas/free-exercise-db
 * 
 * This is a FREE, open-source database with 800+ exercises.
 * No API key required!
 * 
 * Usage: 
 *   node scripts/fetch-exercises.js --test    # Test with 3 exercises
 *   node scripts/fetch-exercises.js           # Fetch all workout exercises
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GitHub raw URL for the exercises database
const EXERCISES_URL = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json';
const IMAGES_BASE_URL = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises';

// Check for test mode
const isTestMode = process.argv.includes('--test');

// All exercises from the workout plan (search terms)
const ALL_EXERCISES = [
    // Hybrid Monday: "Grit" Circuit
    'dumbbell sumo squat',
    'dumbbell bench press',
    'face pull',
    'dumbbell lateral raise',
    'dumbbell pullover',

    // Hybrid Thursday: Upper Body Supersets
    'incline dumbbell press',
    'chest supported row',
    'seated dumbbell press',
    'lat pulldown',
    'tricep pushdown',
    'hammer curl',
    'dumbbell shrug',

    // Hybrid Friday: Lower Body Supersets
    'leg press',
    'seated leg curl',
    'goblet squat',
    'seated calf raise',
    'leg extension',
    'romanian deadlift',

    // Machine Monday: Full Body Control
    'chest press machine',
    'seated cable row',
    'machine shoulder press',
    'ab crunch machine',

    // Machine Thursday: Upper Body Machines
    'incline chest press machine',
    'pec deck',
    'reverse fly',
    'machine bicep curl',

    // Machine Friday: Lower Body Machines
    'standing calf raise',
    'lying leg curl',
    'glute kickback',

    // Option A: Free Weight Hypertrophy
    'ez-bar curl',
    'skull crusher',
    'concentration curl',
    'tricep kickback',

    // Option B: Machine Hypertrophy
    'preacher curl',
    'cable pushdown',
    'cable curl',
    'tricep extension',
    'lateral raise',

    // Core exercises  
    'dead bug',
    'heel touch',
    'bird dog',
];

const TEST_EXERCISES = [
    'bench press',
    'squat',
    'deadlift',
];

function slugify(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

function findBestMatch(exercises, searchTerm) {
    const search = searchTerm.toLowerCase();

    // 1. Exact match
    const exact = exercises.find(e => e.name.toLowerCase() === search);
    if (exact) return exact;

    // 2. Contains full search term
    const contains = exercises.find(e => e.name.toLowerCase().includes(search));
    if (contains) return contains;

    // 3. Search term contains exercise name
    const reverse = exercises.find(e => search.includes(e.name.toLowerCase()));
    if (reverse) return reverse;

    // 4. Fuzzy match - all words present
    const words = search.split(' ').filter(w => w.length > 2);
    const fuzzy = exercises.find(e => {
        const name = e.name.toLowerCase();
        return words.every(word => name.includes(word));
    });
    if (fuzzy) return fuzzy;

    // 5. Partial word match (at least half the words)
    const partial = exercises.find(e => {
        const name = e.name.toLowerCase();
        const matches = words.filter(word => name.includes(word));
        return matches.length >= Math.ceil(words.length / 2);
    });
    if (partial) return partial;

    return null;
}

async function fetchAllExercises() {
    const outputDir = path.join(__dirname, '..', 'src', 'content', 'exercises');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log(`📦 Source: ${EXERCISES_URL}\n`);

    // Fetch the full database
    console.log('📥 Downloading exercise database...');
    const response = await fetch(EXERCISES_URL);
    if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
    }
    const allExercises = await response.json();
    console.log(`✅ Loaded ${allExercises.length} exercises from database\n`);

    const results = { success: [], failed: [] };

    // Loop through ALL exercises from the database
    console.log(`Processing ${allExercises.length} exercises...`);

    for (const exercise of allExercises) {
        try {
            const slug = slugify(exercise.name);
            const outputPath = path.join(outputDir, `${slug}.json`);

            // Build image URLs
            const images = (exercise.images || []).map(img => `${IMAGES_BASE_URL}/${img}`);

            // Format for our schema
            const exerciseData = {
                id: exercise.id,
                name: exercise.name,
                force: exercise.force || null,
                level: exercise.level || 'beginner',
                mechanic: exercise.mechanic || null,
                equipment: exercise.equipment || null,
                primaryMuscles: exercise.primaryMuscles || [],
                secondaryMuscles: exercise.secondaryMuscles || [],
                instructions: exercise.instructions || [],
                category: exercise.category || 'strength',
                images: images,
            };

            fs.writeFileSync(outputPath, JSON.stringify(exerciseData, null, 2));
            results.success.push({ name: exercise.name, slug });

            // Log every 50 items to show progress without spamming
            if (results.success.length % 50 === 0) {
                console.log(`   Processed ${results.success.length} / ${allExercises.length}`);
            }

        } catch (error) {
            console.error(`Error processing ${exercise.name}:`, error);
            results.failed.push({ name: exercise.name, reason: error.message });
        }
    }

    // Summary
    console.log('='.repeat(50));
    console.log('📊 FETCH SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Success: ${results.success.length}`);
    console.log(`❌ Failed: ${results.failed.length}`);

    // Save mapping (simplified)
    const dataDir = path.join(__dirname, '..', 'src', 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    const mappingPath = path.join(dataDir, 'exercises-index.json');
    fs.writeFileSync(mappingPath, JSON.stringify(results.success.map(e => ({ name: e.name, slug: e.slug })), null, 2));
    console.log(`\n📝 Index: ${mappingPath}`);
}

fetchAllExercises().catch(console.error);
