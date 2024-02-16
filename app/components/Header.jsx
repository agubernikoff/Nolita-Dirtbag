import {Await, NavLink, useLocation} from '@remix-run/react';
import {Info} from 'node_modules/property-information/lib/util/info';
import {Suspense, useState, useEffect} from 'react';
import {useRootLoaderData} from '~/root';
import Meme_Sequence from '../../public/Meme_Sequence.mp4';
import image from '../../public/image.jpg';
import {motion, AnimatePresence} from 'framer-motion';
import {CartMain} from './Cart.jsx';

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
  const loc = useLocation();
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleMouseEnter = (section) => {
    setActiveDropdown(section);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
    window.location.hash = '';
  };
  useEffect(() => {
    if (loc.hash.includes('#bag')) handleMouseEnter('bag');
  }, [loc.hash]);

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
          {/* {`Bag [${cart.lines.nodes.length}]`} */}
          <CartToggle cart={cart} />
        </p>
      </div>
      <AnimatePresence mode="popLayout">
        {activeDropdown && (
          <motion.div
            className="dropdown-container"
            onMouseLeave={handleMouseLeave}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.25}}
            key="ig"
          >
            {activeDropdown === 'instagram' && (
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
            )}
            {activeDropdown === 'newsletter' && (
              <div className="dropdown-content">
                <li>NEWSLETTER</li>
                <form className="newsletter-input-container">
                  <input placeholder="Email Address" name="email"></input>
                  <button type="submit">Submit</button>
                </form>
              </div>
            )}
            {activeDropdown === 'information' && <InformationTab />}
            {activeDropdown === 'bag' && (
              <div className="dropdown-content">
                <li>BAG</li>
                <Suspense fallback={<p>Loading cart ...</p>}>
                  <Await resolve={cart}>
                    {(cart) => {
                      return <CartMain cart={cart} layout="aside" />;
                    }}
                  </Await>
                </Suspense>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
function InformationTab() {
  const [toDisplay, setToDisplay] = useState('Information');
  return (
    <div className="dropdown-content-container">
      <AnimatePresence mode="wait" initial={false}>
        {toDisplay === 'Information' && (
          <motion.div
            className="dropdown-content"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.25}}
            key="info"
          >
            <Information setToDisplay={setToDisplay} />
          </motion.div>
        )}
        {toDisplay === 'Terms of Service' && (
          <motion.div
            className="dropdown-content"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.25}}
            key="tos"
          >
            <TermsOfService setToDisplay={setToDisplay} />
          </motion.div>
        )}
        {toDisplay === 'Privacy Policy' && (
          <motion.div
            className="dropdown-content"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.25}}
            key="pp"
          >
            <PrivacyPolicy setToDisplay={setToDisplay} />
          </motion.div>
        )}
        {toDisplay === 'Shipping and Returns' && (
          <motion.div
            className="dropdown-content"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.25}}
            key="sar"
          >
            <ShippingAndReturns setToDisplay={setToDisplay} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Information({setToDisplay}) {
  return (
    <>
      <div className="info-subsection-head" style={{marginBottom: '-1%'}}>
        <li>INFORMATION</li>
      </div>
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
    </>
  );
}
function TermsOfService({setToDisplay}) {
  return (
    <>
      <div className="info-subsection-head">
        <li>TERMS OF SERVICE</li>
        <button
          className="info-sub-button"
          onClick={() => setToDisplay('Information')}
        >
          Back
        </button>
      </div>
      <p>OVERVIEW</p>
      <br></br>
      <p>
        This website is operated by Nolita Dirtbag. Throughout the site, the
        terms “we”, “us” and “our” refer to Nolita Dirtbag. Nolita Dirtbag
        offers this website, including all information, tools and Services
        available from this site to you, the user, conditioned upon your
        acceptance of all terms, conditions, policies and notices stated here.
      </p>
      <br></br>
      <p>
        By visiting our site and/ or purchasing something from us, you engage in
        our “Service” and agree to be bound by the following terms and
        conditions (“Terms of Service”, “Terms”), including those additional
        terms and conditions and policies referenced herein and/or available by
        hyperlink. These Terms of Service apply to all users of the site,
        including without limitation users who are browsers, vendors, customers,
        merchants, and/ or contributors of content.
      </p>
      <br></br>
      <p>
        Please read these Terms of Service carefully before accessing or using
        our website. By accessing or using any part of the site, you agree to be
        bound by these Terms of Service. If you do not agree to all the terms
        and conditions of this agreement, then you may not access the website or
        use any Services. If these Terms of Service are considered an offer,
        acceptance is expressly limited to these Terms of Service.
      </p>
      <br></br>
      <p>
        Any new features or tools which are added to the current store shall
        also be subject to the Terms of Service. You can review the most current
        version of the Terms of Service at any time on this page. We reserve the
        right to update, change or replace any part of these Terms of Service by
        posting updates and/or changes to our website. It is your responsibility
        to check this page periodically for changes. Your continued use of or
        access to the website following the posting of any changes constitutes
        acceptance of those changes.
      </p>
      <br></br>
      <p>
        Our store is hosted on Shopify Inc. They provide us with the online
        e-commerce platform that allows us to sell our products and Services to
        you.
      </p>
      <br></br>
      <br></br>
      <p>SECTION 1 - ONLINE STORE TERMS</p>
      <br></br>
      <p>
        By agreeing to these Terms of Service, you represent that you are at
        least the age of majority in your state or province of residence, or
        that you are the age of majority in your state or province of residence
        and you have given us your consent to allow any of your minor dependents
        to use this site.
      </p>
      <br></br>
      <p>
        You may not use our products for any illegal or unauthorized purpose nor
        may you, in the use of the Service, violate any laws in your
        jurisdiction (including but not limited to copyright laws). You must not
        transmit any worms or viruses or any code of a destructive nature. A
        breach or violation of any of the Terms will result in an immediate
        termination of your Services.
      </p>
      <br></br>
      <br></br>
      <p>SECTION 2 - GENERAL CONDITIONS</p>
      <br></br>
      <p>
        We reserve the right to refuse Service to anyone for any reason at any
        time. You understand that your content (not including credit card
        information), may be transferred unencrypted and involve (a)
        transmissions over various networks; and (b) changes to conform and
        adapt to technical requirements of connecting networks or devices.
        Credit card information is always encrypted during transfer over
        networks.
      </p>
      <br></br>
      <p>
        You agree not to reproduce, duplicate, copy, sell, resell or exploit any
        portion of the Service, use of the Service, or access to the Service or
        any contact on the website through which the Service is provided,
        without express written permission by us. The headings used in this
        agreement are included for convenience only and will not limit or
        otherwise affect these Terms.
      </p>
      <br></br>
      <br></br>
      <p>SECTION 3 - ACCURACY, COMPLETENESS AND TIMELINESS OF INFORMATION</p>
      <br></br>
      <p>
        We are not responsible if information made available on this site is not
        accurate, complete or current. The material on this site is provided for
        general information only and should not be relied upon or used as the
        sole basis for making decisions without consulting primary, more
        accurate, more complete or more timely sources of information. Any
        reliance on the material on this site is at your own risk.
      </p>
      <br></br>
      <p>
        This site may contain certain historical information. Historical
        information, necessarily, is not current and is provided for your
        reference only. We reserve the right to modify the contents of this site
        at any time, but we have no obligation to update any information on our
        site. You agree that it is your responsibility to monitor changes to our
        site.
      </p>
      <br></br>
      <br></br>
      <p>SECTION 4 - MODIFICATIONS TO THE SERVICE AND PRICES</p>
      <br></br>
      <p>
        Prices for our products are subject to change without notice. We reserve
        the right at any time to modify or discontinue the Service (or any part
        or content thereof) without notice at any time. We shall not be liable
        to you or to any third-party for any modification, price change,
        suspension or discontinuance of the Service.
      </p>
      <br></br>
      <br></br>
      <p>SECTION 5 - PRODUCTS OR SERVICES (if applicable)</p>
      <br></br>
      <p>
        Certain products or Services may be available exclusively online through
        the website. These products or Services may have limited quantities and
        are subject to return or exchange only according to our Refund Policy
      </p>
      <br></br>
      <p>
        We have made every effort to display as accurately as possible the
        colors and images of our products that appear at the store. We cannot
        guarantee that your computer monitor's display of any color will be
        accurate.
      </p>
      <br></br>
      <p>
        We reserve the right, but are not obligated, to limit the sales of our
        products or Services to any person, geographic region or jurisdiction.
        We may exercise this right on a case-by-case basis. We reserve the right
        to limit the quantities of any products or Services that we offer. All
        descriptions of products or product pricing are subject to change at
        anytime without notice, at the sole discretion of us. We reserve the
        right to discontinue any product at any time. Any offer for any product
        or Service made on this site is void where prohibited.
      </p>
      <br></br>
      <p>
        We do not warrant that the quality of any products, Services,
        information, or other material purchased or obtained by you will meet
        your expectations, or that any errors in the Service will be corrected.
      </p>
      <br></br>
      <br></br>
      <p>SECTION 6 - ACCURACY OF BILLING AND ACCOUNT INFORMATION</p>
      <br></br>
      <p>
        We reserve the right to refuse any order you place with us. We may, in
        our sole discretion, limit or cancel quantities purchased per person,
        per household or per order. These restrictions may include orders placed
        by or under the same customer account, the same credit card, and/or
        orders that use the same billing and/or shipping address. In the event
        that we make a change to or cancel an order, we may attempt to notify
        you by contacting the e‑mail and/or billing address/phone number
        provided at the time the order was made. We reserve the right to limit
        or prohibit orders that, in our sole judgment, appear to be placed by
        dealers, resellers or distributors. You agree to provide current,
        complete and accurate purchase and account information for all purchases
        made at our store. You agree to promptly update your account and other
        information, including your email address and credit card numbers and
        expiration dates, so that we can complete your transactions and contact
        you as needed.
      </p>
      <br></br>
      <br></br>
      <p>SECTION 7 - OPTIONAL TOOLS</p>
      <br></br>
      <p>
        We may provide you with access to third-party tools over which we
        neither monitor nor have any control nor input.You acknowledge and agree
        that we provide access to such tools ”as is” and “as available” without
        any warranties, representations or conditions of any kind and without
        any endorsement. We shall have no liability whatsoever arising from or
        relating to your use of optional third-party tools.
      </p>
      <br></br>
      <p>
        Any use by you of the optional tools offered through the site is
        entirely at your own risk and discretion and you should ensure that you
        are familiar with and approve of the terms on which tools are provided
        by the relevant third-party provider(s).
      </p>
      <br></br>
      <p>
        We may also, in the future, offer new Services and/or features through
        the website (including the release of new tools and resources). Such new
        features and/or Services shall also be subject to these Terms of
        Service.
      </p>
      <br></br>
      <br></br>
      <p>SECTION 8 - THIRD-PARTY LINKS</p>
      <br></br>
      <p>
        Certain content, products and Services available via our Service may
        include materials from third-parties. Third-party links on this site may
        direct you to third-party websites that are not affiliated with us. We
        are not responsible for examining or evaluating the content or accuracy
        and we do not warrant and will not have any liability or responsibility
        for any third-party materials or websites, or for any other materials,
        products, or Services of third-parties.
      </p>
      <br></br>
      <p>
        We are not liable for any harm or damages related to the purchase or use
        of goods, Services, resources, content, or any other transactions made
        in connection with any third-party websites. Please review carefully the
        third-party's policies and practices and make sure you understand them
        before you engage in any transaction. Complaints, claims, concerns, or
        questions regarding third-party products should be directed to the
        third-party.
      </p>
      <br></br>
      <br></br>
      <p>SECTION 9 - USER COMMENTS, FEEDBACK AND OTHER SUBMISSIONS</p>
      <br></br>
      <p>
        If, at our request, you send certain specific submissions (for example
        contest entries) or without a request from us, you send creative ideas,
        suggestions, proposals, plans, or other materials, whether online, by
        email, by postal mail, or otherwise (collectively, 'comments'), you
        agree that we may, at any time, without restriction, edit, copy,
        publish, distribute, translate and otherwise use in any medium any
        comments that you forward to us. We are and shall be under no obligation
        (1) to maintain any comments in confidence; (2) to pay compensation for
        any comments; or (3) to respond to any comments.
      </p>
      <br></br>
      <p>
        We may, but have no obligation to, monitor, edit or remove content that
        we determine in our sole discretion to be unlawful, offensive,
        threatening, libelous, defamatory, pornographic, obscene or otherwise
        objectionable or violates any party’s intellectual property or these
        Terms of Service. You agree that your comments will not violate any
        right of any third-party, including copyright, trademark, privacy,
        personality or other personal or proprietary right. You further agree
        that your comments will not contain libelous or otherwise unlawful,
        abusive or obscene material, or contain any computer virus or other
        malware that could in any way affect the operation of the Service or any
        related website. You may not use a false e‑mail address, pretend to be
        someone other than yourself, or otherwise mislead us or third-parties as
        to the origin of any comments. You are solely responsible for any
        comments you make and their accuracy. We take no responsibility and
        assume no liability for any comments posted by you or any third-party.
      </p>
      <br></br>
      <br></br>
      <p>SECTION 10 - PERSONAL INFORMATION</p>
      <br></br>
      <p>
        Your submission of personal information through the store is governed by
        our Privacy Policy.
      </p>
      <br></br>
      <br></br>
      <p>SECTION 11 - ERRORS, INACCURACIES AND OMISSIONS</p>
      <br></br>
      <p>
        Occasionally there may be information on our site or in the Service that
        contains typographical errors, inaccuracies or omissions that may relate
        to product descriptions, pricing, promotions, offers, product shipping
        charges, transit times and availability. We reserve the right to correct
        any errors, inaccuracies or omissions, and to change or update
        information or cancel orders if any information in the Service or on any
        related website is inaccurate at any time without prior notice
        (including after you have submitted your order).
      </p>
      <br></br>
      <p>
        We undertake no obligation to update, amend or clarify information in
        the Service or on any related website, including without limitation,
        pricing information, except as required by law. No specified update or
        refresh date applied in the Service or on any related website, should be
        taken to indicate that all information in the Service or on any related
        website has been modified or updated.
      </p>
      <br></br>
      <br></br>
      <p>SECTION 12 - PROHIBITED USES</p>
      <br></br>
      <p>
        In addition to other prohibitions as set forth in the Terms of Service,
        you are prohibited from using the site or its content: (a) for any
        unlawful purpose; (b) to solicit others to perform or participate in any
        unlawful acts; (c) to violate any international, federal, provincial or
        state regulations, rules, laws, or local ordinances; (d) to infringe
        upon or violate our intellectual property rights or the intellectual
        property rights of others; (e) to harass, abuse, insult, harm, defame,
        slander, disparage, intimidate, or discriminate based on gender, sexual
        orientation, religion, ethnicity, race, age, national origin, or
        disability; (f) to submit false or misleading information; (g) to upload
        or transmit viruses or any other type of malicious code that will or may
        be used in any way that will affect the functionality or operation of
        the Service or of any related website, other websites, or the Internet;
        (h) to collect or track the personal information of others; (i) to spam,
        phish, pharm, pretext, spider, crawl, or scrape; (j) for any obscene or
        immoral purpose; or (k) to interfere with or circumvent the security
        features of the Service or any related website, other websites, or the
        Internet. We reserve the right to terminate your use of the Service or
        any related website for violating any of the prohibited uses.
      </p>
      <br></br>
      <br></br>
      <p>SECTION 13 - DISCLAIMER OF WARRANTIES; LIMITATION OF LIABILITY</p>
      <br></br>
      <p>
        We do not guarantee, represent or warrant that your use of our Service
        will be uninterrupted, timely, secure or error-free.
      </p>
      <br></br>
      <p>
        We do not warrant that the results that may be obtained from the use of
        the Service will be accurate or reliable.
      </p>
      <br></br>
      <p>
        You agree that from time to time we may remove the Service for
        indefinite periods of time or cancel the Service at any time, without
        notice to you.
      </p>
      <br></br>
      <p>
        You expressly agree that your use of, or inability to use, the Service
        is at your sole risk. The Service and all products and Services
        delivered to you through the Service are (except as expressly stated by
        us) provided 'as is' and 'as available' for your use, without any
        representation, warranties or conditions of any kind, either express or
        implied, including all implied warranties or conditions of
        merchantability, merchantable quality, fitness for a particular purpose,
        durability, title, and non-infringement.
      </p>
      <br></br>
      <p>
        In no case shall Nolita Dirtbag, our directors, officers, employees,
        affiliates, agents, contractors, interns, suppliers, Service providers
        or licensors be liable for any injury, loss, claim, or any direct,
        indirect, incidental, punitive, special, or consequential damages of any
        kind, including, without limitation lost profits, lost revenue, lost
        savings, loss of data, replacement costs, or any similar damages,
        whether based in contract, tort (including negligence), strict liability
        or otherwise, arising from your use of any of the Service or any
        products procured using the Service, or for any other claim related in
        any way to your use of the Service or any product, including, but not
        limited to, any errors or omissions in any content, or any loss or
        damage of any kind incurred as a result of the use of the Service or any
        content (or product) posted, transmitted, or otherwise made available
        via the Service, even if advised of their possibility. Because some
        states or jurisdictions do not allow the exclusion or the limitation of
        liability for consequential or incidental damages, in such states or
        jurisdictions, our liability shall be limited to the maximum extent
        permitted by law.
      </p>
      <br></br>
      <br></br>
      <p>SECTION 14 - INDEMNIFICATION</p>
      <br></br>
      <p>
        You agree to indemnify, defend and hold harmless Nolita Dirtbag and our
        parent, subsidiaries, affiliates, partners, officers, directors, agents,
        contractors, licensors, Service providers, subcontractors, suppliers,
        interns and employees, harmless from any claim or demand, including
        reasonable attorneys’ fees, made by any third-party due to or arising
        out of your breach of these Terms of Service or the documents they
        incorporate by reference, or your violation of any law or the rights of
        a third-party.
      </p>
      <br></br>
      <br></br>
      <p>SECTION 15 - SEVERABILITY</p>
      <br></br>
      <p>
        In the event that any provision of these Terms of Service is determined
        to be unlawful, void or unenforceable, such provision shall nonetheless
        be enforceable to the fullest extent permitted by applicable law, and
        the unenforceable portion shall be deemed to be severed from these Terms
        of Service, such determination shall not affect the validity and
        enforceability of any other remaining provisions.
      </p>
      <br></br>
      <br></br>
      <p>SECTION 16 - TERMINATION</p>
      <br></br>
      <p>
        The obligations and liabilities of the parties incurred prior to the
        termination date shall survive the termination of this agreement for all
        purposes. These Terms of Service are effective unless and until
        terminated by either you or us. You may terminate these Terms of Service
        at any time by notifying us that you no longer wish to use our Services,
        or when you cease using our site.
      </p>
      <br></br>
      <p>
        If in our sole judgment you fail, or we suspect that you have failed, to
        comply with any term or provision of these Terms of Service, we also may
        terminate this agreement at any time without notice and you will remain
        liable for all amounts due up to and including the date of termination;
        and/or accordingly may deny you access to our Services (or any part
        thereof).
      </p>
      <br></br>
      <br></br>
      <p>SECTION 17 - ENTIRE AGREEMENT</p>
      <br></br>
      <p>
        The failure of us to exercise or enforce any right or provision of these
        Terms of Service shall not constitute a waiver of such right or
        provision. These Terms of Service and any policies or operating rules
        posted by us on this site or in respect to the Service constitutes the
        entire agreement and understanding between you and us and governs your
        use of the Service, superseding any prior or contemporaneous agreements,
        communications and proposals, whether oral or written, between you and
        us (including, but not limited to, any prior versions of the Terms of
        Service).
      </p>
      <br></br>
      <p>
        Any ambiguities in the interpretation of these Terms of Service shall
        not be construed against the drafting party.
      </p>
      <br></br>
      <br></br>
      <p>SECTION 18 - GOVERNING LAW</p>
      <br></br>
      <p>
        These Terms of Service and any separate agreements whereby we provide
        you Services shall be governed by and construed in accordance with the
        laws of United States.
      </p>
      <br></br>
      <br></br>
      <p>SECTION 19 - CHANGES TO TERMS OF SERVICE</p>
      <br></br>
      <p>
        You can review the most current version of the Terms of Service at any
        time at this page. We reserve the right, at our sole discretion, to
        update, change or replace any part of these Terms of Service by posting
        updates and changes to our website. It is your responsibility to check
        our website periodically for changes. Your continued use of or access to
        our website or the Service following the posting of any changes to these
        Terms of Service constitutes acceptance of those changes.
      </p>
      <br></br>
      <br></br>
      <p>SECTION 20 - CONTACT INFORMATION</p>
      <br></br>
      <p>
        Questions about the Terms of Service should be sent to us at
        team@nolitadirtbag.com.
      </p>
    </>
  );
}
function ShippingAndReturns({setToDisplay}) {
  return (
    <>
      <div className="info-subsection-head">
        <li>SHIPPING AND RETURNS</li>
        <button
          className="info-sub-button"
          onClick={() => setToDisplay('Information')}
        >
          Back
        </button>
      </div>
      <p>SHIPPING</p>
      <br></br>
      <p>
        Packages ship within 7 business days from the date we receive the order.
        They will arrive 7-10 days later. Items are shipped directly from New
        York, USA using the US Postal Service.
      </p>
      <br></br>
      <br></br>
      <p>RETURNS</p>

      <br></br>
      <p>
        All sales are final unless you received the wrong size or product. If
        you have received the wrong size or product, please follow the
        instructions below for returns and refunds.
      </p>
      <br></br>
      <p>
        If you received the wrong size or product, please contact us within 7
        days of receiving your order to request a return and refund.To be
        eligible for a return and refund, your item must be unused and in the
        same condition that you received it, with all tags and packaging intact.
      </p>
      <br></br>
      <p>
        To initiate a return, please contact us at team@nolitadirtbag.com with
        your order number and a description of the problem. We will provide you
        with instructions on how to return the item to us.
      </p>
      <br></br>
      <p>
        You will be responsible for shipping the item back to us, unless we made
        an error in sending you the wrong size or product.
      </p>
      <br></br>
      <p>
        Once we receive your return, we will inspect it and notify you of the
        approval or rejection of your refund. If your refund is approved, we
        will issue a refund to your original payment method within 14 days.
      </p>
      <br></br>
      <p>
        If you have any questions or concerns about our refund policy, please
        contact us at team@nolitadirtbag.com.
      </p>
    </>
  );
}
function PrivacyPolicy({setToDisplay}) {
  return (
    <>
      <div className="info-subsection-head">
        <li>PRIVACY POLICY</li>
        <button
          className="info-sub-button"
          onClick={() => setToDisplay('Information')}
        >
          Back
        </button>
      </div>
      <p>
        We collect certain information about your device, your interaction with
        the Site, and information necessary to process your purchases. We may
        also collect additional information if you contact us for customer
        support. In this Privacy Policy, we refer to any information about an
        identifiable individual (including the information below) as “Personal
        Information”. See the list below for more information about what
        Personal Information we collect and why.
      </p>
      <br></br>
      <br></br>
      <p>DEVICE INFORMATION</p>
      <br></br>
      <p>
        Purpose of collection: to load the Site accurately for you, and to
        perform analytics on Site usage to optimize our Site.
      </p>
      <br></br>
      <p>
        Source of collection: Collected automatically when you access our Site
        using cookies, log files, web beacons, tags, or pixels.
      </p>
      <br></br>
      <p>
        Disclosure for a business purpose: shared with our processor Shopify.
        Personal Information collected: version of web browser, IP address, time
        zone, cookie information, what sites or products you view, search terms,
        and how you interact with the Site.
      </p>
      <br></br>
      <br></br>
      <p>ORDER INFORMATION</p>
      <br></br>
      <p>
        Purpose of collection: to provide products or services to you to fulfill
        our contract, to process your payment information, arrange for shipping,
        and provide you with invoices and/or order confirmations, communicate
        with you, screen our orders for potential risk or fraud, and when in
        line with the preferences you have shared with us, provide you with
        information or advertising relating to our products or services. Source
        of collection: collected from you. Disclosure for a business purpose:
        shared with our processor Shopify. Personal Information collected: name,
        billing address, shipping address, payment information (including credit
        card numbers, email address, and phone numbers.
      </p>
      <br></br>
      <br></br>
      <p>MINORS</p>
      <br></br>
      <p>
        The Site is not intended for individuals under the age of 18. We do not
        intentionally collect Personal Information from children. If you are the
        parent or guardian and believe your child has provided us with Personal
        Information, please contact us at the address above to request deletion.
        Sharing Personal Information
      </p>
      <br></br>
      <p>
        We share your Personal Information with service providers to help us
        provide our services and fulfill our contracts with you, as described
        above. We use Shopify to power our online store. You can read more about
        how Shopify uses your Personal Information here:
        https://www.shopify.com/legal/privacy.
      </p>
      <br></br>
      <p>
        We may share your Personal Information to comply with applicable laws
        and regulations, to respond to a subpoena, search warrant or other
        lawful request for information we receive, or to otherwise protect our
        rights.
      </p>
      <br></br>
      <br></br>
      <p>USING PERSONAL INFORMATION</p>
      <br></br>
      <p>
        We use your personal Information to provide our services to you, which
        includes: offering products for sale, processing payments, shipping and
        fulfillment of your order, and keeping you up to date on new products,
        services, and offers. Lawful basis Pursuant to the General Data
        Protection Regulation (“GDPR”), if you are a resident of the European
        Economic Area (“EEA”), we process your personal information under the
        following lawful bases: Your consent; The performance of the contract
        between you and the Site; Compliance with our legal obligations; To
        protect your vital interests; To perform a task carried out in the
        public interest; For our legitimate interests, which do not override
        your fundamental rights and freedoms.
      </p>
      <br></br>
      <br></br>
      <p>RETENTION</p>
      <br></br>
      <p>
        When you place an order through the Site, we will retain your Personal
        Information for our records unless and until you ask us to erase this
        information. For more information on your right of erasure, please see
        the ‘Your rights’ section below.
      </p>
      <br></br>
      <br></br>
      <p>AUTOMATIC DECISION MAKING</p>
      <br></br>
      <p>
        If you are a resident of the EEA, you have the right to object to
        processing based solely on automated decision-making (which includes
        profiling), when that decision-making has a legal effect on you or
        otherwise significantly affects you.
      </p>
      <br></br>
      <p>
        We do engage in fully automated decision-making that has a legal or
        otherwise significant effect using customer data.
      </p>
      <br></br>
      <p>
        Our processor Shopify uses limited automated decision-making to prevent
        fraud that does not have a legal or otherwise significant effect on you.
        Services that include elements of automated decision-making include:
      </p>
      <br></br>
      <p>
        Temporary blacklist of IP addresses associated with repeated failed
        transactions. This blacklist persists for a small number of hours.
        Temporary blacklist of credit cards associated with blacklisted IP
        addresses. This blacklist persists for a small number of days.
      </p>
      <br></br>
      <br></br>
      <p>COOKIES</p>
      <br></br>
      <p>
        A cookie is a small amount of information that’s downloaded to your
        computer or device when you visit our Site. We use a number of different
        cookies, including functional, performance, advertising, and social
        media or content cookies. Cookies make your browsing experience better
        by allowing the website to remember your actions and preferences (such
        as login and region selection). This means you don’t have to re-enter
        this information each time you return to the site or browse from one
        page to another. Cookies also provide information on how people use the
        website, for instance whether it’s their first time visiting or if they
        are a frequent visitor.
      </p>
      <br></br>
      <p>
        The length of time that a cookie remains on your computer or mobile
        device depends on whether it is a “persistent” or “session” cookie.
        Session cookies last until you stop browsing and persistent cookies last
        until they expire or are deleted. Most of the cookies we use are
        persistent and will expire between 30 minutes and two years from the
        date they are downloaded to your device. You can control and manage
        cookies in various ways. Please keep in mind that removing or blocking
        cookies can negatively impact your user experience and parts of our
        website may no longer be fully accessible. Most browsers automatically
        accept cookies, but you can choose whether or not to accept cookies
        through your browser controls, often found in your browser’s “Tools” or
        “Preferences” menu. For more information on how to modify your browser
        settings or how to block, manage or filter cookies can be found in your
        browser’s help file or through such sites as: www.allaboutcookies.org.
        Additionally, please note that blocking cookies may not completely
        prevent how we share information with third parties such as our
        advertising partners. To exercise your rights or opt-out of certain uses
        of your information by these parties, please follow the instructions in
        the “Behavioural Advertising” section above.
      </p>
      <br></br>
      <br></br>
      <p>DO NOT TRACK</p>
      <br></br>
      <p>
        Please note that because there is no consistent industry understanding
        of how to respond to “Do Not Track” signals, we do not alter our data
        collection and usage practices when we detect such a signal from your
        browser.
      </p>
      <br></br>
      <br></br>
      <p>CHANGES</p>
      <br></br>
      <p>
        We may update this Privacy Policy from time to time in order to reflect,
        for example, changes to our practices or for other operational, legal,
        or regulatory reasons.
      </p>
      <br></br>
      <br></br>
      <p>COMPLAINTS</p>
      <br></br>
      <p>
        As noted above, if you would like to make a complaint, please contact us
        by e-mail or by mail using the details provided under “Contact” above.
        If you are not satisfied with our response to your complaint, you have
        the right to lodge your complaint with the relevant data protection
        authority. You can contact your local data protection authority, or our
        supervisory authority here: team@nolitadirtbag.com
      </p>
      <br></br>
      <p>Last updated: May 24th, 2023</p>
    </>
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
  return <a className="bag-header-link">Bag [{count}]</a>;
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
