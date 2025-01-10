import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';

import { useDispatch, useSelector } from '../../services/store';
import {
  getConstructorItems,
  getIsUserAuth,
  getOrderModalData,
  getOrderRequest,
  orderBurgerApiThunk,
  resetIngredients,
  setOrderModalData,
  setOrderRequest
} from '../../services/slices';

import { BurgerConstructorUI } from '@ui';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(getConstructorItems);
  const orderRequest = useSelector(getOrderRequest);
  const orderModalData = useSelector(getOrderModalData);
  const isUserAuth = useSelector(getIsUserAuth);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const onOrderClick = () => {
    if (!isUserAuth) {
      return navigate('/login');
    }

    if (!constructorItems.bun || orderRequest) return;

    dispatch(
      orderBurgerApiThunk([
        constructorItems.bun._id,
        ...constructorItems.ingredients.map(
          (item: TConstructorIngredient) => item._id
        ),
        constructorItems.bun._id
      ])
    )
      .unwrap()
      .then(() => {
        dispatch(resetIngredients());
      });
  };
  const closeOrderModal = () => {
    dispatch(setOrderModalData(null));
    dispatch(setOrderRequest(false));
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
