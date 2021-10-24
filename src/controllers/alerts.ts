import { AddAlertRequest, Alert, GetAlertsResponse } from '@zachweinberg/obsidian-schema';
import { Router } from 'express';
import { catchErrors, requireSignedIn } from '~/utils/api';
import { createDocument, deleteDocument, fetchDocumentByID, findDocuments } from '~/utils/db';

const alertsRouter = Router();

alertsRouter.get(
  '/',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.authContext!.uid;

    const alerts = await findDocuments<Alert>(`alerts`, [{ property: 'userID', condition: '==', value: userID }]);

    const response: GetAlertsResponse = {
      status: 'ok',
      alerts,
    };

    res.status(200).json(response);
  })
);

alertsRouter.post(
  '/',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.authContext!.uid;

    const body = req.body as AddAlertRequest;

    await createDocument<Alert>(`alerts`, {
      ...body,
      userID,
      createdAt: new Date(),
    });

    const response = {
      status: 'ok',
    };

    res.status(200).json(response);
  })
);

alertsRouter.delete(
  '/',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.authContext!.uid;

    const { alertID } = req.query as { alertID: string };

    if (!alertID) {
      return res.status(400).end();
    }

    const alert = await fetchDocumentByID<Alert>('alerts', alertID);

    if (alert.userID !== userID) {
      return res.status(401).end();
    }

    await deleteDocument(`alerts/${alertID}`);

    const response = {
      status: 'ok',
    };

    res.status(200).json(response);
  })
);

export default alertsRouter;
