export const USER_PROGRAMS = [
  {
    id: 1,
    first_name: "Riya",
    profilePic: "data:image/jpeg;base64,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",
    fitness_goal: "Weight Loss",
    height: "5'6\"",
    weight: "165 lbs",
    age: 34,
    workout_days: 4,
    injuries: "Lower back pain",
    fitness_level: "Beginner",
    equipment_access: "Home gym",
    dietary_restrictions: "Lactose intolerant",
    workout_plan: {
      title: "Beginner Weight Loss Program",
      weekly_schedule: [
        { day: "Monday", focus: "Full Body Cardio", duration: "30 min" },
        { day: "Wednesday", focus: "Core & Lower Body", duration: "30 min" },
        { day: "Friday", focus: "HIIT Training", duration: "25 min" },
        { day: "Saturday", focus: "Active Recovery", duration: "40 min" },
      ],
      description:
        "This program focuses on building a consistent exercise habit with joint-friendly movements that protect your lower back. The mix of cardio and strength training supports weight loss while preserving muscle mass.",
    },
    diet_plan: {
      title: "Balanced Nutrition Plan (Lactose-Free)",
      daily_calories: "1,600 calories",
      macros: { protein: "30%", carbs: "40%", fats: "30%" },
      meal_examples: [
        { meal: "Breakfast", example: "Oatmeal with almond milk, berries, and chia seeds" },
        { meal: "Lunch", example: "Grilled chicken salad with olive oil dressing" },
        { meal: "Dinner", example: "Baked salmon with quinoa and roasted vegetables" },
        { meal: "Snacks", example: "Apple with almond butter, dairy-free yogurt with nuts" },
      ],
      description:
        "This meal plan avoids dairy products while providing balanced nutrition to support weight loss goals. Focus is on whole foods with adequate protein to preserve muscle during weight loss.",
    },
  },
  {
    id: 2,
    first_name: "Rohan",
    profilePic: "data:image/jpeg;base64,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",
    fitness_goal: "Muscle Gain",
    height: "5'10\"",
    weight: "170 lbs",
    age: 28,
    workout_days: 5,
    injuries: "None",
    fitness_level: "Intermediate",
    equipment_access: "Full gym",
    dietary_restrictions: "None",
    workout_plan: {
      title: "Hypertrophy-Focused Muscle Building",
      weekly_schedule: [
        { day: "Monday", focus: "Chest & Triceps", duration: "45 min" },
        { day: "Tuesday", focus: "Back & Biceps", duration: "45 min" },
        { day: "Wednesday", focus: "Recovery/Cardio", duration: "30 min" },
        { day: "Thursday", focus: "Shoulders & Abs", duration: "45 min" },
        { day: "Friday", focus: "Legs", duration: "50 min" },
      ],
      description:
        "This program implements a traditional body-part split with emphasis on progressive overload. Each muscle group is trained with moderate volume and adequate recovery to maximize muscle growth.",
    },
    diet_plan: {
      title: "Muscle Building Nutrition Plan",
      daily_calories: "2,800 calories",
      macros: { protein: "30%", carbs: "50%", fats: "20%" },
      meal_examples: [
        { meal: "Breakfast", example: "Protein oatmeal with banana and whey protein" },
        { meal: "Lunch", example: "Chicken, rice, and vegetables with olive oil" },
        { meal: "Dinner", example: "Steak with sweet potato and green vegetables" },
        { meal: "Snacks", example: "Protein shake with fruit, Greek yogurt with honey" },
      ],
      description:
        "This high-protein, calorie-surplus diet supports muscle growth while minimizing fat gain. Carbohydrates are timed around workouts for optimal performance and recovery.",
    },
  },
  {
    id: 3,
    first_name: "Ravi",
    profilePic: "https://randomuser.me/api/portraits/men/76.jpg",
    fitness_goal: "General Fitness",
    height: "5'4\"",
    weight: "130 lbs",
    age: 45,
    workout_days: 3,
    injuries: "Knee pain",
    fitness_level: "Intermediate",
    equipment_access: "Bodyweight only",
    dietary_restrictions: "Vegetarian",
    workout_plan: {
      title: "Functional Fitness Program",
      weekly_schedule: [
        { day: "Monday", focus: "Bodyweight Strength", duration: "40 min" },
        { day: "Wednesday", focus: "Mobility & Balance", duration: "35 min" },
        { day: "Saturday", focus: "Cardio & Core", duration: "40 min" },
      ],
      description:
        "This program focuses on functional movement patterns that improve everyday performance while being gentle on the knees. Emphasis is on core strength, mobility, and cardiovascular health.",
    },
    diet_plan: {
      title: "Balanced Vegetarian Nutrition",
      daily_calories: "1,800 calories",
      macros: { protein: "25%", carbs: "50%", fats: "25%" },
      meal_examples: [
        { meal: "Breakfast", example: "Tofu scramble with vegetables and whole grain toast" },
        { meal: "Lunch", example: "Lentil soup with mixed green salad" },
        { meal: "Dinner", example: "Chickpea curry with brown rice and vegetables" },
        { meal: "Snacks", example: "Mixed nuts, hummus with vegetables, protein smoothie" },
      ],
      description:
        "This vegetarian meal plan ensures adequate protein intake from plant sources. It focuses on whole foods and supports your active lifestyle while accommodating knee issues with anti-inflammatory food choices.",
    },
  },
];