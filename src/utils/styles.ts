export const colorSchemes = {
  groove: {
    orange: '#f58549',
    magenta_haze: '#8e5572',
    mint_cream: '#f2f7f2',
    night: '#141414',
    english_violet: '#443850',
    light_english_violet: '#EBE7EE',
  },
} as const;

export const shuffleColors = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};

export const colors = {
  primary: colorSchemes.groove.night,
  textLight: colorSchemes.groove.mint_cream,
  textDark: colorSchemes.groove.english_violet,
  placeholder: colorSchemes.groove.light_english_violet,
  card: colorSchemes.groove.mint_cream,
  pill: colorSchemes.groove.english_violet,
} as const;

export const getTextColor = (theme: 'light' | 'dark') => {
  return theme === 'light' ? colors.textLight : colors.textDark;
};

export const headerHeight = 120;

const SHOW_DEBUG = false;

const randomColor = (alpha: number) =>
  `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
    Math.random() * 256
  )}, ${Math.floor(Math.random() * 256)}, ${alpha})`;
export const debugStyle = () =>
  __DEV__ && SHOW_DEBUG && `border: 1px solid ${randomColor(0.4)}`;
