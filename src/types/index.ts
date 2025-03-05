
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

export interface Voice {
  id: string;
  name: string;
  accent?: string;
}

export interface Subtitle {
  text: string;
  startTime: number;
  endTime: number;
  color?: string;
}

export interface BackgroundVideo {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  category: string;
}

export interface Video {
  id: string;
  images: Image[];
  song?: Song;
  backgroundVideo?: BackgroundVideo;
  voiceOver?: string;
  voice?: Voice;
  subtitles?: Subtitle[];
  duration: number;
  url: string;
  createdAt: number;
}
