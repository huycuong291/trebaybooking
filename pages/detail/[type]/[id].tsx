import React from 'react';
import { AppShell } from '@/components/Layout';
import { Text } from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import { GetStaticPropsContext } from 'next';

import FullDetail from '@/components/FullDetail';
import ContactButton from '@/components/ContactButton';
import { CommentDto, HotelProps } from '@/utils/types';
import hotelApi from '@/api/hotel';
import userApi from '@/api/user';
export const getStaticPaths = async () => {
  let paths: any[] = [];

  try {
    const hotels = await hotelApi.getAllHotels();
    const hotelPaths = hotels?.map((hotel) => ({
      params: { id: hotel.id.toString(), type: 'hotel' }
    }));
    paths = paths.concat(hotelPaths);

    const villas = await hotelApi.getAllVillas();
    const villaPaths = villas?.map((villa: any) => ({
      params: { id: villa.id.toString(), type: 'villa' }
    }));
    paths = paths.concat(villaPaths);

    const townhouses = await hotelApi.getAllTownhouses();
    const townhousePaths = townhouses?.map((townhouse: any) => ({
      params: { id: townhouse.id.toString(), type: 'townhouse' }
    }));
    paths = paths.concat(townhousePaths);
  } catch (err) {
    console.error(err);
  }

  return {
    paths,
    fallback: true
  };
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const type = context.params?.type;
  const id = context.params?.id;
  let products;
  try {
    switch (type) {
      case 'villa':
        products = await hotelApi.getVillaById(id as string);
        products = {
          ...products,
          id: products._id.toString()
        };

      case 'townhouse':
        products = await hotelApi.getTownhouseById(id as string);
        products = {
          ...products,
          id: products._id.toString()
        };
        break;
      default:
        products = await hotelApi.getHotelById(id as string);
        break;
    }
    const comments = await hotelApi.getAllCommentOfHotel(id as string);

    if (products) {
      return {
        props: { hotel: products, comments, type },
        revalidate: 30
      };
    } else {
      return {
        props: {},
        revalidate: 30
      };
    }
  } catch (err) {
    console.error(err);
    return {
      props: {},
      revalidate: 30
    };
  }
};
interface Props {
  hotel: HotelProps;
  comments: CommentDto[];
  userId: string;
  type: string;
}
export default function Detail(props: Props) {
  return (
    <AppShell headerSize="xl">
      {!props.hotel ? (
        <Text>Loading...</Text>
      ) : (
        <FullDetail currentHotel={props.hotel} comments={props.comments} type={props.type} />
      )}
      <ContactButton />
    </AppShell>
  );
}
