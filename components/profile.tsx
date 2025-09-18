import React, { useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const Profile = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserInfo(userDoc.data());
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading profile...</div>;
  if (!userInfo) return <div>No profile found.</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Profile</h2>
      <p><strong>Username:</strong> {userInfo.username}</p>
      <p><strong>Email:</strong> {userInfo.email}</p>
      <p><strong>Role:</strong> {userInfo.role}</p>
    </div>
  );
};

export default Profile;