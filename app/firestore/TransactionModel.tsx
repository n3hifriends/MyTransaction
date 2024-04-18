import { Timestamp } from "@firebase/firestore"

export declare type TransactionType = "income" | "expense" | "self" | "all" // expense to be done by all & self is individual contribution
export declare type TransactionOwner = "Mahesh" | "Suresh" | "Ramesh" | "all"
export declare type TransactionCategory = "solar" | "drip" | "other"
export declare type DueFrom = "client" | "supplier" | "all"
export const gstArr = ["gst"]
export interface TransactionModel {
  amount: number
  client_name: string
  description: string
  type: TransactionType
  paid: boolean
  dueFrom?: DueFrom
  category: TransactionCategory
  date: Timestamp
  id?: string
  whoami: TransactionOwner
  taxes: Array<string>
}
