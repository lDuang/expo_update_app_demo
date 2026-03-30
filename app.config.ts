import { ExpoConfig, ConfigContext } from "@expo/config"

const config = ({ config }: ConfigContext): ExpoConfig => {
  const channel = process.env.EAS_BUILD_CHANNEL || "preview"
  
  return {
    ...config,
    name: "ExpoUpdateApp",
    slug: "expo-update-app",
    version: "1.0.0",
    runtimeVersion: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    updates: {
      url: `https://expo-test.duapp.dev/manifest/${channel}`
    },
    android: {
      package: "com.expo.updateapp"
    },
    ios: {
      bundleIdentifier: "com.expo.updateapp"
    }
  }
}

export default config
