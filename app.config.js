const versionName = process.env.BUILD_VERSION_NAME || '1.0.0';
const versionCode = Number(process.env.BUILD_VERSION_CODE || 1);

module.exports = {
  expo: {
    name: 'Blisko',
    slug: 'blisko',
    version: versionName,
    orientation: 'portrait',
    userInterfaceStyle: 'dark',
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#07100D'
    },
    android: {
      package: 'pl.blisko.app',
      versionCode,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#07100D'
      }
    },
    plugins: ['./plugins/withReleaseSigning']
  }
};
