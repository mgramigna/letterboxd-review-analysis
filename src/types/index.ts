import Sentiment from 'sentiment';

export interface DiaryEntry {
  date: {
    published: number;
    watched: number;
  };
  film: {
    image: {
      large?: string;
      medium?: string;
      small?: string;
      tiny?: string;
    };
    title: string;
    year: string;
  };
  isRewatch: boolean;
  rating: {
    score: number;
    text: string;
  };
  review?: string;
  spoilers: boolean;
  type: string;
  uri: string;
}

export enum DiaryEntryType {
  DIARY = 'diary',
  LIST = 'list'
}

export interface Review {
  entry: DiaryEntry;
  movie: string;
  review: string;
  published: number;
}

export interface ReviewSentiment {
  review: Review;
  sentiment: Sentiment.AnalysisResult;
}
