// bringing firebase libraray modules
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

// configure object setting for our project provided by firebase
const config = {
  apiKey: 'AIzaSyDtVelB9-MjWyJCpmluPiGLgNReztq3zDE',
  authDomain: 'react-eshop-db.firebaseapp.com',
  databaseURL: 'https://react-eshop-db.firebaseio.com',
  projectId: 'react-eshop-db',
  storageBucket: 'react-eshop-db.appspot.com',
  messagingSenderId: '887267216915',
  appId: '1:887267216915:web:2d2ac8655fc542b312f9e6'
}

// initialize our firebase app
firebase.initializeApp(config)

// createing auth function for export
const auth = firebase.auth()
// creating database firestore function for export
const firestore = firebase.firestore()
// creating auth of google on our auth function
const provider = new firebase.auth.GoogleAuthProvider()
// providing custom parameters requirement by firebase
provider.setCustomParameters({
  prompt: 'select_account'
})

// function for creating auth user in our firestore DB
const createUserProfileDocument = async (userAuth, additionalData) => {
  // reciving userAuth object or any additional setting if required
  if (!userAuth) return // returning from the function if user is not authenticated
  const userRef = firestore.doc(`users/${userAuth.uid}`) // query to the database to get the snapshot
  const snapShot = await userRef.get() // only using ref object we can use CRUD operation to fing out data exists or not

  if (!snapShot.exits) { // if snapshot means user not exists already on our DB then create a authentication data
    // destrcuturing displayName and email from userAuth object we get from success signin authentication
    const { displayName, email } = userAuth
    const createAt = new Date()

    try {
      // string data to the DB , the document id will be userAuth.uid as we are using that as a reference object
      await userRef.set({
        displayName,
        email,
        createAt,
        ...additionalData
      })
    } catch (error) {
      console.log('error creating user', error) // error in case of any issues
    }
  }

  return userRef // return userRef object for any further CRUD uses
}

// its a function add a collection with all documents inside
const addCollectionAndDocuments = async (collectionKey, objectsToAdd) => {
  const collectionRef = firestore.collection(collectionKey)

  const batch = firestore.batch() // batch is the method provided by firestore to run all async call in a single batch
  objectsToAdd.forEach(object => { // lopping through all docs which are emtpy at the moment
    const newDocRef = collectionRef.doc() // provide refquery for each doc with id created dynamically
    batch.set(newDocRef, object) // so we tell its a batch async to set each document with each object we pass in arguments
  })

  await batch.commit().then(() => {
    return {} // the return is very important at this point othwerwise data will not added to firestore as this function will end before batch complete
  }) // this will trigger the batch of async
}

// read collection data from our collections inside firestore and convert collection snapshot toMap

const convertCollectionsSnapshotToMap = (collections) => {
  const transformedCollections = collections.docs.map(doc => {
    const { title, items } = doc.data()
    return {
      routeName: encodeURI(title.toLowerCase()),
      id: doc.id,
      title,
      items
    }
  })
  // converting array of objects to object of object normalize data to map
  return transformedCollections.reduce((accu, item) => {
    accu[item.title.toLowerCase()] = item
    return accu
  }, {})
}

const signInWithGoogle = () => auth.signInWithPopup(provider) // create a signInWithGoogle to use other place

// exporting all required object and functions to use in our app
export {
  auth,
  firestore,
  signInWithGoogle,
  createUserProfileDocument,
  addCollectionAndDocuments,
  convertCollectionsSnapshotToMap
}

export default firebase
