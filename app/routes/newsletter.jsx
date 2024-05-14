import {json, redirect} from '@shopify/remix-oxygen';
import {
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
} from '@remix-run/react';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'Profile'}];
};

export async function action({request, context}) {
  const {session, storefront} = context;

  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  const form = await request.formData();
  //   const customerAccessToken = await session.get('customerAccessToken');
  //   if (!customerAccessToken) {
  //     return json({error: 'Unauthorized'}, {status: 401});
  //   }

  // update customer and possibly password

  try {
    const customer = {};
    const validInputKeys = ['email'];
    for (const [key, value] of form.entries()) {
      if (!validInputKeys.includes(key)) {
        continue;
      }
      if (key === 'acceptsMarketing') {
        customer.acceptsMarketing = value === 'on';
      }
      if (typeof value === 'string' && value.length) {
        customer[key] = value;
      }
    }

    // update customer and possibly password
    const created = await storefront.mutate(CUSTOMER_CREATE_QUERY, {
      variables: {
        input: {
          email: customer.email,
          acceptsMarketing: true,
          password: 'a;sdlkfja;ldskfj',
        },
      },
    });
    // check for mutation errors
    if (created.customerCreate?.customerUserErrors?.length) {
      return json(
        {error: created.customerCreate?.customerUserErrors[0]},
        {status: 400},
      );
    }

    // update session with the updated access token
    // if (updated.customerUpdate?.customerAccessToken?.accessToken) {
    //   session.set(
    //     'customerAccessToken',
    //     updated.customerUpdate?.customerAccessToken,
    //   );
    // }

    return json(
      {error: null, customer: created.customerCreate?.customer},
      {
        headers: {
          'Set-Cookie': await session.commit(),
        },
      },
    );
  } catch (error) {
    return json({error: error.message, customer: null}, {status: 400});
  }
}

const CUSTOMER_CREATE_QUERY = `#graphql
    mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        email
        acceptsMarketing
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;
