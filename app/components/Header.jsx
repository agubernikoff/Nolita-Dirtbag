import {Await, NavLink} from '@remix-run/react';
import {Info} from 'node_modules/property-information/lib/util/info';
import {Suspense, useState} from 'react';
import {useRootLoaderData} from '~/root';
import Meme_Sequence from '../../public/Meme_Sequence.mp4';
import image from '../../public/image.jpg';

/**
 * @param {HeaderProps}
 */
export function Header({header, isLoggedIn, cart}) {
  const {shop, menu} = header;
  return (
    <header className="header">
      <strong
        style={{
          color: 'black',
          textAlign: 'center',
          padding: '1rem',
          backgroundColor: 'white',
        }}
      >
        {shop.name}
      </strong>
      <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
    </header>
  );
}

/**
 * @param {{
 *   menu: HeaderProps['header']['menu'];
 *   primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
 *   viewport: Viewport;
 * }}
 */
export function HeaderMenu({menu, primaryDomainUrl, viewport}) {
  const {publicStoreDomain} = useRootLoaderData();
  const className = `header-menu-${viewport}`;

  function closeAside(event) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={closeAside}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className="header-menu-item"
            end
            key={item.id}
            onClick={closeAside}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>}
 */
function HeaderCtas({isLoggedIn, cart}) {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleMouseEnter = (section) => {
    setActiveDropdown(section);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };
  return (
    <div className="header-ctas-container">
      <div className="header-ctas">
        <HeaderMenuMobileToggle />
        <p
          className="header-section-hold"
          onMouseEnter={() => handleMouseEnter('instagram')}
        >
          Instagram
        </p>
        <p
          className="header-section-hold"
          onMouseEnter={() => handleMouseEnter('newsletter')}
        >
          Newsletter
        </p>
        <p
          className="header-section-hold"
          onMouseEnter={() => handleMouseEnter('information')}
        >
          Information
        </p>
        <p
          className="header-section-hold"
          onMouseEnter={() => handleMouseEnter('bag')}
        >
          Bag [0]
        </p>
      </div>
      {activeDropdown === 'instagram' && (
        <div className="dropdown-container" onMouseLeave={handleMouseLeave}>
          <div className="dropdown-content">
            <li>INSTAGRAM</li>
            <video
              width="auto"
              height="auto"
              style={{width: '100%'}}
              autoPlay
              loop
            >
              <source src={Meme_Sequence} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
      {activeDropdown === 'newsletter' && (
        <div className="dropdown-container" onMouseLeave={handleMouseLeave}>
          <div className="dropdown-content">
            <li>NEWSLETTER</li>
            <form className="newsletter-input-container">
              <input placeholder="Email Address" name="email"></input>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
      {activeDropdown === 'information' && (
        <div className="dropdown-container" onMouseLeave={handleMouseLeave}>
          <InformationTab />
        </div>
      )}
      {activeDropdown === 'bag' && (
        <div className="dropdown-container" onMouseLeave={handleMouseLeave}>
          <div className="dropdown-content">
            <p>bag Dropdown Content</p>
          </div>
        </div>
      )}
    </div>
  );
}
function InformationTab() {
  const [toDisplay, setToDisplay] = useState('Information');
  switch (toDisplay) {
    case 'Information':
      return <Information setToDisplay={setToDisplay} />;
    case 'Terms of Service':
      return <TermsOfService setToDisplay={setToDisplay} />;
    case 'Privacy Policy':
      return <PrivacyPolicy setToDisplay={setToDisplay} />;
    case 'Shipping and Returns':
      return <ShippingAndReturns setToDisplay={setToDisplay} />;
  }
}

function Information({setToDisplay}) {
  return (
    <div className="dropdown-content">
      <li>INFORMATION</li>
      <img
        style={{width: '100%', borderRadius: '0', marginBottom: '2%'}}
        src={image}
        alt="sick painting"
      />
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor
        sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua.
      </p>
      <li>SUPPORT</li>
      <div className="dropdown-info">
        <p onClick={(e) => setToDisplay(e.target.innerText)}>
          Terms of Service
        </p>
        <p onClick={(e) => setToDisplay(e.target.innerText)}>Privacy Policy</p>
        <p onClick={(e) => setToDisplay(e.target.innerText)}>
          Shipping and Returns
        </p>
      </div>
      <li>CONTACT</li>
      <p>team@nolitadirtbag.com</p>
      <li>CREDITS</li>
      <p>© Nolita Dirtbag 2024,</p>
      <p>All Rights Reserved</p>
      <div className="site-credit">
        <a
          href="https://www.swallstudios.com/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Site Credit
        </a>
      </div>
    </div>
  );
}
function TermsOfService({setToDisplay}) {
  return (
    <div className="dropdown-content">
      <button onClick={() => setToDisplay('Information')}>Back</button>
      <li>TERMS OF SERVICE</li>
    </div>
  );
}
function ShippingAndReturns({setToDisplay}) {
  return (
    <div className="dropdown-content">
      <button onClick={() => setToDisplay('Information')}>Back</button>
      <li>SHIPPING AND RETURNS</li>
    </div>
  );
}
function PrivacyPolicy({setToDisplay}) {
  return (
    <div className="dropdown-content">
      <button onClick={() => setToDisplay('Information')}>Back</button>
      <li>PRIVACY POLICY</li>
    </div>
  );
}
function HeaderMenuMobileToggle() {
  return (
    <a className="header-menu-mobile-toggle" href="#mobile-menu-aside">
      <h3>☰</h3>
    </a>
  );
}

function SearchToggle() {
  return <a href="#search-aside">Search</a>;
}

/**
 * @param {{count: number}}
 */
function CartBadge({count}) {
  return <a href="#cart-aside">Cart {count}</a>;
}

/**
 * @param {Pick<HeaderProps, 'cart'>}
 */
function CartToggle({cart}) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        {(cart) => {
          if (!cart) return <CartBadge count={0} />;
          return <CartBadge count={cart.totalQuantity || 0} />;
        }}
      </Await>
    </Suspense>
  );
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

/**
 * @param {{
 *   isActive: boolean;
 *   isPending: boolean;
 * }}
 */
function activeLinkStyle({isActive, isPending}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}

/** @typedef {Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn'>} HeaderProps */
/** @typedef {'desktop' | 'mobile'} Viewport */

/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('./Layout').LayoutProps} LayoutProps */
