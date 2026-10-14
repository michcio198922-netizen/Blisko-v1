const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withReleaseSigning(config) {
  return withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    const signingStart = contents.indexOf('signingConfigs {');
    const buildTypesStart = contents.indexOf('buildTypes {', signingStart);

    if (signingStart === -1 || buildTypesStart === -1) {
      throw new Error('Nie znaleziono signingConfigs/buildTypes w android/app/build.gradle.');
    }

    // Dodaj osobny config release tuż przed zamknięciem signingConfigs.
    if (!contents.includes('bliskoRelease {')) {
      const signingSection = contents.slice(signingStart, buildTypesStart);
      const closingBraceInSection = signingSection.lastIndexOf('}');

      if (closingBraceInSection === -1) {
        throw new Error('Nie znaleziono końca signingConfigs w android/app/build.gradle.');
      }

      const closingLineStart = signingSection.lastIndexOf('\n', closingBraceInSection) + 1;
      const insertAt = signingStart + closingLineStart;
      const releaseConfig = [
        "        bliskoRelease {",
        "            storeFile file('blisko-release.jks')",
        "            storePassword System.getenv('BLISKO_KEYSTORE_PASSWORD')",
        "            keyAlias 'blisko'",
        "            keyPassword System.getenv('BLISKO_KEYSTORE_PASSWORD')",
        "        }",
        ""
      ].join('\\n');

      contents = contents.slice(0, insertAt) + releaseConfig + contents.slice(insertAt);
    }

    // Zmień podpis WYŁĄCZNIE w buildTypes.release.
    const releaseStart = contents.indexOf('release {', contents.indexOf('buildTypes {'));
    if (releaseStart === -1) {
      throw new Error('Nie znaleziono buildTypes.release w android/app/build.gradle.');
    }

    const debugSigningInRelease = contents.indexOf('signingConfig signingConfigs.debug', releaseStart);
    if (debugSigningInRelease === -1) {
      if (!contents.slice(releaseStart).includes('signingConfig signingConfigs.bliskoRelease')) {
        throw new Error('Nie znaleziono signingConfig w buildTypes.release.');
      }
    } else {
      contents =
        contents.slice(0, debugSigningInRelease) +
        'signingConfig signingConfigs.bliskoRelease' +
        contents.slice(debugSigningInRelease + 'signingConfig signingConfigs.debug'.length);
    }

    config.modResults.contents = contents;
    return config;
  });
};
