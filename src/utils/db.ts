import { firebaseAdmin } from '~/lib/firebaseAdmin';

type WithID<T> = T & {
  id: string;
};

interface Query {
  property: string;
  condition: FirebaseFirestore.WhereFilterOp;
  value: any;
}

interface OrderBy {
  property: string;
  direction: 'asc' | 'desc';
}

const fetchDocumentSnapshot = async (collection: string, documentID: string) => {
  const doc = await firebaseAdmin().firestore().collection(collection).doc(documentID).get();

  if (!doc.exists) {
    throw new Error(`Document ${documentID} does not exist in ${collection} collection.`);
  }

  return doc;
};

const snapshotToType = <T extends object>(
  snapshot: FirebaseFirestore.DocumentSnapshot
): WithID<T> => {
  return {
    ...(snapshot.data() as T),
    id: snapshot.id,
  };
};

export const fetchDocument = async <T extends object>(
  collection: string,
  documentID: string
): Promise<WithID<T>> => {
  const doc = await fetchDocumentSnapshot(collection, documentID);
  return snapshotToType<T>(doc);
};

export const findDocuments = async <T extends object>(
  collection: string,
  queries?: Query[],
  orderBy?: OrderBy,
  limit?: number
): Promise<WithID<T>[]> => {
  let docRef: FirebaseFirestore.CollectionReference | FirebaseFirestore.Query = firebaseAdmin()
    .firestore()
    .collection(collection);

  if (Array.isArray(queries)) {
    for (const query of queries) {
      docRef = docRef.where(query.property, query.condition, query.value);
    }
  }

  if (orderBy) {
    docRef = docRef.orderBy(orderBy.property, orderBy.direction);
  }

  if (limit) {
    docRef = docRef.limit(limit);
  }

  const results = await docRef.get();

  if (results.empty) {
    return [];
  }

  return results.docs.map((doc) => snapshotToType<T>(doc));
};

export const createDocument = async <T>(
  collection: string,
  data: Partial<T>,
  docID?: string
): Promise<string> => {
  if (docID) {
    await firebaseAdmin().firestore().collection(collection).doc(docID).set(data, { merge: true });
    return docID;
  } else {
    const docRef = await firebaseAdmin().firestore().collection(collection).add(data);
    return docRef.id;
  }
};

export const updateDocument = async (
  collection: string,
  documentID: string,
  data: FirebaseFirestore.DocumentData
) => {
  return firebaseAdmin()
    .firestore()
    .collection(collection)
    .doc(documentID)
    .set(data, { merge: true });
};

export function deleteDocument(documentPath: string) {
  return firebaseAdmin().firestore().doc(documentPath).delete();
}
