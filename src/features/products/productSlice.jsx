import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ limit, skip, category }) => {
    const url = category && category !== "all"
      ? `/products/category/${category}`
      : `/products?limit=${limit}&skip=${skip}`;

    const res = await api.get(url);
    return res.data;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false,
    currentPage: 1,
    limit: 10,
    selectedCategory: "all",
  },
  reducers: {
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
      });
  },
});

export const { setCategory } = productSlice.actions;
export default productSlice.reducer;
