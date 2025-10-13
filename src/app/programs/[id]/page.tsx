"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, CalendarIcon, DumbbellIcon, AppleIcon, Clock } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { USER_PROGRAMS } from "@/constants";

const ProgramDetailsPage = () => {
  const params = useParams();
  const planId = params.id as string;

  // Check if it's a sample program (integer) or a real Convex document ID
  const isSampleProgram = !isNaN(Number(planId)) && Number(planId) > 0 && Number(planId) <= USER_PROGRAMS.length;
  
  // If it's a sample program, use the constant data
  const sampleProgram = isSampleProgram ? USER_PROGRAMS[Number(planId) - 1] : null;
  
  // If it's a real Convex document ID, query the database
  const plan = useQuery(
    api.plans.getPlanById, 
    !isSampleProgram ? { planId: planId as Id<"plans"> } : "skip"
  );

  // Show loading only if we're waiting for a real database query and no sample program
  if (!isSampleProgram && !plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading program details...</p>
        </div>
      </div>
    );
  }

  // If we don't have either a sample program or a real plan, show error
  if (!sampleProgram && !plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Program Not Found</h1>
          <p className="text-muted-foreground mb-4">The program you're looking for doesn't exist.</p>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Use sample program data if available, otherwise use real plan data
  const programData = sampleProgram || plan;

  return (
    <div className="min-h-screen bg-background pt-24 pb-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-sm text-primary font-medium">PROGRAM DETAILS</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-foreground">
                {sampleProgram ? `${sampleProgram.first_name}'s ${sampleProgram.fitness_goal} Program` : programData.name}
              </span>
            </h1>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <span>Generated Program</span>
            </div>
          </div>
        </div>

        {/* Program Tabs */}
        <Tabs defaultValue="workout" className="w-full">
          <TabsList className="mb-6 w-full grid grid-cols-2 bg-card border">
            <TabsTrigger
              value="workout"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              <DumbbellIcon className="mr-2 h-4 w-4" />
              Workout Plan
            </TabsTrigger>

            <TabsTrigger
              value="diet"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              <AppleIcon className="mr-2 h-4 w-4" />
              Diet Plan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workout">
            <div className="space-y-6">
              {/* Schedule Overview */}
              <Card className="bg-card/90 backdrop-blur-sm border border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Weekly Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(sampleProgram ? sampleProgram.workout_plan.weekly_schedule : programData.workoutPlan.schedule).map((day, index) => (
                      <div
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-md text-sm font-medium"
                      >
                        {sampleProgram ? day.day : day}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Exercise Details */}
              <Card className="bg-card/90 backdrop-blur-sm border border-border">
                <CardHeader>
                  <CardTitle>Exercise Routine</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="multiple" className="space-y-4">
                    {(sampleProgram ? sampleProgram.workout_plan.weekly_schedule : programData.workoutPlan.exercises).map((exerciseDay, index) => (
                      <AccordionItem
                        key={index}
                        value={sampleProgram ? exerciseDay.day : exerciseDay.day}
                        className="border rounded-lg overflow-hidden"
                      >
                        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-primary/10 font-mono">
                          <div className="flex justify-between w-full items-center">
                            <span className="text-primary">{sampleProgram ? exerciseDay.day : exerciseDay.day}</span>
                            <div className="text-xs text-muted-foreground">
                              {sampleProgram ? `${exerciseDay.focus} - ${exerciseDay.duration}` : `${exerciseDay.routines.length} EXERCISES`}
                            </div>
                          </div>
                        </AccordionTrigger>

                        <AccordionContent className="pb-4 px-4">
                          <div className="space-y-3 mt-2">
                            {sampleProgram ? (
                              // Sample program structure
                              <div className="border border-border rounded p-4 bg-background/50">
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-semibold text-foreground text-lg">
                                    {exerciseDay.focus}
                                  </h4>
                                  <div className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-mono">
                                    {exerciseDay.duration}
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">
                                  {sampleProgram.workout_plan.description}
                                </p>
                              </div>
                            ) : (
                              // Real database structure
                              exerciseDay.routines.map((routine, routineIndex) => (
                                <div
                                  key={routineIndex}
                                  className="border border-border rounded p-4 bg-background/50"
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-foreground text-lg">
                                      {routine.name}
                                    </h4>
                                    <div className="flex items-center gap-2">
                                      {routine.sets && (
                                        <div className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-mono">
                                          {routine.sets} SETS
                                        </div>
                                      )}
                                      {routine.reps && (
                                        <div className="px-2 py-1 rounded bg-secondary/20 text-secondary text-xs font-mono">
                                          {routine.reps} REPS
                                        </div>
                                      )}
                                      {routine.duration && (
                                        <div className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-mono">
                                          {routine.duration}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  {routine.description && (
                                    <p className="text-sm text-muted-foreground mt-2">
                                      {routine.description}
                                    </p>
                                  )}
                                  {routine.exercises && routine.exercises.length > 0 && (
                                    <div className="mt-3">
                                      <p className="text-xs text-muted-foreground mb-2">Exercise Details:</p>
                                      <ul className="space-y-1">
                                        {routine.exercises.map((exercise, exerciseIndex) => (
                                          <li key={exerciseIndex} className="text-sm text-foreground flex items-center gap-2">
                                            <span className="text-xs text-primary font-mono">
                                              {String(exerciseIndex + 1).padStart(2, "0")}
                                            </span>
                                            {exercise}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="diet">
            <div className="space-y-6">
              {/* Daily Calorie Target */}
              <Card className="bg-card/90 backdrop-blur-sm border border-border">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Daily Nutrition Target</span>
                    <div className="text-2xl font-bold text-primary">
                      {sampleProgram ? sampleProgram.diet_plan.daily_calories : programData.dietPlan.dailyCalories} KCAL
                    </div>
                  </CardTitle>
                </CardHeader>
              </Card>

              {/* Meal Plans */}
              <Card className="bg-card/90 backdrop-blur-sm border border-border">
                <CardHeader>
                  <CardTitle>Meal Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(sampleProgram ? sampleProgram.diet_plan.meal_examples : programData.dietPlan.meals).map((meal, index) => (
                      <div
                        key={index}
                        className="border border-border rounded-lg overflow-hidden p-4"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                          <h4 className="font-mono text-primary text-lg font-semibold">
                            {sampleProgram ? meal.meal : meal.name}
                          </h4>
                        </div>
                        {sampleProgram ? (
                          <p className="text-sm text-foreground">{meal.example}</p>
                        ) : (
                          <ul className="space-y-2">
                            {meal.foods.map((food, foodIndex) => (
                              <li
                                key={foodIndex}
                                className="flex items-center gap-2 text-sm text-foreground"
                              >
                                <span className="text-xs text-primary font-mono">
                                  {String(foodIndex + 1).padStart(2, "0")}
                                </span>
                                {food}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-center">
          <Link href="/profile">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              View All Programs
            </Button>
          </Link>
          <Link href="/generate-program">
            <Button variant="outline">
              Create New Program
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetailsPage;

