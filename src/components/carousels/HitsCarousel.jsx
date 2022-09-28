import { useState } from 'react';
import get from 'lodash/get';
import useSendAlgoliaEvent from '@/hooks/useSendAlgoliaEvent';

import { hitAtom, hitsConfig } from '@/config/hitsConfig';
import Price from '../hits/components/Price';
import { CartPicto } from '@/assets/svg/SvgIndex';
import { cartState, removedItem } from '@/config/cartFunctions';

import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';

// Used to send insights event on add to cart
import { personaSelectedAtom } from '@/config/personaConfig';

const HitsCarousel = ({ hit, index }) => {
  const {
    objectID,
    image,
    productName,
    brand,
    sizeFilter,
    colour,
    colourHexa,
    price: priceForTotal,
  } = hitsConfig;
  const [hovered, setHovered] = useState(false);

  const [cart, setCart] = useRecoilState(cartState);
  const [removed, setRemoved] = useRecoilState(removedItem);

  // Navigate is used by React Router
  const navigate = useNavigate();

  // Hits are imported by Recoil
  const hitState = useSetRecoilState(hitAtom);

  // personalisation user token
  const userToken = useRecoilValue(personaSelectedAtom);

  const addToCart = (it) => {
    // Define a null const
    let cartItemIndex = null;
    // Iterate on our cart
    cart.map((item, index) => {
      if (item.objectID === it.objectID) {
        // And
        // If we already have the same article have
        // we store the index of this on cartItemIndex
        cartItemIndex = index;
      }
    });
    // So if we already have the same article
    if (cartItemIndex !== null) {
      let items = [...cart];
      if (items[cartItemIndex].qty !== 0) {
        items[cartItemIndex] = {
          ...items[cartItemIndex],
          qty: items[cartItemIndex].qty + 1,
          totalPrice:
            (items[cartItemIndex].qty + 1) *
            items[cartItemIndex][priceForTotal],
        };
        // Store in the cart the new array Items
        setCart(items);
        setRemoved([it.objectID, it.qty + 1]);
      }
    } else {
      // If not already the same article
      setCart([...cart, { ...it, qty: 1, totalPrice: it[priceForTotal] }]);
    }
  };

  return (
    <div
      className="item"
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
    >
      <div
        className={`${
          hovered ? 'carousel__imageWrapper hovered' : 'carousel__imageWrapper'
        }`}
      >
        <img
          src={get(hit, image)}
          alt={get(hit, productName)}
          onError={(e) => (e.currentTarget.src = placeHolderError)}
        />
      </div>
      <div className="item__infos">
        <div
          className="item__infos-up"
          onClick={() => {
            hitState(hit);
            // navigate to the product show page
            navigate(`/search/product/${hit[objectID]}`);
          }}
        >
          <p className="brand">{get(hit, brand)}</p>
          <p className="name">{get(hit, productName)}</p>
        </div>
        <div className="item__infos-down">
          <p className="price">
            <Price hit={hit} />
          </p>
          <div
            className="cart"
            onClick={() => {
              addToCart(hit);
              useSendAlgoliaEvent({
                type: 'conversion',
                userToken: userToken,
                index: index,
                hit: hit,
                name: 'add-to-cart',
              });
            }}
          >
            <CartPicto />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HitsCarousel;
