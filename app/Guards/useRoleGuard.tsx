import { useRouter } from 'next/navigation';
import { auth, db } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const useRoleGuard = (requiredRole: "admin" | "user") => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/Authentication/Login');
        return;
      }
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const role = userDoc.exists() ? userDoc.data().role : null;
      if (role !== requiredRole) {
        setAuthorized(false);
        setLoading(false);
      } else {
        setAuthorized(true);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router, requiredRole]);

  return { loading, authorized };
};

export default useRoleGuard;