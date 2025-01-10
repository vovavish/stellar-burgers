import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';

import { useSelector } from '../../services/store';
import { getConstructorItems } from '../../features';

import { BurgerConstructorUI } from '@ui';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(getConstructorItems);
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */

  const orderRequest = false;

  const orderModalData = null;

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
  };
  const closeOrderModal = () => {};

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
