import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { TextInput, TextStyle, ViewStyle, View, Keyboard, Alert } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, Icon, Screen, Text, TextField } from "app/components"
import { colors, spacing } from "app/theme"
import { useFirestore } from "app/firestore/config/FirestoreContext"
import { Timestamp } from "@firebase/firestore"
import { parse } from "date-fns"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface TurnOverScreenProps extends AppStackScreenProps<"TurnOver"> {}

export const TurnOverScreen: FC<TurnOverScreenProps> = observer(function TurnOverScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")
  const endDateRef = React.useRef<TextInput>(null)
  // Pull in navigation via hook
  // const navigation = useNavigation()
  const { firestore, getTurnover } = useFirestore()

  async function checkTurnover() {
    if (startDate.length === 0 || endDate.length === 0) {
      return
    }
    const sDate = parse(startDate, "MM/dd/yyyy", new Date())
    const eDate = parse(endDate, "MM/dd/yyyy", new Date())
    const start = Timestamp.fromMillis(sDate.getTime())
    const end = Timestamp.fromMillis(eDate.getTime())
    const turnover: number = await getTurnover(firestore, start, end)
    Alert.alert(`₹ ${turnover}/-`, `is the turnover between ${startDate} and ${endDate}`)
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text testID="login-heading" tx="turnOverScreen.title" preset="heading" style={$signIn} />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
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
          placeholderTx="turnOverScreen.startDatePlaceholder"
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
            // if (val.length === 8) {
            //   setEndDate(formatDate("" + new Date(2014, 1, 11), "MM/dd/yyyy"))
            // } else {
            setEndDate(val)
            if (val.length === 2) {
              setEndDate(val + "/")
            } else if (val.length === 5) {
              setEndDate(val + "/")
            }
            // }
          }}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="name"
          autoCorrect={false}
          keyboardType="numeric"
          // labelTx="investmentScreen.yourName"
          placeholderTx="turnOverScreen.endDatePlaceholder"
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
            checkTurnover()
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
