// This is the homepage, which you see when you first visit the site.
// By default it contains some banners and carousels

import {
  TrendingItems,
} from '@algolia/recommend-react';
import algoliarecommend from '@algolia/recommend';

// Algolia search client
import { searchClientCreds, mainIndex } from '@/config/algoliaEnvConfig';

import { lazy, Suspense, useRef, useEffect } from 'react';

import Loader from '@/components/loader/Loader';

// framer-motion
import { AnimatePresence, motion } from 'framer-motion';

import { framerMotionPage } from '@/config/animationConfig';

// recoil import
import { useRecoilValue } from 'recoil';

// Import screenShot/ images for the homepage
import homepage_1 from '../assets/homepage/homepage_1.png';
import homepage_2 from '../assets/homepage/homepage_2.png';

import usePreventScrolling from '@/hooks/usePreventScrolling';

// components import
const CustomHomeBanners = lazy(() =>
  import('@/components/banners/HomeBanners')
);
const FederatedSearch = lazy(() =>
  import('@/components/federatedSearch/FederatedSearch')
);
const HomeCarousel = lazy(() => import('@/components/carousels/HomeCarousel'));
import RelatedItem from '@/components/recommend/RelatedProducts';
import { HorizontalSlider } from '@algolia/ui-components-horizontal-slider-react';


// should carousel be shown or not and config for carousel
import { carouselConfig } from '@/config/carouselConfig';

//  should federated search be shown or not
import {
  shouldHaveFederatedSearch,
  shouldHaveCarousels,
  shouldHaveTrendingProducts,
} from '@/config/featuresConfig';

import { shouldHaveOpenFederatedSearch } from '@/config/federatedConfig';

const HomePage = ({ setIsMounted }) => {
  // Get the main index
  const index = useRecoilValue(mainIndex);

  // Boolean value which determines if federated search is shown or not, default is false
  const isFederated = useRecoilValue(shouldHaveFederatedSearch);
  const isCarousel = useRecoilValue(shouldHaveCarousels);
  const isFederatedOpen = useRecoilValue(shouldHaveOpenFederatedSearch);
  const HomePage = useRef(false);
  const shouldHaveTrendingProductsValue = useRecoilValue(
    shouldHaveTrendingProducts
  );

  const recommendClient = algoliarecommend(
    searchClientCreds.appID,
    searchClientCreds.APIKey
  );

  useEffect(() => {
    HomePage.current = true;
    setIsMounted(HomePage.current);
    return () => {
      HomePage.current = false;
      setIsMounted(HomePage.current);
    };
  }, []);

  // Prevent body from scrolling when panel is open
  // usePreventScrolling(isFederatedOpen);

  return (
    // Framer motion wrapper
    <motion.div
      className="homepage"
      // initial state
      initial={framerMotionPage.initial}
      // actual animation
      animate={framerMotionPage.animate}
      // everything the animation needs to function
      variants={framerMotionPage}
      // what to do when unmounted
      exit={framerMotionPage.exit}
      // duration, smoothness etc.
      transition={framerMotionPage.transition}
      ref={HomePage}
    >
      {isFederated && isFederatedOpen && (
        <AnimatePresence>
          {/* Loads federated search if isFederated is true */}
          <Suspense fallback={<Loader />}>
            <FederatedSearch />
          </Suspense>
        </AnimatePresence>
      )}

      {/* Load custom banners */}
      <Suspense fallback={<Loader />}>
        <CustomHomeBanners />
      </Suspense>

      {isCarousel &&
        carouselConfig.map((carousel, i) => (
          <Suspense key={i} fallback={<Loader />}>
            <HomeCarousel context={carousel.context} title={carousel.title} />
          </Suspense>
        ))}

      {/* Render Recommend component - Trending Products */}
      <div className="recommend">
        {shouldHaveTrendingProductsValue && (
          <div>
            <h3>Trending Products</h3>
            <TrendingItems
              recommendClient={recommendClient}
              indexName={index}
              itemComponent={RelatedItem}
              maxRecommendations={5}
              view={HorizontalSlider}
            />
          </div>
        )}
      </div>

      {homepage_1 ? <img src={homepage_1} alt="" /> : null}

      {homepage_2 && <img src={homepage_2} alt="" />}
    </motion.div>
  );
};

export default HomePage;
