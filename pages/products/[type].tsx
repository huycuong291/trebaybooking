import React, { useEffect, useState } from 'react';
import { Center, Container, SegmentedControl, Divider, Box } from '@mantine/core';

import { AppShell } from '@/components/Layout';
import { HEADER_HEIGHT } from '@/constants/theme';
import { Hotels } from '@/utils/types';

import { useDocumentTitle } from '@mantine/hooks';
import VillaCardLanding from '@/components/VillaCardLanding';
import hotelApi from '@/api/hotel';
import { useAppDispatch } from '@redux/store';
import { hotelActions } from '@redux/slices';
import { useRouter } from 'next/router';
import { GetStaticPropsContext } from 'next';
import {
  IconBuilding,
  IconBuildingChurch,
  IconBuildingCommunity,
  IconHome2,
  IconHotelService
} from '@tabler/icons';
import SearchBar from '@/components/Searchbar';
export const getStaticPaths = async () => {
  try {
    const types = ['hotel', 'villa', 'townhouse'];
    const type = types?.map((type: string) => ({ params: { type: type } }));
    return {
      paths: type,
      fallback: true
    };
  } catch (err) {
    console.error(err);
  }
};
export const getStaticProps = async (context: GetStaticPropsContext) => {
  const type = context.params?.type;
  console.log(type);
  let products;
  switch (type) {
    case 'villa':
      try {
        products = await hotelApi.getAllVillas();
        products = products.map((item: any) => {
          return {
            ...item,
            id: item._id.toString(),
            minRoomPrice: item.price
          };
        });
      } catch (err) {
        console.error(err);
      }
      if (products) {
        return {
          props: { products },
          revalidate: 30
        };
      } else {
        return {
          props: {},
          revalidate: 30
        };
      }
    case 'townhouse':
      try {
        products = await hotelApi.getAllTownhouses();
        products = products.map((item: any) => {
          return {
            ...item,
            id: item._id.toString(),
            minRoomPrice: item.price
          };
        });
      } catch (err) {
        console.error(err);
      }
      if (products) {
        return {
          props: { products },
          revalidate: 30
        };
      } else {
        return {
          props: {},
          revalidate: 30
        };
      }
    default:
      try {
        products = await hotelApi.getAllHotels();
        console.log(products);
      } catch (err) {
        console.error(err);
      }
      if (products) {
        return {
          props: { products },
          revalidate: 30
        };
      } else {
        return {
          props: {},
          revalidate: 30
        };
      }
  }
};

export default function ProductsPage(props: { products: Hotels; type: string }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { products, type } = props;
  console.log();

  useEffect(() => {
    if (products) {
      console.log(products);

      dispatch(hotelActions.setHotels(products));
    }
  }, [products]);

  useDocumentTitle(`Thuê ngay - Tre Bay Booking`);
  console.log(products);
  const renderHotels = () => {
    return products?.map((hotel: any, index: number) => {
      return (
        <VillaCardLanding key={index} index={index} typeProduct={router.query.type} {...hotel} />
      );
    });
  };

  const handleChangeType = (type: string) => {
    router.push(`./${type}`);
  };

  return (
    <AppShell
      headerSize="xl"
      styles={{ main: { padding: `${HEADER_HEIGHT}px 0px 0px 0px !important` } }}>
      <Center>
        <SegmentedControl
          m={'2rem'}
          value={(router.query.type as string) || 'hotel'}
          size="md"
          onChange={handleChangeType}
          data={[
            {
              label: (
                <Center>
                  <IconBuilding size={16} />
                  <Box ml={10}> Khách Sạn</Box>
                </Center>
              ),
              value: 'hotel'
            },
            {
              label: (
                <Center>
                  <IconBuildingCommunity size={16} />
                  <Box ml={10}>Villa</Box>
                </Center>
              ),
              value: 'villa'
            },
            {
              label: (
                <Center>
                  <IconHome2 size={16} />
                  <Box ml={10}>Nhà phố</Box>
                </Center>
              ),
              value: 'townhouse'
            }
          ]}
        />
      </Center>
      {router.query.type === 'hotel' && <SearchBar></SearchBar>}
      <Divider m={'2rem'} />
      <Container size="xl">
        {/* <Center>
          <HomeTabSelectComponent />
        </Center> */}
        {renderHotels()}
      </Container>
    </AppShell>
  );
}
