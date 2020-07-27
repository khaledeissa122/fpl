import { db } from "../firebase"


export const addCollection = (collectionName,item) => {
    return db.collection(collectionName).add(item);
}
export const setCollection = (collectionName,docName,item) => {
  return db.collection(collectionName).doc(docName).set(item);
}
export const UpdateCollection = (collectionName,doc,payload) => {
    return db.collection(collectionName).doc(doc).update(payload);
}

export const getCollection = (collectionName) => {
    return db.collection(collectionName).get();
}

export const getCollectionwithid = (collectionName) => {
    return db.collection(collectionName);
}


export const deleteCollection = (collectionName,documentRef) => {
    return db.collection(collectionName).doc(documentRef).delete();
}
