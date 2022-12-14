import * as EmailValidator from 'email-validator';
import { Router } from 'express';
import _ from 'lodash';
import { AddAlertRequest, Alert, AlertDestination, GetAlertsResponse, PlanType, PLAN_LIMITS } from 'schema';
import { formatPhoneNumber } from '~/lib/phone';
import { catchErrors, requireSignedIn } from '~/utils/api';
import { createDocument, deleteDocument, fetchDocumentByID, findDocuments } from '~/utils/db';

const alertsRouter = Router();

alertsRouter.get(
  '/',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.user!.id;

    const alerts = await findDocuments<Alert>(`alerts`, [{ property: 'userID', condition: '==', value: userID }]);

    const response: GetAlertsResponse = {
      status: 'ok',
      alerts: _.orderBy(alerts, [(alert) => alert.symbol], ['asc']),
    };

    res.status(200).json(response);
  })
);

alertsRouter.post(
  '/',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.user!.id;

    const body = req.body as AddAlertRequest;

    const existingAlerts = await findDocuments('alerts', [{ property: 'userID', condition: '==', value: userID }]);

    if (existingAlerts.length >= PLAN_LIMITS.alerts.free && req.user!.plan?.type === PlanType.FREE) {
      return res.status(400).json({
        status: 'error',
        error:
          'Your account is currently on the free plan. If you would like to enable more price alerts at a time, please upgrade to the premium plan.',
        code: 'PLAN',
      });
    }

    if (existingAlerts.length >= PLAN_LIMITS.alerts.premium) {
      return res.status(400).json({
        status: 'error',
        error: 'At this time, we allow up to 20 alerts at once on the premium plan.',
        code: 'MAX_PLAN',
      });
    }

    if (body.destination === AlertDestination.SMS) {
      body.destinationValue = formatPhoneNumber(body.destinationValue);
    } else if (body.destination === AlertDestination.Email) {
      if (!EmailValidator.validate(body.destinationValue)) {
        throw new Error('Invalid email format');
      }
    }

    await createDocument<Alert>(`alerts`, {
      ...body,
      symbol: body.symbol.toUpperCase(),
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
    const userID = req.user!.id;

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
