import { ref, onMounted } from "vue";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../services/firebase.js";

const user = ref(null);
const loading = ref(true);

let initialized = false;

export function useAuth() {
  if (!initialized) {
    initialized = true;
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser;
      loading.value = false;
    });
  }

  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    return signOut(auth);
  };

  return { user, loading, login, logout };
}
