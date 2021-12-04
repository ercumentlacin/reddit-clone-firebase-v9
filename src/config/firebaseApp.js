import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  inMemoryPersistence,
  setPersistence,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  Timestamp,
  where,
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);

const db = getFirestore(firebaseApp);

const actions = {
  async firebaseSigin() {
    let profile = {};

    function makeUserProfile(response) {
      const credential = GoogleAuthProvider.credentialFromResult(response);
      const token = credential.accessToken;
      const { user } = response;
      const { displayName, email, photoURL, uid } = user;

      profile = {
        isLoggedIn: true,
        user: {
          displayName,
          email,
          photoURL,
          uid,
          token,
        },
      };
    }

    await setPersistence(auth, inMemoryPersistence)
      .then(async () => {
        const provider = new GoogleAuthProvider();

        const response = await signInWithPopup(auth, provider);
        makeUserProfile(response);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
      });

    localStorage.setItem('user', JSON.stringify(profile));

    return profile;
  },
  firebaseLogout() {
    signOut(auth)
      .then(() => {
        console.log('başarılı');
      })
      .catch((error) => {
        console.error(error);
      });
  },
  async firebaseAddSubreddit(docName, data) {
    const response = await setDoc(doc(db, docName, data.name), {
      _id: uuidv4(),
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      slug: `/${data.name.replace(/\s+/g, '-').toLowerCase()}`,
    });
    return response;
  },
  async firebaseAddPost(docName, data) {
    const colRef = collection(db, docName);

    const postData = {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const response = await addDoc(colRef, postData);
    return response;
  },
};

const getters = {
  async getSubreddits() {
    const subredits = [];
    try {
      const q = query(collection(db, 'subredits'), orderBy('name', 'asc'));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        subredits.push({
          ...doc.data(),
          doc_id: doc.id,
        });
      });
    } catch (error) {
      console.error(error);
    } finally {
      // eslint-disable-next-line no-unsafe-finally
      return subredits;
    }
  },
  async getPosts(subredditName) {
    const posts = [];
    try {
      const q = query(
        collection(db, 'posts'),
        where('subredditName', '==', subredditName),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        posts.push({
          ...doc.data(),
          doc_id: doc.id,
        });
      });
    } catch (error) {
      console.error(error);
    }
    return posts;
  },
};

export { actions, db, getters };

export default firebaseApp;
