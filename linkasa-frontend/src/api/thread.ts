import axiosInstance from "./axios";

export interface ThreadImage {
  id: number;
  image: string;
  createdAt: string;
}

export interface User {
  id?: number;
  username: string;
}

export interface ThreadReply {
  id: number;
  content: string;
  user: User;
  createdAt: string;
}

export interface Thread {
  id: number;
  content: string;
  user: User;
  images: ThreadImage[];
  replies?: ThreadReply[];
  createdAt: string;
}

// export interface CreateThreadPayload {
//   content: string;
//   images?: string[];
// }

export interface CreateThreadPayload {
  content: string;
  images?: File[];
}

export interface CreateReplyPayload {
  content: string;
}

export const getThreads = async (): Promise<Thread[]> => {
  const response = await axiosInstance.get<Thread[]>("/threads");
  return response.data;
};

// export const createThread = async (payload: CreateThreadPayload): Promise<Thread> => {
//   const response = await axiosInstance.post<Thread>("/threads", payload);
//   return response.data;
// };

export const createThread = async (
  payload: CreateThreadPayload
): Promise<Thread> => {
  const formData = new FormData();
  formData.append("content", payload.content);

  payload.images?.forEach((file) => {
    formData.append("images", file);
  });

  const response = await axiosInstance.post<Thread>("/threads", formData);
  return response.data;
};


export const getThread = async (threadId: number): Promise<Thread> => {
  const response = await axiosInstance.get<Thread>(`/threads/${threadId}`);
  return response.data;
};

export const createReply = async (
  threadId: number,
  payload: CreateReplyPayload
): Promise<ThreadReply> => {
  const response = await axiosInstance.post<ThreadReply>(
    `/threads/${threadId}/reply`,
    payload
  );
  return response.data;
};