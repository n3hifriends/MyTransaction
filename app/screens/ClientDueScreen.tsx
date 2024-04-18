import React, { FC, useRef } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, ViewStyle, TextInput, Alert } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, Screen, Text, TextField, Toggle, ToggleProps } from "app/components"
import { spacing } from "app/theme"
import { useNavigation } from "@react-navigation/native"
import { useFirestore } from "app/firestore/config/FirestoreContext"
import { Timestamp } from "@firebase/firestore"
import { TransactionCategory, TransactionOwner, gstArr } from "app/firestore/TransactionModel"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface ClientDueScreenProps extends AppStackScreenProps<"ClientDue"> {}

export const ClientDueScreen: FC<ClientDueScreenProps> = observer(function ClientDueScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  const [clientName, setClientName] = React.useState("")
  const [myName, setMyName] = React.useState("Mahesh")
  const [amount, setAmount] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [category, setCategory] = React.useState("")
  const [gstIncluded, setGstIncluded] = React.useState(false)
  const [paid, setPaid] = React.useState(true)
  const clientNameRef = useRef<TextInput>(null)
  const amountRef = useRef<TextInput>(null)
  const descriptionRef = useRef<TextInput>(null)
  // Pull in navigation via hook
  const navigation = useNavigation()
  const { firestore, insertTransaction } = useFirestore()

  async function addInvestment() {
    if (
      myName.length === 0 ||
      clientName.length === 0 ||
      amount.length === 0 ||
      category.length === 0 ||
      description.length === 0
    ) {
      Alert.alert("Please fill all the fields")
      return
    }
    const inserted = await insertTransaction(firestore, {
      amount: Number(amount),
      client_name: clientName,
      description: description,
      type: "expense",
      paid: paid,
      category: category as TransactionCategory,
      date: Timestamp.now(),
      dueFrom: "client",
      // id: "1",
      whoami: myName as TransactionOwner,
      taxes: gstArr,
    })
    if (inserted === true) {
      Alert.alert("Done!", "Transaction added successfully", [
        {
          text: "Add More",
          onPress: () => {
            setMyName("")
            setClientName("")
            setAmount("")
            setDescription("")
            setCategory("")
            setGstIncluded(false)
            setPaid(true)
          },
        },
        {
          text: "Go Back",
          onPress: () => {
            navigation.goBack()
          },
        },
      ])
    } else {
      Alert.alert("Error", "Transaction failed")
    }
  }

  function login(name: string) {
    Alert.alert("Hey " + `${name}` + "!", "Confirm your transaction", [
      {
        text: "OK",
        onPress: () => {
          addInvestment()
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
      <Text testID="login-heading" tx="clientDueScreen.title" preset="heading" style={$signIn} />

      <TextField
        value={myName}
        onChangeText={setMyName}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="name"
        autoCorrect={false}
        keyboardType="default"
        labelTx="clientDueScreen.yourName"
        placeholderTx="clientDueScreen.yourNamePlaceholder"
        onSubmitEditing={() => clientNameRef.current?.focus()}
      />

      <TextField
        ref={clientNameRef}
        value={clientName}
        onChangeText={setClientName}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="name"
        autoCorrect={false}
        keyboardType="default"
        labelTx="clientDueScreen.clientName"
        placeholderTx="clientDueScreen.clientNamePlaceholder"
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
        labelTx="clientDueScreen.amount"
        placeholderTx="clientDueScreen.amountPlaceholder"
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
        labelTx="clientDueScreen.description"
        placeholderTx="clientDueScreen.descriptionPlaceholder"
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
        labelTx="investmentScreen.category"
        placeholderTx="investmentScreen.categoryPlaceholder"
      />
      <Button
        testID="login-button"
        tx="clientDueScreen.submit"
        style={$tapButton}
        preset="reversed"
        onPress={() => {
          login(myName)
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

const $root: ViewStyle = {
  flex: 1,
}
