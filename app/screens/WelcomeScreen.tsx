import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import { View, ViewStyle } from "react-native"
import { Button, Text } from "app/components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { useHeader } from "../utils/useHeader"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import { useFirestore } from "app/firestore/config/FirestoreContext"
import { Timestamp } from "@firebase/firestore"
import { startOfToday, subDays } from "date-fns"

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen(_props) {
  const { navigation } = _props
  const {
    authenticationStore: { logout },
  } = useStores()

  // const { firestore, fetchTransactionsByDate, insertTransaction } = useFirestore()

  useEffect(() => {
    return () => console.tron.log("WelcomeScreen unmounted")
  }, [])

  function goNext(screen: any) {
    navigation.navigate(screen)
    // navigation.navigate("Investment")
    // navigation.navigate("Demo", { screen: "DemoShowroom", params: {} })
  }

  useHeader(
    {
      rightTx: "common.logOut",
      onRightPress: logout,
    },
    [logout],
  )

  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

  return (
    <View style={$container}>
      <View style={$topContainer}>
        <View style={[$bottomContainer, $bottomContainerInsets]}>
          <Button
            style={$buttonStyle}
            testID="next-screen-button"
            preset="reversed"
            tx="welcomeScreen.investment"
            onPress={() => {
              goNext("Investment")
            }}
          />
          <Button
            style={$buttonStyle}
            testID="next-screen-button"
            preset="reversed"
            tx="welcomeScreen.received"
            onPress={() => {
              goNext("Received")
            }}
          />
        </View>
        <View style={[$bottomContainer, $bottomContainerInsets]}>
          <Button
            style={$buttonStyle}
            testID="next-screen-button"
            preset="reversed"
            tx="welcomeScreen.supplierDue"
            onPress={() => {
              goNext("SupplierDue")
            }}
          />
          <Button
            style={$buttonStyle}
            testID="next-screen-button"
            preset="reversed"
            tx="welcomeScreen.clientDue"
            onPress={() => {
              goNext("ClientDue")
            }}
          />
        </View>
        <View style={[$bottomContainer, $bottomContainerInsets]}>
          <Button
            style={$buttonStyle}
            testID="next-screen-button"
            preset="reversed"
            tx="welcomeScreen.turnOver"
            onPress={() => {
              goNext("TurnOver")
            }}
          />
          <Button
            style={$buttonStyle}
            testID="next-screen-button"
            preset="reversed"
            tx="welcomeScreen.profit"
            onPress={() => {
              goNext("Profit")
            }}
          />
        </View>
        <View style={[$bottomContainer, $bottomContainerInsets]}>
          <Button
            style={$buttonStyle}
            testID="next-screen-button"
            preset="reversed"
            tx="welcomeScreen.personalExpense"
            onPress={() => {
              goNext("Personal")
            }}
          />
          <Button
            style={$buttonStyle}
            testID="next-screen-button"
            preset="reversed"
            tx="welcomeScreen.personalProfit"
            onPress={() => {
              goNext("PersonalProfit")
            }}
          />
        </View>
      </View>
    </View>
  )
})

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
  paddingTop: spacing.xl,
}

const $topContainer: ViewStyle = {
  flexBasis: "80%",
}

const $bottomContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 0,
  backgroundColor: colors.background,
  flexDirection: "row",
  flexBasis: "43%",
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  justifyContent: "space-around",
}

const $buttonStyle: ViewStyle = {
  width: "45%",
  height: "85%",
  borderRadius: spacing.xl,
}
