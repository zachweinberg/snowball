import { Address } from '@zachweinberg/obsidian-schema';
import axios from 'axios';
import { getRedisKey, setRedisKey } from './redis';

// Use Google places and Estated to determine property estimate based on google place ID
// Cache Estated result for 4 days to prevent insane bill
export const getPropertyValueEstimateByGooglePlaceID = async (
  placeID: string,
  apt: string | null
): Promise<{ address: Address | null; estimate: number | null }> => {
  try {
    const redisKey = `propertyvaluation-${placeID}`;

    const googleResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?key=${process.env.GOOGLE_MAPS_API_KEY}&placeid=${placeID}&fields=address_components`
    );

    const addressComponents = googleResponse.data.result?.address_components ?? [];

    const state = addressComponents.find((component) => component.types.includes('administrative_area_level_1'));
    const streetNum = addressComponents.find((component) => component.types.includes('street_number'));
    const street = addressComponents.find((component) => component.types.includes('route'));
    const zip = addressComponents.find((component) => component.types.includes('postal_code'));
    const city = addressComponents.find((component) => component.types.includes('locality'));

    if (!state || !streetNum || !street || !city) {
      return { address: null, estimate: null };
    }

    const address: Address = {
      state: state.short_name ?? '',
      street: `${streetNum.short_name} ${street.short_name}`,
      zip: zip?.short_name ?? '',
      city: city.short_name ?? '',
    };

    if (apt) {
      address.apt = apt;
    }

    let addressString = `${address.street}, ${address.city} ${address.state}${address.zip ? `, ${address.zip}` : ''}`;

    if (address.apt) {
      addressString = `${address.street} APT ${address.apt}, ${address.city} ${address.state}${
        address.zip ? `, ${address.zip}` : ''
      }`;
    }

    const cachedEstimate = await getRedisKey(redisKey);
    const FOUR_DAYS = 345600;

    if (cachedEstimate) {
      console.log(cachedEstimate);
      return {
        address,
        estimate: JSON.parse(cachedEstimate),
      };
    }

    let estatedURL = `https://apis.estated.com/v4/property?token=${process.env.ESTATED_API_KEY}&combined_address=${addressString}`;

    const estatedResponse = await axios.get(estatedURL);

    if (!estatedResponse.data || !estatedResponse.data.data || !estatedResponse.data.data.valuation) {
      await setRedisKey(redisKey, null, FOUR_DAYS);
      return {
        address,
        estimate: null,
      };
    }

    const estimate = estatedResponse.data.data.valuation.value as number;

    await setRedisKey(redisKey, estimate, FOUR_DAYS);

    return {
      estimate,
      address,
    };
  } catch (err) {
    console.error(err);
    return { address: null, estimate: null };
  }
};
