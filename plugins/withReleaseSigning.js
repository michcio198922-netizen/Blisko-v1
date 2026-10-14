const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withReleaseSigning(config) {
  return withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    if (!contents.includes('signingConfigs {')) {
      throw new Error('Nie znaleziono signingConfigs w android/app/build.gradle.');
    }

    if (!contents.includes('bliskoRelease')) {
      contents = contents.replace(
        /signingConfigs\s*\{([\s\S]*?)\n\s*\}/,
        (match, inner) => `signingConfigs {${inner}\n        bliskoRelease {\n            storeFile file('blisko-release.jks')\n            storePassword System.getenv('BLISKO_KEYSTORE_PASSWORD')\n            keyAlias 'blisko'\n            keyPassword System.getenv('BLISKO_KEYSTORE_PASSWORD')\n        }\n    }`
      );
    }

    contents = contents.replace(
      /signingConfig\s+signingConfigs\.debug(?=[\s\S]*?minifyEnabled)/,
      'signingConfig signingConfigs.bliskoRelease'
    );

    config.modResults.contents = contents;
    return config;
  });
};
