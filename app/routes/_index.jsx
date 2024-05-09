import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData} from '@remix-run/react';
import {Suspense, useState, useEffect, useRef} from 'react';
import {Image, Money, CartForm} from '@shopify/hydrogen';
import {motion, useAnimate} from 'framer-motion';
import useMeasure from 'react-use-measure';
import right from '../assets/right-ar.png';
import left from '../assets/left-ar.png';

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    window
      .matchMedia('(max-width:700px)')
      .addEventListener('change', (e) => setIsMobile(e.matches));
    if (window.matchMedia('(max-width:700px)').matches) setIsMobile(true);
  }, []);
  return (
    <div
      className={
        isMobile ? 'recommended-products-mobile' : 'recommended-products'
      }
    >
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {({products}) => (
            <div
              className={
                isMobile
                  ? 'recommended-products-container-mobile'
                  : 'recommended-products-container'
              }
            >
              {products.edges
                .filter((p) => p.node.title !== 'FARTIER BUTT PLUG')
                .map((product) => (
                  <Product
                    product={product}
                    key={product.node.id}
                    isMobile={isMobile}
                  />
                ))}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

function Product({product, isMobile}) {
  const [size, setSize] = useState();
  const [expandDetails, setExpandDetails] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [imageSrc, setImageSrc] = useState(
    product.node.images.edges[imageIndex].node.url,
  );
  const [prevScrollL, setPrevScrollL] = useState(0);

  function handleSizeButtonClick(id) {
    if (size === id) {
      setSize();
    } else {
      setSize(id);
    }
  }
  let [productDetails, {height}] = useMeasure();
  const [scope, animate] = useAnimate();

  function handleExpandDetailsClick() {
    setExpandDetails(!expandDetails);
  }

  useEffect(() => {
    animate(scope.current, {height: height + 15});
  }, [animate, scope, height]);

  const mappedSizeButtons = product.node.variants
    ? product.node.variants.nodes.map((sizeOption) => {
        return sizeOption.availableForSale ? (
          <button
            key={sizeOption.title}
            onClick={() => handleSizeButtonClick(sizeOption.id)}
            className={
              size === sizeOption.id
                ? 'product-size-button size-button-selected'
                : 'product-size-button'
            }
          >
            {sizeOption.title === 'One Size' ? 'OS' : sizeOption.title}
          </button>
        ) : (
          <button
            key={sizeOption.title}
            disabled
            className={'product-size-button size-button-soldout'}
          >
            {sizeOption.title}
          </button>
        );
      })
    : null;

  function cycleImages(delta) {
    const imagesArray = product.node.images.edges.map((i) => i.node.url);
    const newIndex = imageIndex + delta;
    if (newIndex >= 0 && newIndex < imagesArray.length) {
      setImageIndex(imageIndex + delta);
      setImageSrc(imagesArray[imageIndex + delta]);
    }
    if (newIndex < 0) {
      setImageIndex(imagesArray.length - 1);
      setImageSrc(imagesArray[imagesArray.length - 1]);
    }
    if (newIndex >= imagesArray.length) {
      setImageIndex(0);
      setImageSrc(imagesArray[0]);
    }
  }
  const [isHovered, setIsHovered] = useState(false);

  function handleScroll(scrollWidth, scrollLeft) {
    const widthOfAnImage = scrollWidth / product.node.images.edges.length;
    const dividend = scrollLeft / widthOfAnImage;
    const rounded = parseFloat((scrollLeft / widthOfAnImage).toFixed(0));

    if (Math.abs(dividend - rounded) < 0.001) setImageIndex(rounded);
  }

  const mappedIndicators = product.node.images.edges.map((e, i) => (
    <div
      key={e.node.id}
      style={{
        background: i === imageIndex ? 'white' : 'grey',
        height: '10px',
        width: '10px',
      }}
    ></div>
  ));
  return (
    <div
      className={isMobile ? 'product-container-mobile' : 'product-container'}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isMobile ? (
        <div
          className="product-image-container-mobile"
          onScroll={(e) =>
            handleScroll(e.target.scrollWidth, e.target.scrollLeft)
          }
        >
          {product.node.images.edges.map((i) => (
            <div
              key={i.node.id}
              style={{color: 'white'}}
              className="mobile-image-container"
            >
              <img
                src={i.node.url}
                sizes="(min-width: 45em) 20vw, 50vw"
                alt={i.node.altText}
              />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div
            className="left-image-button-container"
            onClick={() => {
              cycleImages(-1);
            }}
          >
            {isHovered ? (
              <img className="left-arrow-product" src={left}></img>
            ) : null}{' '}
          </div>
          <div
            className="right-image-button-container"
            onClick={() => {
              cycleImages(1);
            }}
          >
            {isHovered ? (
              <img className="right-arrow-product" src={right}></img>
            ) : null}{' '}
          </div>
          <div className="product-image-container">
            <img
              src={imageSrc}
              sizes="(min-width: 45em) 20vw, 50vw"
              alt={product.node.title}
            />
          </div>
        </>
      )}
      <div
        className={
          isMobile
            ? 'product-interaction-container-mobile'
            : 'product-interaction-container'
        }
      >
        {isMobile ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: 'fit-content',
              gap: '.2rem',
            }}
          >
            {mappedIndicators}
          </div>
        ) : null}
        <motion.div
          className={isMobile ? 'product-details-mobile' : 'product-details'}
          onClick={handleExpandDetailsClick}
          ref={scope}
        >
          <div
            className={
              isMobile
                ? 'product-details-container-mobile'
                : 'product-details-container'
            }
            ref={productDetails}
          >
            <div
              style={
                isMobile
                  ? {
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }
                  : null
              }
            >
              <div>
                <p className="font-size">{product.node.title}</p>
                <Money
                  data={product.node.priceRange.minVariantPrice}
                  className="font-size"
                />
              </div>
              {expandDetails ? null : (
                <p
                  className={
                    isMobile ? 'font-size-details-mobile' : 'font-size-details'
                  }
                >
                  Details +
                </p>
              )}
            </div>
            <div>
              {expandDetails ? (
                <>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: product.node.descriptionHtml,
                    }}
                  ></div>
                  <p style={{fontSize: '.65rem', marginBottom: '2%'}}>
                    Close Details
                  </p>
                </>
              ) : null}
            </div>
          </div>
        </motion.div>
        {product.node.availableForSale ? (
          <div
            className={
              isMobile
                ? 'product-cart-container-mobile'
                : 'product-cart-container'
            }
          >
            <div
              className={
                isMobile ? 'product-cart-sizing-mobile' : 'product-cart-sizing'
              }
            >
              <div className="product-cart-sizing-container">
                {isMobile ? null : <p className="font-size">Size:</p>}
                <div className="product-size-button-container">
                  {mappedSizeButtons}
                </div>
              </div>
            </div>
            <AddToCartButton
              disabled={!size}
              onClick={() => {
                window.location.href = `${
                  window.location.href.includes('#')
                    ? window.location.href.replace('#x', '#bag')
                    : window.location.href + '#bag'
                }`;
              }}
              lines={
                size
                  ? [
                      {
                        merchandiseId: size,
                        quantity: 1,
                      },
                    ]
                  : []
              }
            />
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

function AddToCartButton({analytics, children, disabled, lines, onClick}) {
  const btn = useRef();
  useEffect(() => {
    if (btn.current && disabled)
      btn.current.parentNode.style.borderColor = 'grey';
    else btn.current.parentNode.style.borderColor = 'white';
  }, [disabled]);
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={(e) => {
              onClick();
              e.target.innerHTML = 'Added';
              e.target.parentNode.style.backgroundColor = 'grey';
              setTimeout(() => {
                e.target.innerHTML = 'Add to bag';
                e.target.parentNode.style.backgroundColor = 'black';
              }, 1500);
            }}
            disabled={disabled ?? fetcher.state !== 'idle'}
            className={disabled ? 'disabled-add-to-cart' : 'add-to-cart'}
            ref={btn}
          >
            Add to bag
          </button>
        </>
      )}
    </CartForm>
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
        availableForSale
        variants(first: 10) {
          nodes {
            id
          title
          availableForSale
          image {
            id
            url
            altText
            width
            height
          }
          }
        }
        images(first: 10) {
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
