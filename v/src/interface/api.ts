import { Video } from "./data";

export interface GetListPost {
  limit?: number;
  skip?: number;
}

export interface ResultResponseList {
  status?: number;
  data?: {
    list?: Video[];
    total?: number;
    success: boolean;
    error?: string;
  };
}

export interface ResultResponseDetails {
  status?: number;
  data?: {
    video?: Video;
    success: boolean;
    error?: string;
  };
}
