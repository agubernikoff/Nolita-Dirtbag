import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData} from '@remix-run/react';
import {Suspense, useState, useEffect} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import {motion, useAnimate} from 'framer-motion';
import useMeasure from 'react-use-measure';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'Hydrogen | Home'}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context}) {
  const {storefront} = context;
  // const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
  // const featuredCollection = collections.nodes[0];
  // const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);
  const allProducts = storefront.query(GET_ALL_PRODUCTS);

  return defer({allProducts});
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  console.log(data.allProducts);
  return (
    <div className="home">
      {/* <FeaturedCollection collection={data.featuredCollection} /> */}
      <AllProducts products={data.allProducts} />
    </div>
  );
}

/**
 * @param {{
 *   collection: FeaturedCollectionFragment;
 * }}
 */
// function FeaturedCollection({collection}) {
//   if (!collection) return null;
//   const image = collection?.image;
//   return (
//     <Link
//       className="featured-collection"
//       to={`/collections/${collection.handle}`}
//     >
//       {image && (
//         <div className="featured-collection-image">
//           <Image data={image} sizes="100vw" />
//         </div>
//       )}
//       <h1>{collection.title}</h1>
//     </Link>
//   );
// }

/**
 * @param {{
 *   products: Promise<RecommendedProductsQuery>;
 * }}
 */
function AllProducts({products}) {
  return (
    <div className="recommended-products">
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {({products}) => (
            <div className="recommended-products-container">
              {products.edges.map((product) => (
                <Product product={product} key={product.node.id} />
              ))}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

function Product({product}) {
  const [size, setSize] = useState();
  const [expandDetails, setExpandDetails] = useState(false);

  function handleSizeButtonClick(e) {
    if (size === e.target.innerText) {
      setSize();
    } else {
      setSize(e.target.innerText);
    }
  }
  let [productDetails, {height}] = useMeasure();
  const [scope, animate] = useAnimate();

  function handleExpandDetailsClick() {
    setExpandDetails(!expandDetails);
  }

  useEffect(() => {
    animate(scope.current, {height: height + 10});
  }, [animate, scope, height]);
  console.log(product.node);

  const mappedSizeButtons = product.node.options.find((o) => o.name === 'Size')
    ? product.node.options
        .find((o) => o.name === 'Size')
        .values.map((sizeOption) => (
          <button
            key={sizeOption}
            onClick={(e) => handleSizeButtonClick(e)}
            className={
              size === sizeOption
                ? 'product-size-button size-button-selected'
                : 'product-size-button'
            }
          >
            {sizeOption}
          </button>
        ))
    : null;
  console.log(mappedSizeButtons);
  return (
    <div className="product-container">
      <div className="product-image-container">
        <img
          src={product.node.images.edges[0].node.url}
          sizes="(min-width: 45em) 20vw, 50vw"
          alt={product.node.title}
        />
      </div>
      <div className="product-interaction-container">
        <motion.div
          className="product-details"
          onClick={handleExpandDetailsClick}
          ref={scope}
        >
          <div className="product-details-container" ref={productDetails}>
            <p className="font-size">{product.node.title}</p>
            <Money
              data={product.node.priceRange.minVariantPrice}
              className="font-size"
            />
            <div>
              {expandDetails ? (
                <>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: product.node.descriptionHtml,
                    }}
                  ></div>
                  <p>Close Details</p>
                </>
              ) : (
                <p className="font-size-details">Details +</p>
              )}
            </div>
          </div>
        </motion.div>
        {product.node.images ? (
          <div className="product-cart-container">
            <div className="product-cart-sizing">
              <div className="product-cart-sizing-container">
                <p className="font-size">Size:</p>
                <div className="product-size-button-container">
                  {/* <button
                    onClick={(e) => handleSizeButtonClick(e)}
                    className={
                      size === 'S'
                        ? 'product-size-button size-button-selected'
                        : 'product-size-button'
                    }
                  >
                    S
                  </button>
                  <button
                    onClick={(e) => handleSizeButtonClick(e)}
                    className={
                      size === 'M'
                        ? 'product-size-button size-button-selected'
                        : 'product-size-button'
                    }
                  >
                    M
                  </button>
                  <button
                    onClick={(e) => handleSizeButtonClick(e)}
                    className={
                      size === 'L'
                        ? 'product-size-button size-button-selected'
                        : 'product-size-button'
                    }
                  >
                    L
                  </button>
                  <button
                    onClick={(e) => handleSizeButtonClick(e)}
                    className={
                      size === 'XL'
                        ? 'product-size-button size-button-selected'
                        : 'product-size-button'
                    }
                  >
                    XL
                  </button>
                  <button
                    onClick={(e) => handleSizeButtonClick(e)}
                    className={
                      size === 'XXL'
                        ? 'product-size-button size-button-selected'
                        : 'product-size-button'
                    }
                  >
                    XXL
                  </button> */}
                  {mappedSizeButtons}
                </div>
              </div>
            </div>
            <div className="product-cart-add-cart">
              <button>Add to bag</button>
            </div>
          </div>
        ) : (
          <div className="product-cart-soldout">
            <p>Sold Out</p>
          </div>
        )}

        {/* <h4>{product.node.title}</h4>
      <small>
        <Money data={product.node.priceRange.minVariantPrice} />
      </small> */}
      </div>
    </div>
  );
}

// const FEATURED_COLLECTION_QUERY = `#graphql
//   fragment FeaturedCollection on Collection {
//     id
//     title
//     image {
//       id
//       url
//       altText
//       width
//       height
//     }
//     handle
//   }
//   query FeaturedCollection($country: CountryCode, $language: LanguageCode)
//     @inContext(country: $country, language: $language) {
//     collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
//       nodes {
//         ...FeaturedCollection
//       }
//     }
//   }
// `;

// const RECOMMENDED_PRODUCTS_QUERY = `#graphql
//   fragment RecommendedProduct on Product {
//     id
//     title
//     handle
//     priceRange {
//       minVariantPrice {
//         amount
//         currencyCode
//       }
//     }
//     images(first: 1) {
//       nodes {
//         id
//         url
//         altText
//         width
//         height
//       }
//     }
//   }
//   query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
//     @inContext(country: $country, language: $language) {
//     products(first: 4, sortKey: UPDATED_AT, reverse: true) {
//       nodes {
//         ...RecommendedProduct
//       }
//     }
//   }
// `;

const GET_ALL_PRODUCTS = `query AllProducts($country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
  products(first: 100) {
    edges {
      node {
        id
        title
        handle
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        description
        descriptionHtml
        options {
          name,
          values
        }
        images(first: 1) {
          edges {
            node {
              id
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
}`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
