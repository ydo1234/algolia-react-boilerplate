import { useState } from 'react';

// React Router
import { Link } from 'react-router-dom';

// Recoil Header State
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { motion } from 'framer-motion';

// eslint-disable-next-line import/order
import { queryAtom } from '@/config/searchboxConfig';

// Import logo URL for header
import logoMobile from '@/assets/logo/LogoMobile.webp';

import { shouldHaveOpenFederatedSearch } from '@/config/federatedConfig';

// Import framer motion
import { AnimatePresence } from 'framer-motion';

// Import SearchBox
// eslint-disable-next-line import/order
import CustomSearchBox from '@/components/searchbox/SearchBox';
import CustomVoiceSearchComponent from '@/components/voicesearch/VoiceSearch';

import Navigation from './Navigation';

// Custom hook to prevent body from scrolling
import { clickHamburger } from '@/config/cartFunctions';
import { shouldHaveVoiceSearch } from '@/config/featuresConfig';
import usePreventScrolling from '@/hooks/usePreventScrolling';

const HeaderMobile = ({ mobile, tablet }) => {
  // Import configuration from Recoil
  const setQueryState = useSetRecoilState(queryAtom);
  const federated = useSetRecoilState(shouldHaveOpenFederatedSearch);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const displayVoiceSearch = useRecoilValue(shouldHaveVoiceSearch);

  const hamburger = useSetRecoilState(clickHamburger);

  // Prevent body from scrolling when panel is open
  usePreventScrolling(isMenuOpen);

  return (
    <div className="container container-mobile">
      <div className="container__header-top">
        {/* Hamburger button to open or close the menu dropdown */}
        <div
          className={`${
            isMenuOpen ? 'hamburger-active' : 'hamburger-inactive'
          } hamburger`}
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
          }}
        >
          <span ref={hamburger} className="hamburger__line"></span>
          <span className="hamburger__line"></span>
          <span className="hamburger__line"></span>
        </div>
        {/* Logo, which returns to the homepage on click */}
        <div className="container__header-top__logo">
          <Link
            to="/"
            aria-label="Back to homepage"
            onClick={() => {
              setQueryState('');
              federated(false);
            }}
          >
            <img src={logoMobile} alt="" width="200" />
          </Link>
        </div>
        {/* For a search box Simple center */}
        <div className="container__header-top__title">
          <h1>Demo BoilerPlate</h1>
        </div>
      </div>

      <div className="searchbox-container searchbox-container-mobile">
        <CustomSearchBox />
        {/* Display voicesearch if the  displayVoiceSearch config is set to true */}
        {displayVoiceSearch && <CustomVoiceSearchComponent />}
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <div
            className="container-mobile__navigation-wp"
            onClick={() => setIsMenuOpen(false)}
          >
            <CategoriesMobile
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              mobile={mobile}
              tablet={tablet}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CategoriesMobile = ({ isMenuOpen, setIsMenuOpen, mobile, tablet }) => {
  return (
    <motion.div
      className="container-mobile__navList"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -200 }}
    >
      <Navigation
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        mobile={mobile}
        tablet={tablet}
      />
    </motion.div>
  );
};

export default HeaderMobile;
