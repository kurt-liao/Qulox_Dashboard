import { ref } from "vue";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../services/firebase.js";

function generateShortCode(length = 8) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function useTrackingLinks() {
  const links = ref([]);
  const isLoading = ref(false);

  const createLink = async (documentId, ownerId, clientName) => {
    const shortCode = generateShortCode();
    const docRef = await addDoc(collection(db, "tracking_links"), {
      documentId,
      ownerId,
      clientName,
      shortCode,
      isActive: true,
      createdAt: serverTimestamp(),
    });
    const newLink = {
      id: docRef.id,
      documentId,
      ownerId,
      clientName,
      shortCode,
      isActive: true,
    };
    links.value.unshift(newLink);
    return newLink;
  };

  const fetchLinksForDocument = async (documentId) => {
    isLoading.value = true;
    try {
      const q = query(
        collection(db, "tracking_links"),
        where("documentId", "==", documentId),
        orderBy("createdAt", "desc"),
      );
      const snap = await getDocs(q);
      links.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.error("fetchLinksForDocument error:", err.message, err.code);
      // Fallback without orderBy
      try {
        const q = query(
          collection(db, "tracking_links"),
          where("documentId", "==", documentId),
        );
        const snap = await getDocs(q);
        links.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      } catch (fallbackErr) {
        console.error(
          "fetchLinksForDocument fallback error:",
          fallbackErr.message,
          fallbackErr.code,
        );
      }
    } finally {
      isLoading.value = false;
    }
  };

  const deleteLink = async (linkId) => {
    await deleteDoc(doc(db, "tracking_links", linkId));
    links.value = links.value.filter((l) => l.id !== linkId);
  };

  const fetchAllLinksForOwner = async (ownerId) => {
    try {
      const q = query(
        collection(db, "tracking_links"),
        where("ownerId", "==", ownerId),
      );
      const snap = await getDocs(q);
      links.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.error("fetchAllLinksForOwner error:", err.message, err.code);
    }
  };

  const getViewerUrl = (shortCode) => {
    const viewerBase =
      window.location.hostname === "localhost"
        ? "http://localhost:5173"
        : "https://your-viewer-domain.com";
    return `${viewerBase}/v/${shortCode}`;
  };

  return {
    links,
    isLoading,
    createLink,
    fetchLinksForDocument,
    fetchAllLinksForOwner,
    deleteLink,
    getViewerUrl,
  };
}
