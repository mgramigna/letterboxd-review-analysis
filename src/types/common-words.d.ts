declare module 'common-words' {
  export interface CommonWord {
    rank: string;
    word: string;
  }
  const common: CommonWord[];
  export default common;
}
