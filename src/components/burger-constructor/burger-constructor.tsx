import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';

import { useDispatch, useSelector } from '../../services/store';
import {
  getConstructorItems,
  getOrderModalData,
  getOrderRequest,
  orderBurgerApiThunk,
  resetIngredients,
  setOrderModalData,
  setOrderRequest
} from '../../features';

import { BurgerConstructorUI } from '@ui';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(getConstructorItems);
  const orderRequest = useSelector(getOrderRequest);
  const orderModalData = useSelector(getOrderModalData);

  const dispatch = useDispatch();

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    dispatch(
      orderBurgerApiThunk([
        constructorItems.bun._id,
        ...constructorItems.ingredients.map(
          (item: TConstructorIngredient) => item._id
        ),
        constructorItems.bun._id
      ])
    );
  };
  const closeOrderModal = () => {
    dispatch(setOrderModalData(null));
    dispatch(setOrderRequest(false));
    dispatch(resetIngredients());
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
