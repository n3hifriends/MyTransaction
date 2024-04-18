import React, { FC, useRef } from "react"
import { observer } from "mobx-react-lite"
import { Alert, TextInput, TextStyle, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, EmptyState, Screen, Text, TextField, Toggle, ToggleProps } from "app/components"
import { colors, spacing } from "app/theme"
import { Timestamp } from "@firebase/firestore"
import { useFirestore } from "app/firestore/config/FirestoreContext"
import { TransactionCategory, TransactionOwner, gstArr } from "app/firestore/TransactionModel"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface PersonalScreenProps extends AppStackScreenProps<"Personal"> {}

export const PersonalScreen: FC<PersonalScreenProps> = observer(function PersonalScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  const [supplierName, setSupplierName] = React.useState("")
  const [myName, setMyName] = React.useState("Mahesh")
  const [amount, setAmount] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [category, setCategory] = React.useState("")
  const [gstIncluded, setGstIncluded] = React.useState(false)
  const [paid, setPaid] = React.useState(true)
  const supplierNameRef = useRef<TextInput>(null)
  const amountRef = useRef<TextInput>(null)
  const descriptionRef = useRef<TextInput>(null)
  // Pull in navigation via hook
  // const navigation = useNavigation()
  const { firestore, insertTransaction } = useFirestore()

  async function addPersonalExpense() {
    if (
      myName.length === 0 ||
      supplierName.length === 0 ||
      amount.length === 0 ||
      category.length === 0 ||
      description.length === 0
    ) {
      Alert.alert("Please fill all the fields")
      return
    }
    const inserted = await insertTransaction(firestore, {
      amount: Number(amount),
      client_name: supplierName,
      description: description,
      type: "self",
      paid: paid,
      category: category as TransactionCategory,
      date: Timestamp.now(),
      // id: "1",
      whoami: myName as TransactionOwner,
      taxes: gstArr,
    })
    if (inserted === true) {
      Alert.alert("Transaction added successfully")
    } else {
      Alert.alert("Transaction failed")
    }
  }

  function login(name: string) {
    Alert.alert("Hey " + `${name}` + "!", "Confirm your transaction", [
      {
        text: "OK",
        onPress: () => {
          addPersonalExpense()
        },
        style: "default",
      },
      { text: "Cancel", onPress: () => {}, style: "destructive" },
    ])
  }

  type MyToggleType = ToggleProps & { onPress: any }

  function ControlledToggle(props: MyToggleType) {
    const [value, setValue] = React.useState(props.value || false)
    return (
      <Toggle
        labelStyle={{ marginVertical: spacing.sm }}
        {...props}
        value={value}
        onPress={() => {
          setValue(!value)
          props.onPress && props.onPress(!value)
        }}
      />
    )
  }
  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text testID="login-heading" tx="personalScreen.title" preset="heading" style={$signIn} />
      <TextField
        value={myName}
        onChangeText={setMyName}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="name"
        autoCorrect={false}
        keyboardType="default"
        labelTx="personalScreen.yourName"
        placeholderTx="personalScreen.yourNamePlaceholder"
        onSubmitEditing={() => supplierNameRef.current?.focus()}
      />

      <TextField
        ref={supplierNameRef}
        value={supplierName}
        onChangeText={setSupplierName}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="name"
        autoCorrect={false}
        keyboardType="default"
        labelTx="personalScreen.supplierName"
        placeholderTx="personalScreen.supplierNamePlaceholder"
        onSubmitEditing={() => amountRef.current?.focus()}
      />

      <TextField
        ref={amountRef}
        value={amount}
        onChangeText={setAmount}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
        keyboardType="numeric"
        labelTx="personalScreen.amount"
        placeholderTx="personalScreen.amountPlaceholder"
        onSubmitEditing={() => descriptionRef.current?.focus()}
      />

      <TextField
        ref={descriptionRef}
        value={description}
        onChangeText={setDescription}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
        keyboardType="default"
        labelTx="personalScreen.description"
        placeholderTx="personalScreen.descriptionPlaceholder"
        multiline
      />

      <ControlledToggle
        value={gstIncluded}
        onPress={(value: boolean) => setGstIncluded(value)}
        variant="switch"
        label="GST included"
      />
      <ControlledToggle
        value={paid}
        onPress={(value: boolean) => setPaid(value)}
        variant="switch"
        label="Paid"
      />

      <TextField
        value={category}
        onChangeText={setCategory}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
        keyboardType="default"
        labelTx="personalScreen.category"
        placeholderTx="personalScreen.categoryPlaceholder"
      />
      <Button
        testID="login-button"
        tx="personalScreen.submit"
        style={$tapButton}
        preset="reversed"
        onPress={() => {
          login("Mahesh")
        }}
      />
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xl,
  paddingHorizontal: spacing.lg,
}

const $signIn: TextStyle = {
  marginBottom: spacing.sm,
}

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.xs,
}
