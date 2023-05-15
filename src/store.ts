import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  configureStore,
  combineReducers,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useSelector, useDispatch} from 'react-redux';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import {PrettyCanvasProps} from './components/PrettyCanvas';
import {randomInt} from './utils/random';
import {colorSchemes, shuffleColors} from './utils/styles';

interface CanvasState {
  config: Record<string, PrettyCanvasProps>;
}

const grooveColors = Object.values(colorSchemes.groove);

const initialState: CanvasState = {
  config: {},
};
const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    setCanvas: (state, action: PayloadAction<number>) => {
      if (!state.config[action.payload.toString()]) {
        state.config[action.payload.toString()] = {
          colors: shuffleColors(grooveColors).slice(0, 3),
          size: randomInt(100, 150),
        };
      }
    },
  },
});

export const {setCanvas} = canvasSlice.actions;

export const selectCanvasProps = (id: number) => (state: RootState) =>
  state.canvas.config[id.toString()];

const reducers = combineReducers({
  canvas: canvasSlice.reducer,
});

const rootPersistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

export const persistedReducer = persistReducer(rootPersistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export const canvasReducer = canvasSlice.reducer;

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
