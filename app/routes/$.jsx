/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({request}) {
  throw new Response(
    `${
      new URL(request.url).pathname
    } Our shitty devs couldn't figure this one out. Please go home.`,
    {
      status: 404,
    },
  );
}

export default function CatchAllPage() {
  return null;
}

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
