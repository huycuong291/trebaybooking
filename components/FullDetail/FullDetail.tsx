import React, { useEffect } from 'react';
import {
  Badge,
  Divider,
  Container,
  Grid,
  Group,
  Space,
  Text,
  Transition,
  MantineTransition,
  Flex,
  Col,
  Center,
  SimpleGrid
} from '@mantine/core';
import { batch, useSelector } from 'react-redux';
import { IconStar } from '@tabler/icons';
import * as icons from '@tabler/icons';
import { useFullDetailStyle } from './FullDetail.style';
import ImageGroup from '@/components/ImageGroup';
import Calendar from '@/components/Calendar';
import Description from '@/components/Description';
import PaymentBox from '@/components/PaymentBox';
import HotelRoom from '@/components/HotelRoom';

import { gradientBadgeProps } from '@/constants/props';
import { getRooms, getSelectedRooms, selectBookedDate } from '@redux/selectors';
import { useAppDispatch } from '@redux/store';
import { CommentDto, HotelProps } from '@/utils/types';
import { openImagesCarouselModal } from '@/utils/modals';
import ImageGallery from 'react-image-gallery';
import { DETAILS_TEXT } from '@/constants/details';
import { useDocumentTitle, useMediaQuery } from '@mantine/hooks';
import { dateActions, paymentActions, roomActions } from '@redux/slices';
import { rooms_floor } from '@/constants/static-data';
import ImagePreview from '../ImagePreview';
import config from '@/config/config';
import hotelApi from '@/api/hotel';

