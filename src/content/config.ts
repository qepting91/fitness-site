import { defineCollection, z } from 'astro:content';

// Exercise collection schema - stores fetched free-exercise-db data
const exercisesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    primaryMuscles: z.array(z.string()).optional().default([]),
    secondaryMuscles: z.array(z.string()).optional().default([]),
    target: z.string().optional(),
    category: z.string(),
    bodyPart: z.string().optional(),
    equipment: z.string().nullable().optional(),
    images: z.array(z.string()),
    gifUrl: z.string().optional(),
    instructions: z.array(z.string()),
    level: z.string().nullable().optional().default('beginner'),
    force: z.string().nullable().optional(),
    mechanic: z.string().nullable().optional(),
  }),
});

// Equipment inventory schema - gym equipment available to user
const equipmentCollection = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    category: z.enum(['cardio', 'strength-pin-loaded', 'strength-plate-loaded', 'strength-free-weights', 'functional-accessory']),
    brand: z.string().optional(),
    notes: z.string().optional(),
    quantity: z.number().optional().default(1),
    // Tags for filtering and matching with exercises
    exerciseEquipmentTags: z.array(z.string()).optional().default([]),
    // User availability - can mark equipment as available/unavailable
    available: z.boolean().optional().default(true),
  }),
});

// Workout collection schema - defines workout routines with enhanced tagging
const workoutsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    path: z.enum(['hybrid', 'machine', 'optional', 'core']),
    dayOfWeek: z.string().optional(),
    // Multiple days this workout can be done on
    scheduledDays: z.array(z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])).optional(),
    description: z.string().optional(),
    structure: z.enum(['circuit', 'supersets', 'straight-sets', 'emom', 'amrap']).optional(),
    restBetweenSets: z.string().optional(),
    rounds: z.number().optional(),
    // Enhanced tagging for filtering
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    estimatedDuration: z.number().optional(), // in minutes
    // Primary muscle groups targeted (for filtering)
    primaryMuscleGroups: z.array(z.enum(['chest', 'back', 'shoulders', 'legs', 'arms', 'core', 'full-body'])).optional(),
    // Equipment categories required
    equipmentRequired: z.array(z.enum(['dumbbells', 'barbell', 'cables', 'machines', 'bodyweight', 'kettlebells', 'bands', 'bench'])).optional(),
    // Tags for flexible filtering
    tags: z.array(z.string()).optional().default([]),
    exercises: z.array(z.object({
      slug: z.string(),
      sets: z.string(),
      reps: z.string(),
      notes: z.string().optional(),
      supersetGroup: z.string().optional(),
      // Optional rest override per exercise
      restAfter: z.string().optional(),
      // Optional tempo notation (e.g., "3-1-2-0")
      tempo: z.string().optional(),
    })),
  }),
});

export const collections = {
  exercises: exercisesCollection,
  workouts: workoutsCollection,
  equipment: equipmentCollection,
};
