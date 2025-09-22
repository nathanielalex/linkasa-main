import axiosInstance from "./axios";

export interface Alphabet {
  id: number;
  letter: string;
  imageUrl: string;
}

export interface Flashcard {
  id: number;
  alphabet: Alphabet;
}

export const getFlashcards = async (): Promise<Flashcard[]> => {
  const response = await axiosInstance.get<Flashcard[]>("/flashcards");
  return response.data;
};
