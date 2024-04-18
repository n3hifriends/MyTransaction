import React, { useContext, createContext } from "react"
import { firestore } from "./firebase"
import {
  fetchTransactionsByType,
  fetchTransactionsByOwner,
  insertTransaction,
  fetchTransactionsByDate,
  getTurnover,
  getNetProfit,
  getSelfContribution,
  getSelfProfit,
  updateTransaction,
} from "../TransactionOperations"

const firestoreOps = {
  firestore,
  insertTransaction,
  fetchTransactionsByType,
  fetchTransactionsByOwner,
  fetchTransactionsByDate,
  getTurnover,
  getNetProfit,
  getSelfContribution,
  getSelfProfit,
  updateTransaction,
}
const FirestoreContext = createContext(firestoreOps) // Provide a default value for createContext

interface ChildrenProps {
  children: React.ReactNode
}

export const FirestoreProvider = ({ children }: ChildrenProps) => {
  return <FirestoreContext.Provider value={firestoreOps}>{children}</FirestoreContext.Provider>
}

export const useFirestore = () => {
  return useContext(FirestoreContext)
}
