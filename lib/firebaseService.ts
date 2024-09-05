import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const getColleges = async () => {
    const querySnapshot = await getDocs(collection(db, "colleges"));
    const colleges: { id: string; name: string; regex: string; }[] = [];
    querySnapshot.forEach((doc) => {
    colleges.push({ id: doc.id, name: doc.data().name, regex: doc.data().collegeEmailRegex
    });
    });
    return colleges;
}


