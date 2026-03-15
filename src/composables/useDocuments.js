import { ref } from "vue";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { db, storage } from "../services/firebase.js";

export function useDocuments() {
  const documents = ref([]);
  const isLoading = ref(false);

  const uploadDocument = async (file, name, ownerId) => {
    isLoading.value = true;
    try {
      const fileRef = storageRef(
        storage,
        `documents/${ownerId}/${Date.now()}_${file.name}`,
      );
      const snapshot = await new Promise((resolve, reject) => {
        const uploadTask = uploadBytesResumable(fileRef, file);
        uploadTask.on("state_changed", null, reject, () => {
          resolve(uploadTask.snapshot);
        });
      });
      const storageUrl = await getDownloadURL(snapshot.ref);

      const docRef = await addDoc(collection(db, "documents"), {
        ownerId,
        name,
        fileName: file.name,
        storageUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return { id: docRef.id, name, fileName: file.name, storageUrl };
    } finally {
      isLoading.value = false;
    }
  };

  const fetchDocuments = async (ownerId) => {
    isLoading.value = true;
    try {
      const q = query(
        collection(db, "documents"),
        where("ownerId", "==", ownerId),
        orderBy("createdAt", "desc"),
      );
      const snap = await getDocs(q);
      documents.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.error("fetchDocuments error:", err.message, err.code);
      // If composite index is missing, try without orderBy
      try {
        const q = query(
          collection(db, "documents"),
          where("ownerId", "==", ownerId),
        );
        const snap = await getDocs(q);
        documents.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      } catch (fallbackErr) {
        console.error(
          "fetchDocuments fallback error:",
          fallbackErr.message,
          fallbackErr.code,
        );
      }
    } finally {
      isLoading.value = false;
    }
  };

  const getDocument = async (docId) => {
    const snap = await getDoc(doc(db, "documents", docId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  };

  const deleteDocument = async (docId) => {
    await deleteDoc(doc(db, "documents", docId));
    documents.value = documents.value.filter((d) => d.id !== docId);
  };

  return {
    documents,
    isLoading,
    uploadDocument,
    fetchDocuments,
    getDocument,
    deleteDocument,
  };
}
