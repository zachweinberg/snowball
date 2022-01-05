import { Address } from '@zachweinberg/obsidian-schema';
import axios from 'axios';
import { Router } from 'express';
import { catchErrors, requireSignedIn } from '~/utils/api';

const googleRouter = Router();

export interface ParsedAddress {
  street: string;
  streetNum: string;
  state: string;
  zip: string;
  city: string;
  unitNum?: string;
}

googleRouter.get(
  '/places',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const { placeID, apt } = req.query as { placeID: string; apt: string };

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?key=${process.env.GOOGLE_MAPS_API_KEY}&placeid=${placeID}&fields=address_components`
    );

    const addressComponents = response.data.result?.address_components ?? [];

    const state = addressComponents.find((component) => component.types.includes('administrative_area_level_1'));
    const streetNum = addressComponents.find((component) => component.types.includes('street_number'));
    const street = addressComponents.find((component) => component.types.includes('route'));
    const zip = addressComponents.find((component) => component.types.includes('postal_code'));
    const city = addressComponents.find((component) => component.types.includes('locality'));

    const address: Address = {
      state: state?.short_name ?? '',
      street: `${streetNum.short_name ?? ''} ${street.short_name ?? ''}`,
      zip: zip?.short_name ?? '',
      city: city?.short_name ?? '',
    };

    if (apt && apt !== '') {
      address.apt = apt;
    }

    res.status(200).send({ status: 'ok', address });
  })
);

export default googleRouter;
