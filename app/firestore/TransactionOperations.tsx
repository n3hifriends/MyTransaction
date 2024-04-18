import {
  collection,
  addDoc,
  getDocs,
  Firestore,
  query,
  where,
  Timestamp,
  orderBy,
  and,
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore"
import {
  TransactionModel,
  TransactionType,
  TransactionOwner,
  TransactionCategory,
} from "./TransactionModel"
import { COLLECTION_transaction } from "./config/firebase"
// Documentation: https://firebase.google.com/docs/firestore/quickstart#auth-required
// Queries: https://firebase.google.com/docs/firestore/query-data/queries
// Tutorials: https://github.com/firebase/snippets-web/tree/a9160f62f8ebff02285779974620ad3ff260f5ac/snippets/firestore-next/test-firestore
async function insertTransaction(firestore: Firestore, data: TransactionModel): Promise<boolean> {
  try {
    const docRef = await addDoc(collection(firestore, COLLECTION_transaction), data)
    return true
  } catch (error) {
    console.error("insertTransaction Error adding document: ", error)
    return false
  }
}

async function fetchTransactionsByType(
  firestore: Firestore,
  from: Timestamp,
  to: Timestamp,
  type: TransactionType = "all",
): Promise<{ transactions: TransactionModel[] }> {
  let myTransactions
  try {
    if (type === "all") {
      myTransactions = await getDocs(collection(firestore, COLLECTION_transaction))
    } else {
      myTransactions = await getDocs(
        query(
          collection(firestore, COLLECTION_transaction),
          and(where("type", "==", type), where("date", ">=", from), where("date", "<=", to)),
          orderBy("date"),
        ),
      )
    }

    // querySnapshot.forEach((doc) => {
    //   console.log(`${doc.id} => ${JSON.stringify(doc.data())}`)
    // })
    return { transactions: myTransactions.docs.map((doc) => doc.data() as TransactionModel) }
  } catch (error) {
    console.error("fetchTransactionsByType Error fetching document: ", error)
  }
  return { transactions: [] }
}

async function fetchTransactionsByOwner(
  firestore: Firestore,
  from: Timestamp,
  to: Timestamp,
  owner: TransactionOwner = "all",
): Promise<{ transactions: TransactionModel[] }> {
  let myTransactions
  try {
    if (owner === "all") {
      myTransactions = await getDocs(collection(firestore, COLLECTION_transaction))
    } else {
      myTransactions = await getDocs(
        query(
          collection(firestore, COLLECTION_transaction),
          and(where("type", "==", owner), where("date", ">=", from), where("date", "<=", to)),
          orderBy("date"),
        ),
      )
    }

    return { transactions: myTransactions.docs.map((doc) => doc.data() as TransactionModel) }
  } catch (error) {
    console.error("fetchTransactionsByOwner Error fetching document: ", error)
  }
  return { transactions: [] }
}

/**
 * // 1 week in ms = 1000 * 60 * 60 * 24 * 7 = 604800000
 * this fuction return default last 7 days transactions if no date range passed
 * @param firestore
 * @param from
 * @param to
 * @returns {Promise<{transactions: TransactionModel[]}>}
 */
async function fetchTransactionsByDate(
  firestore: Firestore,
  from: Timestamp = Timestamp.fromMillis(Timestamp.now().toMillis() - 604800000),
  to: Timestamp = Timestamp.fromMillis(Timestamp.now().toMillis()),
): Promise<{ transactions: TransactionModel[] }> {
  console.log("fetchTransactionsByDate from", from)
  console.log("fetchTransactionsByDate to", to)
  try {
    const myTransactions = await getDocs(
      query(
        collection(firestore, COLLECTION_transaction),
        and(where("date", ">=", from), where("date", "<=", to)),
        orderBy("date"),
      ),
    )
    return { transactions: myTransactions.docs.map((doc) => doc.data() as TransactionModel) }
  } catch (error) {
    console.error("fetchTransactionsByDate Error fetching document: ", error)
  }
  return { transactions: [] }
}

async function getTurnover(firestore: Firestore, from: Timestamp, to: Timestamp): Promise<number> {
  try {
    const myTransactions = await fetchTransactionsByDate(firestore, from, to)
    const turnover = myTransactions.transactions.reduce((acc, curr) => acc + curr.amount, 0)
    if (turnover) {
      return turnover
    }
    return 0
  } catch (error) {
    console.error("getTurnover Error fetching document: ", error)
  }
  return 0
}

async function getNetProfit(firestore: Firestore, from: Timestamp, to: Timestamp): Promise<number> {
  try {
    const myTransactions = await fetchTransactionsByDate(firestore, from, to)
    const totalIncome = myTransactions.transactions.reduce((acc, curr) => acc + curr.amount, 0)

    const investment = myTransactions.transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((acc, curr) => acc + curr.amount, 0)

    if (totalIncome && investment) {
      return totalIncome - investment
    } else if (totalIncome) {
      return totalIncome
    }
    return 0
  } catch (error) {
    console.error("getNetProfit Error fetching document: ", error)
  }
  return 0
}

async function getSelfContribution(
  firestore: Firestore,
  from: Timestamp,
  to: Timestamp,
  whoami: TransactionOwner,
): Promise<number> {
  try {
    const myTransactions = await fetchTransactionsByOwner(firestore, from, to, whoami)
    const investment = myTransactions.transactions.reduce((acc, curr) => acc + curr.amount, 0)
    if (investment) {
      return investment
    }
    return 0
  } catch (error) {
    console.error("getSelfContribution Error fetching document: ", error)
  }
  return 0
}

async function getSelfProfit(
  firestore: Firestore,
  from: Timestamp,
  to: Timestamp,
  whoami: TransactionOwner,
): Promise<number> {
  try {
    const netProfit: number = await getNetProfit(firestore, from, to)
    const selfContribution: number = await getSelfContribution(firestore, from, to, whoami)
    const investmentTransaction = await fetchTransactionsByType(firestore, from, to, "expense")
    const totalInvestment: number = investmentTransaction.transactions.reduce(
      (acc, curr) => acc + curr.amount,
      0,
    )
    const selfProfit: number = selfContribution * (netProfit / totalInvestment)

    if (selfProfit) {
      return selfProfit
    }
    return 0
  } catch (error) {
    console.error("getSelfProfit Error fetching document: ", error)
  }
  return 0
}

async function updateTransaction(
  firestore: Firestore,
  clientName: string,
  category: TransactionCategory,
  data: TransactionModel,
): Promise<boolean> {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(firestore, COLLECTION_transaction),
        and(where("client_name", "==", clientName), where("category", "==", category)),
      ),
    )
    querySnapshot.forEach((myDoc) => {
      const docRef = doc(firestore, COLLECTION_transaction, myDoc.id)
      const keyValues = Object.fromEntries(Object.entries(data))
      async function updateTransaction(myDoc: any, docRef: any, keyValues: any) {
        updateDoc(docRef, keyValues)
        console.log("updateTransaction Document updated with ID: ", myDoc.id)
      }
      updateTransaction(myDoc, docRef, keyValues)
    })
    return true
  } catch (error) {
    console.error("updateTransaction Error adding document: ", error)
    return false
  }
}

export {
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
