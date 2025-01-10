import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder, TOrdersData } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getFeeds,
  getFeedsThunk,
  getIngredients,
  getIngredientsThunk,
  getIsLoadingFeeds,
  getOrdersThunk
} from '../../services/slices';

export const Feed: FC = () => {
  const feeds: TOrdersData = useSelector(getFeeds) || {
    orders: [],
    total: 0,
    totalToday: 0
  };

  const isLoadingFeeds = useSelector(getIsLoadingFeeds);

  const orders: TOrder[] = feeds.orders;

  const ingredients = useSelector(getIngredients);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeedsThunk());
    dispatch(getIngredientsThunk());
  }, []);

  if (isLoadingFeeds || !ingredients.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(getFeedsThunk());
        dispatch(getIngredientsThunk());
      }}
    />
  );
};
