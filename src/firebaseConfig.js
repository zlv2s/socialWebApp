import firebase from 'firebase'
import 'firebase/firestore'

var firebaseConfig = {
  apiKey: process.env.VUE_APP_APIKEY,
  authDomain: 'vue-bbs.firebaseapp.com',
  databaseURL: 'https://vue-bbs.firebaseio.com',
  projectId: 'vue-bbs',
  storageBucket: '',
  messagingSenderId: '152081377431',
  appId: process.env.VUE_APP_APPID
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

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
