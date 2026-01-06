import { defineCollection, z } from 'astro:content';

// Exercise collection schema - stores fetched free-exercise-db data
const exercisesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    primaryMuscles: z.array(z.string()).optional().default([]), // Was 'target'
    secondaryMuscles: z.array(z.string()).optional().default([]),
    target: z.string().optional(), // optional backup for backward compat if needed, or remove? Removing as we are migrating.
    category: z.string(), // Was 'bodyPart'
    bodyPart: z.string().optional(), // optional backup
    equipment: z.string().nullable().optional(),
    images: z.array(z.string()), // Was 'gifUrl'
    gifUrl: z.string().optional(), // optional backup
    instructions: z.array(z.string()),
    level: z.string().nullable().optional().default('beginner'),
    force: z.string().nullable().optional(),
    mechanic: z.string().nullable().optional(),
  }),
});

// Workout collection schema - defines workout routines
const workoutsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    path: z.enum(['hybrid', 'machine', 'optional', 'core']),
    dayOfWeek: z.string().optional(),
    description: z.string().optional(),
    structure: z.string().optional(), // e.g., "circuit", "supersets", "straight sets"
    restBetweenSets: z.string().optional(),
    rounds: z.number().optional(),
    exercises: z.array(z.object({
      slug: z.string(), // matches exercise filename
      sets: z.string(),
      reps: z.string(),
      notes: z.string().optional(),
      supersetGroup: z.string().optional(), // e.g., "1A", "1B"
    })),
  }),
});

export const collections = {
  exercises: exercisesCollection,
  workouts: workoutsCollection,
};
