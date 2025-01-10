import type { FC } from 'react';

import { useLocation, Navigate, Outlet } from 'react-router-dom';

import { getUser, getIsAuthChecked } from '../../features';

import { useSelector } from '../../services/store';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ onlyUnAuth }) => {
  const isAuthChecked = useSelector(getIsAuthChecked);
  const user = useSelector(getUser);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };

    return <Navigate replace to={from} />;
  }

  return <Outlet />;
};
