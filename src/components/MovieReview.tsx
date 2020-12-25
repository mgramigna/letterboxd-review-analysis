import { Grid, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { ReviewSentiment } from '../types';

const PositiveWord = styled.span`
  color: green;
`;

const NegativeWord = styled.span`
  color: red;
`;

interface Props {
  reviewSentiment: ReviewSentiment;
}

const MovieReview = ({ reviewSentiment }: Props) => {
  const theme = useTheme();
  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  const key = `${reviewSentiment.review.movie}-${reviewSentiment.review.published}`;
  const { entry } = reviewSentiment.review;

  const renderWord = (reviewSentiment: ReviewSentiment, word: string, key: string) => {
    const strippedWord = word
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
      .replace(/\s/g, '')
      .toLowerCase();

    if (reviewSentiment.sentiment.negative.includes(strippedWord)) {
      return <NegativeWord key={`${key}-${word}`}>{word + ' '}</NegativeWord>;
    } else if (reviewSentiment.sentiment.positive.includes(strippedWord)) {
      return <PositiveWord key={`${key}-${word}`}>{word + ' '}</PositiveWord>;
    } else {
      return word + ' ';
    }
  };

  const getPosterImage = () => {
    if (isExtraSmallScreen || isSmallScreen) {
      return entry.film.image.small;
    } else if (isMediumScreen) {
      return entry.film.image.medium;
    } else {
      return entry.film.image.large;
    }
  };

  const renderSentiment = (s: number, decimalPrecision?: number) => {
    if (s > 0.0) {
      return <PositiveWord>{decimalPrecision ? s.toFixed(decimalPrecision) : s}</PositiveWord>;
    } else if (s < 0.0) {
      return <NegativeWord>{decimalPrecision ? s.toFixed(decimalPrecision) : s}</NegativeWord>;
    } else {
      return s;
    }
  };

  return (
    <Grid container direction="row" justify="flex-start">
      <Grid item xs>
        <div>
          <img src={getPosterImage()} />
        </div>
      </Grid>
      <Grid item xs={10}>
        <Typography variant="h6">{reviewSentiment.review.movie}</Typography>
        <Typography variant="subtitle1">
          Overall: {renderSentiment(reviewSentiment.sentiment.score)} Comparative:{' '}
          {renderSentiment(reviewSentiment.sentiment.comparative, 2)}
        </Typography>
        <p>
          {reviewSentiment.review.review.split(' ').map((word, i) => renderWord(reviewSentiment, word, `${i}-${key}`))}
        </p>
      </Grid>
    </Grid>
  );
};

export default MovieReview;
