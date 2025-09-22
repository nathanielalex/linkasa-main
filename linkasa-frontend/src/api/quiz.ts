import axiosInstance from "./axios";
import type { Alphabet } from "./flashcard";

export interface Quiz {
  id: number;
  correctAlphabet: Alphabet;
}

export interface FinalQuizAnswer {
  questionNumber: number;
  alphabetId: number;
  userAnswer: string;
  isCorrect: boolean;
}

export interface FinalQuizAttemptRequest {
  score: number;
  completionTime: number;
  answers: FinalQuizAnswer[];
}

export interface FinalQuizAnswerResponse extends FinalQuizAnswer {
  id: number;
  alphabet: Alphabet;
}

export interface UserSummary {
  id: number;
  username: string;
}

export interface FinalQuizAttemptResponse {
  id: number;
  userId: number;
  score: number;
  completionTime: number;
  user: UserSummary;
  answers: FinalQuizAnswerResponse[];
  attemptedAt: string;
}

export const getFinalQuizQuestions = async (): Promise<Quiz[]> => {
  const response = await axiosInstance.get<Quiz[]>("/quiz/questions");
  return response.data;
};

export const createFinalQuizAttempt = async (
  payload: FinalQuizAttemptRequest
): Promise<FinalQuizAttemptResponse> => {
  const response = await axiosInstance.post<FinalQuizAttemptResponse>(
    "/quiz/attempt",
    payload
  );
  return response.data;
};

export const getBestFinalAttempt = async (): Promise<FinalQuizAttemptResponse> => {
  const response = await axiosInstance.get<FinalQuizAttemptResponse>(
    "/quiz/best-attempt"
  );
  return response.data;
};

export const getTop10FastestQuizAttempts = async (): Promise<
  FinalQuizAttemptResponse[]
> => {
  const response = await axiosInstance.get<FinalQuizAttemptResponse[]>(
    "/quiz/top-ten"
  );
  return response.data;
};