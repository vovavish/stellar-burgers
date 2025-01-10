import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import uniqid from 'uniqid';

import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

import { getIngredientsApi } from '@api';

export const getIngredientsThunk = createAsyncThunk(
  'get/ingredients',
  async () => getIngredientsApi()
);

export interface IConstructorItems {
  bun: {
    _id: string;
    price: number;
    name: string;
    image: string;
  } | null;
  ingredients: TConstructorIngredient[];
}

export interface IIngredientsSlice {
  isIngredientsLoading: boolean;
  ingredients: TIngredient[];
  selectedIngredient: TIngredient | null;
  constructorItems: IConstructorItems;
}

const initialState: IIngredientsSlice = {
  isIngredientsLoading: false,
  ingredients: [],
  selectedIngredient: null,
  constructorItems: {
    bun: null,
    ingredients: []
  }
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setIngredientById: (state, { payload }) => {
      if (!state.ingredients.length) {
        return;
      }

      state.selectedIngredient =
        state.ingredients.find((item) => item._id === payload) || null;
    },
    addIngridientInOrder: (state, { payload }: { payload: TIngredient }) => {
      if (payload.type === 'bun') {
        state.constructorItems.bun = {
          ...payload
        };
      } else {
        state.constructorItems.ingredients = [
          ...state.constructorItems.ingredients,
          { ...payload, id: uniqid('id_') }
        ];
      }
    },
    resetIngredients: (state) => {
      state.constructorItems = {
        bun: null,
        ingredients: []
      };
    },
    removeIngridientInOrder: (
      state,
      { payload }: { payload: TConstructorIngredient }
    ) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item) => item.id !== payload.id
        );
    },
    moveIngridientInDirection: (
      state,
      {
        payload
      }: {
        payload: {
          ingredient: TConstructorIngredient;
          direction: 'up' | 'down';
        };
      }
    ) => {
      const ingredientIndex = state.constructorItems.ingredients.findIndex(
        (item) => item.id === payload.ingredient.id
      );

      const newConstructorItems = [...state.constructorItems.ingredients];

      let directionNumber = 0;

      if (payload.direction === 'up') {
        if (ingredientIndex <= 0) return;
        directionNumber = -1;
      } else {
        if (ingredientIndex >= newConstructorItems.length - 1) return;
        directionNumber = 1;
      }

      [
        newConstructorItems[ingredientIndex],
        newConstructorItems[ingredientIndex + directionNumber]
      ] = [
        newConstructorItems[ingredientIndex + directionNumber],
        newConstructorItems[ingredientIndex]
      ];

      state.constructorItems.ingredients = newConstructorItems;
    }
  },
  selectors: {
    getIsIngredientsLoading: (state) => state.isIngredientsLoading,
    getIngredients: (state) => state.ingredients,
    getIngredientById: (state) => state.selectedIngredient,
    getConstructorItems: (state) => state.constructorItems
  },
  extraReducers: (builder) => {
    builder.addCase(getIngredientsThunk.pending, (state) => {
      state.isIngredientsLoading = true;
    });
    builder.addCase(getIngredientsThunk.rejected, (state) => {
      state.isIngredientsLoading = false;
    });
    builder.addCase(getIngredientsThunk.fulfilled, (state, { payload }) => {
      state.isIngredientsLoading = false;
      state.ingredients = payload;
    });
  }
});

export const {
  setIngredientById,
  addIngridientInOrder,
  resetIngredients,
  removeIngridientInOrder,
  moveIngridientInDirection
} = ingredientsSlice.actions;

export const {
  getIsIngredientsLoading,
  getIngredients,
  getIngredientById,
  getConstructorItems
} = ingredientsSlice.selectors;

export const ingredients = ingredientsSlice.reducer;
