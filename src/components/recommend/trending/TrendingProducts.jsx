// import algolia recommend
import { TrendingItems } from '@algolia/recommend-react'
import { HorizontalSlider } from '@algolia/ui-components-horizontal-slider-react'
import { useRecoilValue } from 'recoil'

// styles for Recommend HorizontalSlider
import '@algolia/ui-components-horizontal-slider-theme'

import RelatedItem from '../relatedItems/RelatedProducts'

import { mainIndex, recommendClient } from '@/config/algoliaEnvConfig'
import { navigationStateAtom } from '@/config/navigationConfig'
import { segmentSelectedAtom } from '@/config/segmentConfig'
import { trendingConfig } from '@/config/trendingConfig'

//Use Translation
import { useTranslation } from 'react-i18next'

// Trending provides a carousel of trending products, filtered if needed by any facet
const TrendingProducts = ({ facetName, facetValue }) => {
  // define the client for using Recommend

  const index = useRecoilValue(mainIndex)
  const { threshold, maxProductsRecommendations } = trendingConfig
  const segmentOptionalFilters = useRecoilValue(segmentSelectedAtom)
  const { segment } = useRecoilValue(navigationStateAtom)

  // Import const translation
  // Use the translator
  const { t } = useTranslation('translation', {
    keyPrefix: 'srp',
  })

  return (
    <div>
      <TrendingItems
        recommendClient={recommendClient}
        indexName={index}
        itemComponent={RelatedItem}
        maxRecommendations={maxProductsRecommendations}
        view={HorizontalSlider}
        headerComponent={() => (
          <h3 className="title">{t('titleTrendingProducts')}</h3>
        )}
        threshold={threshold}
        facetName={facetName}
        facetValue={facetValue}
        queryParameters={{
          optionalFilters: segmentOptionalFilters
            ? segmentOptionalFilters
            : segment,
        }}
      />
    </div>
  )
}

export default TrendingProducts