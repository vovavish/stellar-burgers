import { useEffect } from 'react';
import type { FC } from 'react';

import { TOrder } from '@utils-types';

import { getOrders, getOrdersThunk } from '../../services/slices';
import { useSelector, useDispatch } from '../../services/store';

import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(getOrders);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrdersThunk());
  }, []);

  if (!orders.length) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
