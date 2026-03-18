import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

export const fetchProfileOrders = createAsyncThunk(
  'profileOrders/fetchProfileOrders',
  async () => {
    const response = await getOrdersApi();
    return response;
  }
);

interface ProfileOrdersState {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch profile orders';
      });
  }
});

export const selectProfileOrders = (state: {
  profileOrders: ProfileOrdersState;
}) => state.profileOrders.orders;
export const selectProfileOrdersLoading = (state: {
  profileOrders: ProfileOrdersState;
}) => state.profileOrders.isLoading;
export const selectProfileOrdersError = (state: {
  profileOrders: ProfileOrdersState;
}) => state.profileOrders.error;

export default profileOrdersSlice.reducer;
