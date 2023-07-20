import React, { useEffect, useState } from 'react';
import { Container } from '@mantine/core';

import { AppShell } from '@/components/Layout';
import { HEADER_HEIGHT } from '@/constants/theme';
import { HotelProps, Hotels } from '@/utils/types';

import { useDocumentTitle } from '@mantine/hooks';
import VillaCardLanding from '@/components/VillaCardLanding';
import hotelApi from '@/api/hotel';
import { useAppDispatch } from '@redux/store';
import { hotelActions } from '@redux/slices';
import { useRouter } from 'next/router';

export const getStaticProps = async () => {
  let hotels;
  try {
    hotels = await hotelApi.getAllHotels();
    console.log(hotels);
    if (hotels) {
      return {
        props: { hotels },
        revalidate: 30
      };
    } else {
      return {
        props: { hotels: [] },
        revalidate: 30
      };
    }
  } catch (err) {
    console.error(err);
    return {
      props: { hotels: [] },
      revalidate: 30
    };
  }
};

export default function ProductsPage(props: { hotels: Hotels }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { checkIn, checkOut, address, maxGuest } = router.query;
  const { hotels } = props;
  const [searchedHotels, setSearchedHotels] = useState<HotelProps[]>([]);

  const searchHotels = async () => {
    try {
      if (!checkIn || !checkOut) {
        return;
      }
      const res = await hotelApi.searchHotel({
        address: address as string,
        checkIn: checkIn as string,
        checkOut: checkIn as string,
        maxGuest: maxGuest as string
      });
      if (Array.isArray(res)) {
        setSearchedHotels(res);
        dispatch(hotelActions.setHotels(res));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!!checkIn && !!checkOut && !!maxGuest && !!address) {
      searchHotels();
    }
  }, [checkIn, checkOut, maxGuest, address]);

  useEffect(() => {
    if (hotels) {
      dispatch(hotelActions.setHotels(hotels));
    }
  }, [hotels]);

  useDocumentTitle(`Thuê ngay - Tre Bay Booking`);

  const renderHotels = () => {
    return hotels?.map((hotel: any, index: number) => {
      return <VillaCardLanding key={index} index={index} {...hotel} />;
    });
  };

  return (
    <AppShell
      headerSize="xl"
      styles={{ main: { padding: `${HEADER_HEIGHT}px 0px 0px 0px !important` } }}>
      <Container size="xl">
        {/* <Center>
          <HomeTabSelectComponent />
        </Center> */}
        {renderHotels()}
      </Container>
    </AppShell>
  );
}
