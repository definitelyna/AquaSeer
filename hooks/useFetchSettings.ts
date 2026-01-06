import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { auth } from "../firebase";

export const useFetchSettings = () => {
  const [settings, setSettings] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const uid = auth.currentUser?.uid || "default";
    const docRef = doc(db, "user_settings", uid);

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          // If there are Firestore Timestamp fields, convert them here if needed
          setSettings({ id: docSnap.id, ...data });
        } else {
          setSettings(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error("useFetchSettings onSnapshot error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { settings, loading, error };
};
