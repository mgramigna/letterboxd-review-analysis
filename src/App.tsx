import { CircularProgress, Grid, IconButton, InputAdornment, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import Sentiment from 'sentiment';
import { DiaryEntry, DiaryEntryType, Review, ReviewSentiment } from './types';
import MovieReview from './components/MovieReview';
import { Search } from '@material-ui/icons';

function App() {
  const [username, setUsername] = useState<string>('');
  const [overallSentiment, setOverallSentiment] = useState<Sentiment.AnalysisResult | null>(null);
  const [individualSentiments, setIndividualSentiments] = useState<ReviewSentiment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const clear = () => {
    setOverallSentiment(null);
    setIndividualSentiments([]);
    setError(null);
    setLoading(false);
  };

  const handleButtonClick = async () => {
    clear();
    setLoading(true);
    try {
      const res = await fetch(`https://letterboxd-rss-wrapper.herokuapp.com/rss?user=${username}`);
      if (!res.ok) {
        const msg: { error: string } = await res.json();
        setError(msg.error);
        setLoading(false);
      } else {
        const diaryJSON = (await res.json()) as DiaryEntry[];
        const filteredDiary = diaryJSON.filter(d => d.type === DiaryEntryType.DIARY && d.review);

        const reviews: Review[] = filteredDiary.map(d => ({
          entry: d,
          movie: d.film.title,
          review: d.review?.replace('\n', ' ') || '',
          published: d.date.published
        }));

        const sentiment = new Sentiment();
        const overall = sentiment.analyze(reviews.map(r => r.review).join(' '));
        const indivSentiments: ReviewSentiment[] = reviews.map(r => ({
          review: r,
          sentiment: sentiment.analyze(r.review)
        }));

        setOverallSentiment(overall);
        setIndividualSentiments(indivSentiments);
        setLoading(false);
      }
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Grid container direction="column" justify="center" alignItems="center">
        <Grid item xs>
          <TextField
            value={username}
            onChange={handleTextChange}
            label="Username"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="search" onClick={handleButtonClick}>
                    <Search />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>
        {error && (
          <Grid item xs>
            Error: {error}
          </Grid>
        )}
        {!loading && overallSentiment && (
          <>
            <Grid item xs>
              Overall: {overallSentiment.score}
            </Grid>
            <Grid item xs>
              Comparative: {overallSentiment.comparative}
            </Grid>
          </>
        )}
        {loading && <CircularProgress />}
      </Grid>
      {!loading && (
        <Grid container direction="column" justify="center">
          {individualSentiments.map(is => {
            const key = `${is.review.movie}-${is.review.published}`;
            return (
              <Grid item xs key={key}>
                <MovieReview reviewSentiment={is} />
              </Grid>
            );
          })}
        </Grid>
      )}
    </>
  );
}

export default App;
