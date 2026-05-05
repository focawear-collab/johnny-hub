module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@/components': './components',
            '@/constants': './constants',
            '@/hooks': './hooks',
            '@/lib': './lib',
            '@/i18n': './i18n',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
