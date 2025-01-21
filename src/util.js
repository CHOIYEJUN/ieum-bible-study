import {DBservice} from "./fireBase";
import {addDoc, collection, doc, setDoc} from "firebase/firestore";
import { getToday } from './util/DateUtil';

export async function CreateUserField(uid, email, username, belong) {
    const userDocRef = doc(collection(DBservice, "users"), uid);
    await setDoc(userDocRef, {
        uid: uid,
        email: email,
        username: username,
        belong: belong,
        createdAt: getToday(),
        startDay: "2025-02-02",
    });
}
