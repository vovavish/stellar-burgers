import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { getUser } from '../../services/slices';

export const AppHeader: FC = () => {
  const user = useSelector(getUser);

  return <AppHeaderUI userName={user?.name || ''} />;
};
