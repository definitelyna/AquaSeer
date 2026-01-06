import { useState, useEffect } from "react";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/firebase";

export const useFetchData = (collectionName: string) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Create the query (order by timestamp usually makes sense for streams)
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, orderBy("datetime", "desc"));

    // 2. Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        // Map the docs to a clean array of objects
        const docsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          datetime: doc.data().datetime.toDate(),
          ...doc.data(),
        }));

        console.log(docsData);

        setData(docsData);
        setLoading(false);
      },
      (err) => {
        console.error("Stream error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    // 3. Cleanup listener on unmount
    return () => unsubscribe();
  }, [collectionName]);

  return { data, loading, error };
};
