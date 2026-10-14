const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withReleaseSigning(config) {
  return withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    const signingStart = contents.indexOf('signingConfigs {');
    const buildTypesStart = contents.indexOf('buildTypes {', signingStart);

    if (signingStart === -1 || buildTypesStart === -1) {
      throw new Error('Nie znaleziono signingConfigs/buildTypes w android/app/build.gradle.');
    }

    // Dodaj osobny config podpisu wewnątrz signingConfigs.
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
      ].join('\n');

      contents =
        contents.slice(0, insertAt) +
        releaseConfig +
        contents.slice(insertAt);
    }

    // Podpisz build release naszym kluczem.
    const buildTypesStart2 = contents.indexOf('buildTypes {');
    const releaseStart = contents.indexOf('release {', buildTypesStart2);

    if (releaseStart === -1) {
      throw new Error('Nie znaleziono buildTypes.release w android/app/build.gradle.');
    }

    const nextBuildType = contents.indexOf('\n        }', releaseStart);
    const releaseEnd = nextBuildType === -1 ? contents.length : nextBuildType + '\n        }'.length;
    const releaseBlock = contents.slice(releaseStart, releaseEnd);

    if (releaseBlock.includes('signingConfig signingConfigs.debug')) {
      const updatedReleaseBlock = releaseBlock.replace(
        'signingConfig signingConfigs.debug',
        'signingConfig signingConfigs.bliskoRelease'
      );
      contents =
        contents.slice(0, releaseStart) +
        updatedReleaseBlock +
        contents.slice(releaseEnd);
    } else if (!releaseBlock.includes('signingConfig signingConfigs.bliskoRelease')) {
      throw new Error('Nie znaleziono signingConfig w buildTypes.release.');
    }

    config.modResults.contents = contents;
    return config;
  });
};
