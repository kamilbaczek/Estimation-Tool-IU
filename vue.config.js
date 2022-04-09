module.exports = {
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false,
      enableLegacy: true
    }
  },

  configureWebpack: {
    devtool: "source-map",
  },

  devServer: {
    disableHostCheck: true,
  },
};
