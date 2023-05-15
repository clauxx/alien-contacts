import z from 'zod';

const BASE_URL = 'https://random-data-api.com/api/v2';

export const address = z.object({
  city: z.string(),
  street_name: z.string(),
  street_address: z.string(),
  zip_code: z.string(),
  state: z.string(),
  country: z.string(),
  coordinates: z.object({ lat: z.number(), lng: z.number() }),
});

export const employment = z.object({
  title: z.string(),
  key_skill: z.string(),
});

export const subscription = z.object({
  plan: z.string(),
  status: z.string(),
  payment_method: z.string(),
  term: z.string(),
});

export const credit_card = z.object({ cc_number: z.string() });

export const user = z.object({
  id: z.number(),
  uid: z.string(),
  password: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  username: z.string(),
  email: z.string(),
  avatar: z.string(),
  gender: z.string(),
  phone_number: z.string(),
  social_insurance_number: z.string(),
  date_of_birth: z.string(),
  employment,
  address,
  credit_card,
  subscription,
});

export const users = z.array(user);

export type User = z.infer<typeof user>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const log = async <T>(res: T) => {
  console.log(JSON.stringify(res, null, 2));
  return res;
};

export const Api = {
  posts:
    ({ limit = 10 }) =>
    async () => {
      const url = BASE_URL + '/users' + `?size=${limit}`;
      return fetch(url)
        .then((res) => res.json())
        .then(users.parse);
    },
};
