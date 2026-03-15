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
  updateDoc,
} from "firebase/firestore";
import { db } from "../services/firebase.js";

export function useClients() {
  const clients = ref([]);
  const isLoading = ref(false);

  const createClient = async (clientData, ownerId) => {
    const docRef = await addDoc(collection(db, "clients"), {
      ...clientData,
      ownerId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const newClient = {
      id: docRef.id,
      ...clientData,
      ownerId,
    };
    clients.value.unshift(newClient);
    return newClient;
  };

  const fetchClients = async (ownerId) => {
    isLoading.value = true;
    try {
      const q = query(
        collection(db, "clients"),
        where("ownerId", "==", ownerId),
      );
      const snap = await getDocs(q);
      clients.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      // Sort client-side to avoid needing another composite index
      clients.value.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(0);
        const bTime = b.createdAt?.toDate?.() || new Date(0);
        return bTime - aTime;
      });
    } catch (err) {
      console.error("fetchClients error:", err.message, err.code);
    } finally {
      isLoading.value = false;
    }
  };

  const getClient = async (clientId) => {
    const snap = await getDoc(doc(db, "clients", clientId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  };

  const updateClient = async (clientId, updates) => {
    await updateDoc(doc(db, "clients", clientId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    const idx = clients.value.findIndex((c) => c.id === clientId);
    if (idx !== -1) {
      clients.value[idx] = { ...clients.value[idx], ...updates };
    }
  };

  const deleteClient = async (clientId) => {
    await deleteDoc(doc(db, "clients", clientId));
    clients.value = clients.value.filter((c) => c.id !== clientId);
  };

  return {
    clients,
    isLoading,
    createClient,
    fetchClients,
    getClient,
    updateClient,
    deleteClient,
  };
}
