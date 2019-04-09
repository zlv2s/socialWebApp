import firebase from 'firebase'
import 'firebase/firestore'

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyAankrV0nm0y04NucolU3Z5YwzN6H1EXuo',
  authDomain: 'zoulige11.firebaseapp.com',
  databaseURL: 'https://zoulige11.firebaseio.com',
  projectId: 'zoulige11',
  storageBucket: 'zoulige11.appspot.com',
  messagingSenderId: '659760262178'
}
firebase.initializeApp(config)

// firebase utils
const db = firebase.firestore()
const auth = firebase.auth()
const currentUser = auth.currentUser

// firebase collections
const usersCollection = db.collection('users')
const postsCollection = db.collection('posts')
const commentsCollection = db.collection('comments')
const likesCollection = db.collection('likes')

export {
  db,
  auth,
  currentUser,
  usersCollection,
  postsCollection,
  commentsCollection,
  likesCollection
}