import GGMapFullView from '../GGMapFullView';
import CommentCarousel from '../CommentCarousel';
import { type } from 'os';
interface Props {
  currentHotel: HotelProps;
  comments: CommentDto[];
  type: string;
}
export default function FullDetail(props: Props) {
  const { currentHotel, comments } = props;
  const {
    id,
    name,
    address,
    description,
    images,
    images360,
    rank,
    price,
    phone,
    promotionDescription,
    minRoomPrice,
    lat,
    lng,
    amenities,
    needToContact,
    contactInfor
  } = currentHotel;
  const detailImages = images.map((image) => ({ original: image, thumbnail: image }));
  const renderableImages = images.map((image) => config.IMAGE_URL + image);
  const renderableImages360 = images360.map((image) => config.IMAGE_URL + image);
  const { classes, theme } = useFullDetailStyle();
  const dispatch = useAppDispatch();
  useDocumentTitle(`${name} - Tre Bay Booking`);
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
  const [checkinDate, checkoutDate] = useSelector(selectBookedDate);
  const selectedRooms = useSelector(getSelectedRooms);
  const hotelRooms = useSelector(getRooms);
  const transitionProps = {
    mounted: Boolean(checkinDate && checkoutDate),
    transition: 'fade' as MantineTransition,
    duration: 300,
    timingFunction: 'ease'
  };

  const getAvailableRooms = async () => {
    try {
      const rooms = await hotelApi.getAvailableRooms({
        hotelID: id,
        checkIn: checkinDate?.toISOString(),
        checkOut: checkoutDate?.toISOString()
      });
      if (rooms) {
        dispatch(roomActions.setAllRooms(rooms));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id && checkinDate && checkoutDate && props.type === 'hotel') {
      getAvailableRooms();
    }
    if (id && checkinDate && checkoutDate && props.type !== 'hotel') {
      paymentActions.setHotelInfo({
        id,
        name,
        address,
        rooms: selectedRooms,
        image: renderableImages[0],
        type: props.type
      });
    }
  }, [checkinDate, checkoutDate]);

  // useEffect(() => {
  // return () => {
  //   batch(() => {
  //     dispatch(roomActions.setAllRooms([]));
  //     dispatch(roomActions.unSetAllRooms());
  //     dispatch(dateActions.setBookedDate([null, null]));
  //   });
  // };
  // }, []);

  useEffect(() => {
    dispatch(
      paymentActions.setHotelInfo({
        id,
        name,
        address,
        rooms: selectedRooms,
        image: renderableImages[0],
        type: props.type
      })
    );
  }, [selectedRooms]);

  return (
    <Container size="xl">
      <Text className={classes.title}>{name}</Text>
      <Space h="xs" />
      <Flex justify={'space-between'}>
        <Group spacing={5}>
          <Badge {...gradientBadgeProps} className={classes.rating}>
            {rank} <IconStar size={11} fill="#fff" />
          </Badge>
          <Text color="dimmed" className={classes.address}>
            · 3 đánh giá · {address}
          </Text>
        </Group>
        <ImagePreview images360={renderableImages360}></ImagePreview>
      </Flex>
      <Space h="xl" />

      <ImageGroup images={renderableImages} />
      <Space h={40} />
      <Grid>
        <Grid.Col xl={8} lg={8} md={12} sm={12} xs={12}>
          {/* <ImageGallery items={detailImages} lazyLoad showPlayButton={false} /> */}
          <Badge color="teal" size={isMobile ? 'lg' : 'xl'} variant="filled">
            Ưu Đãi
          </Badge>
          <Space h="md" />
          <Description description={promotionDescription || ''} />
          <Divider my="xl" />
          <Badge color="teal" size={isMobile ? 'lg' : 'xl'} variant="filled">
            Mô tả
          </Badge>
          <Space h="md" />
          <Description description={description} />
          <Divider my="xl" />
          <Badge color="teal" size={isMobile ? 'lg' : 'xl'} variant="filled">
            Tiện ích
          </Badge>
          <Space h="md" />
          <Grid>
            {amenities.map((amenity, index) => {
              const IconComponent = icons[`${amenity.icon}` as keyof typeof icons];
              return (
                <Grid.Col span={4} key={amenity._id + index}>
                  <Group align="center" style={{ marginBottom: '10px' }}>
                    <IconComponent />
                    <Text ml={10}>{amenity.description}</Text>
                  </Group>
                </Grid.Col>
              );
            })}
          </Grid>
          <Divider my="xl" />
          <Badge color="teal" size={isMobile ? 'lg' : 'xl'} variant="filled">
            {DETAILS_TEXT.BOOK_NOW_TEXT}
          </Badge>
          <Space h="md" />
          <Calendar />
        </Grid.Col>
        <Grid.Col xl={4} lg={4} md={0} sm={0} xs={0}>
          <Container style={{ position: 'sticky', top: 80 }}>
            <PaymentBox
              type={props.type}
              phone={phone}
              price={price || minRoomPrice}
              needToContact={needToContact}
              contactInfor={contactInfor}
              hotelId={id}
            />
          </Container>
        </Grid.Col>
      </Grid>
      <Divider my="xl" />
      {props.type === 'hotel' && (
        <>
          <Transition {...transitionProps}>
            {(styles) => (
              <div style={styles}>
                <Badge color="teal" size={isMobile ? 'lg' : 'xl'} variant="filled">
                  Phòng có thể đặt
                </Badge>
                <Space h="sm" />
                <SimpleGrid cols={5}>
                  {hotelRooms.map((room) => {
                    return (
                      <div key={room.id}>
                        <HotelRoom {...room} />;
                      </div>
                    );
                  })}
                </SimpleGrid>
              </div>
            )}
          </Transition>
          <Space h="xl" />

          <Divider my="xl" />
          <Badge color="teal" size="xl" variant="filled">
            Đánh giá
          </Badge>
          <Space h="sm" />

          <Grid>
            <Grid.Col span={12}>
              <Flex justify={'start'} align={'center'}>
                <Text fw={'bold'} className={classes.ratingInComment}>
                  <Center>
                    <IconStar size={'1.25rem'} fill="#000" />
                    <Space w="sm" /> {rank}
                  </Center>
                </Text>
                <Space w="sm" />
                <Text fw={'bold'} className={classes.ratingInCommentCount}>
                  · {comments?.length} đánh giá
                </Text>
              </Flex>
            </Grid.Col>

            <CommentCarousel
              hotel={{ name: name, image: renderableImages[0], id: id }}
              rating={Number(rank)}
              comments={comments}
              hotelId={id}
            />
          </Grid>
          <Space h="xl" />
          <Divider my="xl" />
        </>
      )}

      <Badge color="teal" size="xl" variant="filled">
        Nơi bạn sẽ đến
      </Badge>
      <Space h="xl" />
      <GGMapFullView lat={lat} lng={lng}></GGMapFullView>
      <Space h="xl" />
    </Container>
  );
}
