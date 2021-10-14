import { firebaseAdmin } from '~/lib/firebaseAdmin';
import { logSentryError } from '~/lib/sentry';

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

const normalizeTimestamps = <T extends object>(value: T): T =>
  Object.keys(value).reduce((final, key) => {
    const finalValue =
      value[key] instanceof firebaseAdmin().firestore.Timestamp
        ? value[key].toDate()
        : value[key] !== null && typeof value[key] === 'object' && !Array.isArray(value[key])
        ? normalizeTimestamps(value[key])
        : value[key];
    return {
      ...final,
      [key]: finalValue,
    };
  }, {} as T);

const snapshotToType = <T extends object>(snapshot: FirebaseFirestore.DocumentSnapshot): WithID<T> => {
  return {
    ...normalizeTimestamps<T>(snapshot.data() as T),
    id: snapshot.id,
  };
};

export const fetchDocument = async <T extends object>(collection: string, documentID: string): Promise<WithID<T>> => {
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

export const createDocument = async <T>(collection: string, data: Partial<T>, docID?: string): Promise<string> => {
  if (docID) {
    await firebaseAdmin().firestore().collection(collection).doc(docID).set(data, { merge: true });
    return docID;
  } else {
    const docRef = await firebaseAdmin().firestore().collection(collection).add(data);
    return docRef.id;
  }
};

export const updateDocument = async (collection: string, documentID: string, data: FirebaseFirestore.DocumentData) => {
  return firebaseAdmin().firestore().collection(collection).doc(documentID).set(data, { merge: true });
};

export const deleteDocument = (documentPath: string) => {
  return firebaseAdmin().firestore().doc(documentPath).delete();
};

export const deleteCollection = (collectionPath: string) => {
  const batchSize = 100;
  const collectionRef = firebaseAdmin().firestore().collection(collectionPath);
  const query = collectionRef.orderBy('__name__').limit(batchSize);
  return deleteQueryBatch(collectionPath, query, batchSize);
};

const deleteQueryBatch = async (collectionPath: string, query: FirebaseFirestore.Query, batchSize: number) => {
  try {
    const snapshot = await query.get();

    // When there are no documents left, we are done
    if (snapshot.size === 0) {
      return;
    }

    // Delete documents in a batch
    const batch = firebaseAdmin().firestore().batch();

    console.log(`Deleting ${snapshot.size} ${collectionPath} documents`);

    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    await new Promise((resolve) => process.nextTick(resolve));

    await deleteQueryBatch(collectionPath, query, batchSize);
  } catch (err) {
    console.error(err);
    logSentryError(err);
  }

  return;
};
