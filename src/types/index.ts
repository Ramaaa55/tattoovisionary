
export interface Image {
  url: string;
  prompt: string;
  timestamp: number;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  category?: string;
}

export interface Video {
  id: string;
  images: Image[];
  song?: Song;
  duration: number;
  url: string;
  createdAt: number;
}
