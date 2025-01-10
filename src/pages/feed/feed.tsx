import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getFeedsThunk,
  getIngredients,
  getIngredientsThunk,
  getIsLoadingFeeds,
  getOrders,
  getOrdersThunk
} from '../../features';

export const Feed: FC = () => {
  const orders: TOrder[] = useSelector(getOrders);
  const isLoadingFeeds = useSelector(getIsLoadingFeeds);
  const ingredients = useSelector(getIngredients);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrdersThunk());
    dispatch(getFeedsThunk());
    dispatch(getIngredientsThunk());
  }, []);

  if (!orders.length || isLoadingFeeds || !ingredients.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(getOrdersThunk());
        dispatch(getFeedsThunk());
      }}
    />
  );
};
