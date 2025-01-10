import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useDispatch, useSelector } from '../../services/store';
import {
  getIngredientById,
  getIngredients,
  getIngredientsThunk,
  setIngredientById
} from '../../features';

import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

export const IngredientDetails: FC = () => {
  const ingredientData = useSelector(getIngredientById);
  const ingredients = useSelector(getIngredients);
  const dispatch = useDispatch();

  const { id } = useParams();

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(getIngredientsThunk());
    }
    console.log(id);
    dispatch(setIngredientById(id));
  }, [id, ingredients]);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
