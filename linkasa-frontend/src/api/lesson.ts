import axiosInstance from "./axios";
import type { Alphabet } from "./flashcard";
import type { User } from "./thread";

export interface UserProgress {
  userId: number;
  lessonId: number;
  completedAt: string;
  score: number;
}

export interface LessonWithProgress {
  id: number;
  title: string;
  lessonOrder: number;
  userProgress: UserProgress[];
}

export interface Option {
  id: number;
  alphabet: Alphabet;
}

export interface Exercise {
  id: number;
  correctAlphabet: Alphabet;
  options: Option[];
}

export interface Lesson {
  id: number;
  title: string;
  lessonOrder: number;
}

export interface UserLessonProgress {
  id: number;
  user: User;
  lesson: Lesson;
  completedAt: string;
  score: number | null;
}

export interface CreateUserLessonProgressPayload {
  lessonId: number;
  score?: number;
}

export const getLessonsWithProgress = async (): Promise<LessonWithProgress[]> => {
  const response = await axiosInstance.get<LessonWithProgress[]>("/lessons");
  return response.data;
};

export const getExercisesByLesson = async (
  lessonId: number
): Promise<Exercise[]> => {
  const response = await axiosInstance.get<Exercise[]>(
    `/lessons/exercise/${lessonId}`
  );
  return response.data;
};

export const createUserLessonProgress = async (
  payload: CreateUserLessonProgressPayload
): Promise<UserLessonProgress> => {
  const response = await axiosInstance.post<UserLessonProgress>(
    "/lessons/progress",
    payload
  );
  return response.data;
};

export const getUserLessonProgress = async (): Promise<
  UserLessonProgress[]
> => {
  const response = await axiosInstance.get<UserLessonProgress[]>(
    "/lessons/progress"
  );
  return response.data;
};