import { createSlice } from '@reduxjs/toolkit';

export interface ICurrentModalSlice {
  isModalOpen: boolean;
}

const initialState: ICurrentModalSlice = {
  isModalOpen: false
};

export const currentModalSlice = createSlice({
  name: 'currentModal',
  initialState,
  reducers: {
    toggleModal: (state) => {
      state.isModalOpen = !state.isModalOpen;
    }
  },
  selectors: {
    getIsModalOpen: (state) => state.isModalOpen
  }
});

export const { toggleModal } = currentModalSlice.actions;

export const { getIsModalOpen } = currentModalSlice.selectors;

export const currentModal = currentModalSlice.reducer;
