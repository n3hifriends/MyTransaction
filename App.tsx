import "@expo/metro-runtime"
import React from "react"
import * as SplashScreen from "expo-splash-screen"
import App from "./app/app"
import { FirestoreProvider } from "./app/firestore/config/FirestoreContext"

SplashScreen.preventAutoHideAsync()

function IgniteApp() {
  return (
    <FirestoreProvider>
      <App hideSplashScreen={SplashScreen.hideAsync} />
    </FirestoreProvider>
  )
}

export default IgniteApp
