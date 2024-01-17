import {Await, NavLink} from '@remix-run/react';
import {Suspense, useState} from 'react';
import {useRootLoaderData} from '~/root';

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
          padding: '15px',
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
        <div
          className="header-section-hold"
          onMouseEnter={() => handleMouseEnter('instagram')}
          onMouseLeave={handleMouseLeave}
        >
          <p>Instagram</p>
        </div>
        <div
          className="header-section-hold"
          onMouseEnter={() => handleMouseEnter('newsletter')}
          onMouseLeave={handleMouseLeave}
        >
          <p>Newsletter</p>
        </div>
        <div
          className="header-section-hold"
          onMouseEnter={() => handleMouseEnter('information')}
          onMouseLeave={handleMouseLeave}
        >
          <p>Information</p>
        </div>
        <div
          className="header-section-hold"
          onMouseEnter={() => handleMouseEnter('bag')}
          onMouseLeave={handleMouseLeave}
        >
          <p>Bag [0]</p>
        </div>
      </div>
      {activeDropdown === 'instagram' && (
        <div className="dropdown-content">
          <p>Dropdown Content</p>
        </div>
      )}
      {activeDropdown === 'newsletter' && (
        <div className="dropdown-content">
          <p>newsletter Dropdown Content</p>
        </div>
      )}
      {activeDropdown === 'information' && (
        <div className="dropdown-content">
          <p>info Dropdown Content</p>
        </div>
      )}
      {activeDropdown === 'bag' && (
        <div className="dropdown-content">
          <p>bag Dropdown Content</p>
        </div>
      )}
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
