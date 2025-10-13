import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createPlan = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    workoutPlan: v.object({
      schedule: v.array(v.string()),
      exercises: v.array(
        v.object({
          day: v.string(),
          routines: v.array(
            v.object({
              name: v.string(),
              sets: v.number(),
              reps: v.number(),
            })
          ),
        })
      ),
    }),
    dietPlan: v.object({
      dailyCalories: v.number(),
      meals: v.array(
        v.object({
          name: v.string(),
          foods: v.array(v.string()),
        })
      ),
    }),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const activePlans = await ctx.db
      .query("plans")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    for (const plan of activePlans) {
      await ctx.db.patch(plan._id, { isActive: false });
    }

    const planId = await ctx.db.insert("plans", args);

    return planId;
  },
});

export const getUserPlans = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const plans = await ctx.db
      .query("plans")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    return plans;
  },
});

// Query to get a specific plan by ID
export const getPlanById = query({
  args: { planId: v.id("plans") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.planId);
  },
});

// New mutation to create a plan from Vapi call data
export const createPlanFromVapiCall = mutation({
  args: {
    userId: v.string(),
    callData: v.object({
      userInfo: v.object({
        name: v.string(),
        age: v.number(),
        height: v.string(),
        weight: v.string(),
        fitnessGoal: v.string(),
        fitnessLevel: v.string(),
        workoutDays: v.number(),
        equipmentAccess: v.string(),
        injuries: v.optional(v.string()),
        dietaryRestrictions: v.optional(v.string()),
      }),
      workoutPlan: v.object({
        schedule: v.array(v.string()),
        exercises: v.array(
          v.object({
            day: v.string(),
            routines: v.array(
              v.object({
                name: v.string(),
                sets: v.optional(v.number()),
                reps: v.optional(v.number()),
                duration: v.optional(v.string()),
                description: v.optional(v.string()),
                exercises: v.optional(v.array(v.string())),
              })
            ),
          })
        ),
      }),
      dietPlan: v.object({
        dailyCalories: v.number(),
        meals: v.array(
          v.object({
            name: v.string(),
            foods: v.array(v.string()),
          })
        ),
      }),
    }),
  },
  handler: async (ctx, args) => {
    // Deactivate all existing plans for this user
    const existingPlans = await ctx.db
      .query("plans")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect();

    for (const plan of existingPlans) {
      await ctx.db.patch(plan._id, { isActive: false });
    }

    // Generate plan name based on user info and goal
    const planName = `${args.callData.userInfo.fitnessGoal} Program - ${args.callData.userInfo.fitnessLevel}`;

    // Create new active plan
    return await ctx.db.insert("plans", {
      userId: args.userId,
      name: planName,
      workoutPlan: args.callData.workoutPlan,
      dietPlan: args.callData.dietPlan,
      isActive: true,
    });
  },
});