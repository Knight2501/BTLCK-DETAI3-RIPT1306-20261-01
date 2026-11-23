import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit';
import { api } from '../api/client.js';

export const fetchMenu = createAsyncThunk('menu/fetch', async () => {
  const { items } = await api('/mealplans/me');
  return items;
});

export const saveMenu = createAsyncThunk('menu/save', async (_, { getState }) => {
  const items = getState().menu.items.map(({ day, meal, recipe }) => ({ day, meal, recipe: recipe._id }));
  await api('/mealplans/me', { method: 'PUT', body: { items } });
});

const menuSlice = createSlice({
  name: 'menu',
  initialState: { items: [], status: 'idle', saving: false, dirty: false },
  reducers: {
    // Đặt món vào ô (ngày × bữa); mỗi ô chỉ có 1 món
    setSlot: (state, { payload: { day, meal, recipe } }) => {
      state.items = [...state.items.filter((i) => !(i.day === day && i.meal === meal)), { day, meal, recipe }];
      state.dirty = true;
    },
    clearSlot: (state, { payload: { day, meal } }) => {
      state.items = state.items.filter((i) => !(i.day === day && i.meal === meal));
      state.dirty = true;
    },
    clearMenu: (state) => {
      state.items = [];
      state.dirty = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (s) => { s.status = 'loading'; })
      .addCase(fetchMenu.fulfilled, (s, { payload }) => { s.items = payload; s.status = 'ready'; s.dirty = false; })
      .addCase(fetchMenu.rejected, (s) => { s.status = 'error'; })
      .addCase(saveMenu.pending, (s) => { s.saving = true; })
      .addCase(saveMenu.fulfilled, (s) => { s.saving = false; s.dirty = false; })
      .addCase(saveMenu.rejected, (s) => { s.saving = false; });
  },
});

export const { setSlot, clearSlot, clearMenu } = menuSlice.actions;

const selectItems = (state) => state.menu.items;

// Danh sách đi chợ: cộng dồn nguyên liệu trùng (cùng tên + cùng đơn vị) bằng reduce
export const selectShoppingList = createSelector([selectItems], (items) => {
  const merged = items
    .flatMap(({ recipe }) => recipe.ingredients)
    .reduce((acc, { name, quantity, unit }) => {
      const key = `${name.trim().toLowerCase()}|${unit.trim().toLowerCase()}`;
      const prev = acc[key];
      return { ...acc, [key]: { name, unit, quantity: (prev?.quantity ?? 0) + quantity } };
    }, {});
  return Object.values(merged).sort((a, b) => a.name.localeCompare(b.name, 'vi'));
});

export default menuSlice.reducer;
