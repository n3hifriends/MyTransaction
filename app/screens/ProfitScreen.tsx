import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { Alert, Keyboard, TextInput, TextStyle, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, Screen, Text, TextField } from "app/components"
import { colors, spacing } from "app/theme"
import { parse } from "date-fns"
import { Timestamp } from "@firebase/firestore"
import { useFirestore } from "app/firestore/config/FirestoreContext"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface ProfitScreenProps extends AppStackScreenProps<"Profit"> {}

export const ProfitScreen: FC<ProfitScreenProps> = observer(function ProfitScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")
  const endDateRef = React.useRef<TextInput>(null)
  // Pull in navigation via hook
  // const navigation = useNavigation()
  const { firestore, getNetProfit } = useFirestore()

  async function checkProfit() {
    if (startDate.length === 0 || endDate.length === 0) {
      return
    }
    const sDate = parse(startDate, "MM/dd/yyyy", new Date())
    const eDate = parse(endDate, "MM/dd/yyyy", new Date())
    const start = Timestamp.fromMillis(sDate.getTime())
    const end = Timestamp.fromMillis(eDate.getTime())
    const netProfit: number = await getNetProfit(firestore, start, end)
    Alert.alert(`₹ ${netProfit}/-`, `is the net profit between ${startDate} and ${endDate}`)
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text testID="login-heading" tx="profitScreen.title" preset="heading" style={$signIn} />
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextField
          value={startDate}
          onChangeText={(val) => {
            if (val.length > 10) {
              return
            }
            setStartDate(val)
            if (val.length === 2) {
              setStartDate(val + "/")
            } else if (val.length === 5) {
              setStartDate(val + "/")
            }
          }}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="name"
          autoCorrect={false}
          keyboardType="numeric"
          // labelTx="investmentScreen.yourName"
          placeholderTx="profitScreen.startDatePlaceholder"
          onSubmitEditing={() => endDateRef.current?.focus()}
          style={$customInputWithAbsoluteAccessoriesStyle}
          // LeftAccessory={() => (
          //   <Icon
          //     icon="menu"
          //     onPress={() => {
          //       console.log("left accessory pressed")
          //     }}
          //     containerStyle={$customLeftAccessoryStyle}
          //     color="white"
          //     size={41}
          //   />
          // )}
        />
        <TextField
          ref={endDateRef}
          value={endDate}
          onChangeText={(val) => {
            if (val.length > 10) {
              return
            } else if (val.length === 10) {
              Keyboard.dismiss()
            }
            setEndDate(val)
            if (val.length === 2) {
              setEndDate(val + "/")
            } else if (val.length === 5) {
              setEndDate(val + "/")
            }
          }}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="name"
          autoCorrect={false}
          keyboardType="numeric"
          // labelTx="investmentScreen.yourName"
          placeholderTx="profitScreen.endDatePlaceholder"
          // onSubmitEditing={() => endDateRef.current?.focus()}
          style={$customInputWithAbsoluteAccessoriesStyle}
          // RightAccessory={() => (
          //   <Icon icon="menu" containerStyle={$customRightAccessoryStyle} color="white" size={41} />
          // )}
        />
        <Button
          testID="login-button"
          tx="turnOverScreen.submit"
          style={$tapButton}
          preset="reversed"
          onPress={() => {
            checkProfit()
          }}
        />
      </View>
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xl,
  paddingHorizontal: spacing.lg,
}

const $customInputWithAbsoluteAccessoriesStyle: ViewStyle = {
  // marginHorizontal: spacing.xxl,
}

const $customLeftAccessoryStyle: ViewStyle = {
  backgroundColor: colors.error,
  position: "absolute",
  left: 0,
}

const $customRightAccessoryStyle: ViewStyle = {
  backgroundColor: colors.error,
  position: "absolute",
  right: 0,
}

const $textField: ViewStyle = {
  // marginBottom: spacing.lg,
  flex: 0.5,
  marginHorizontal: spacing.sm,
}
const $signIn: TextStyle = {
  marginBottom: spacing.sm,
}
const $tapButton: ViewStyle = {
  marginTop: spacing.xs,
}
