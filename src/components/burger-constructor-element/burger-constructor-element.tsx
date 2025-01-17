import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import {
  moveIngridientInDirection,
  removeIngridientInOrder
} from '../../services/slices';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = () => {
      dispatch(
        moveIngridientInDirection({ ingredient, direction: 'down' as 'down' })
      );
    };

    const handleMoveUp = () => {
      dispatch(
        moveIngridientInDirection({ ingredient, direction: 'up' as 'up' })
      );
    };

    const handleClose = () => {
      dispatch(removeIngridientInOrder(ingredient));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
