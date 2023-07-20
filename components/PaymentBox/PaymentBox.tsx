import React, { useEffect, useState } from 'react';
import { Button, Group, Paper, Stack, Text, Badge } from '@mantine/core';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import DateSelect from '@/components/DateSelect';
import GuestSelectBoxComponent from '@/components/GuestSelectBox';
import { PRICE_UNIT } from '@/constants/prices';
import { usePaymentBoxStyles } from './PaymentBox.style';
import { DETAILS_TEXT } from '@/constants/details';
import { formatMoney } from '@/utils/formatter';
import { getPricing, getSelectedRooms, selectBookedDate, selectCountGuest } from '@redux/selectors';
import hotelApi from '@/api/hotel';
import { useAppDispatch } from '@redux/store';
import { paymentActions } from '@redux/slices';
import PaymentSummary from '@/components/PaymentSummary';

const PAYMENT_BOX_RADIUS = 'lg';
const PAYMENT_BOX_SHADOW = 'md';
interface Props {
  price?: number;
  phone: string;
  needToContact: boolean;
  contactInfor: string;
  hotelId: string;
  type: string;
}
export default function PaymentBox(props: Props) {
  const dispatch = useAppDispatch();
  const { price, needToContact, contactInfor, hotelId } = props;
  const { classes } = usePaymentBoxStyles();
  const router = useRouter();
  const dates = useSelector(selectBookedDate);
  const guestCount = useSelector(selectCountGuest);
  const [checkinDate, checkoutDate] = dates;
  const selectedRooms = useSelector(getSelectedRooms);
  const pricing = useSelector(getPricing);
  const [loading, setLoading] = useState(false);
  const unitTextProps = { color: 'dimmed', span: true };

  const getTemporaryPrice = async () => {
    try {
      switch (props.type) {
        case 'villa':
          if (checkinDate && checkoutDate && guestCount && hotelId) {
            setLoading(true);
            const result = await hotelApi.getTemporaryPriceVilla({
              villaID: hotelId,
              checkIn: checkinDate.toISOString(),
              checkOut: checkoutDate.toISOString(),
              numberOfCustomer: guestCount
            });

            if (!!result) {
              dispatch(paymentActions.setPricing(result));
            }
          }
          break;
        case 'townhouse':
          if (checkinDate && checkoutDate && guestCount && hotelId) {
            setLoading(true);
            const result = await hotelApi.getTemporaryPriceTownhouse({
              townhouseID: hotelId,
              checkIn: checkinDate.toISOString(),
              checkOut: checkoutDate.toISOString(),
              numberOfCustomer: guestCount
            });

            if (!!result) {
              dispatch(paymentActions.setPricing(result));
            }
          }
          break;
        default:
          if (checkinDate && checkoutDate && guestCount && hotelId && selectedRooms?.length > 0) {
            setLoading(true);
            const result = await hotelApi.getTemporaryPrice({
              hotelID: hotelId,
              checkIn: checkinDate.toISOString(),
              checkOut: checkoutDate.toISOString(),
              roomIDs: selectedRooms.map((room) => room.id),
              numberOfCustomer: guestCount
            });

            if (!!result) {
              dispatch(paymentActions.setPricing(result));
            }
          }
          break;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTemporaryPrice();
    switch (props.type) {
      case 'villa':
        if (!checkinDate || !checkoutDate || !guestCount || !hotelId) {
          dispatch(paymentActions.setPricing(undefined));
        }
        break;
      case 'townhouse':
        if (!checkinDate || !checkoutDate || !guestCount || !hotelId) {
          dispatch(paymentActions.setPricing(undefined));
        }
        break;
      default:
        if (!checkinDate || !checkoutDate || !guestCount || !selectedRooms.length || !hotelId) {
          dispatch(paymentActions.setPricing(undefined));
        }
        break;
    }
  }, [checkinDate, checkoutDate, hotelId, guestCount, selectedRooms]);

  const PaymentPrice = () => {
    return (
      <Paper
        className={classes.priceBox}
        p="xl"
        shadow={PAYMENT_BOX_SHADOW}
        radius={PAYMENT_BOX_RADIUS}>
        <Group position="apart">
          <Text color="white">
            <Text span size="md">
              Giá từ{' '}
            </Text>
            <Text span size={25}>
              {price && formatMoney(price)}{' '}
            </Text>
            <Text {...unitTextProps} color="white" size="sm" span>
              {PRICE_UNIT}
            </Text>
          </Text>
        </Group>
      </Paper>
    );
  };

  return (
    <React.Fragment>
      <PaymentPrice />

      <Paper shadow={PAYMENT_BOX_SHADOW} radius={PAYMENT_BOX_RADIUS} p="xl" className={classes.box}>
        <Stack spacing={25}>
          <Stack spacing={15}>
            <DateSelect />
            <Group>
              <Badge color="teal" size="md" variant="filled">
                Số lượng khách
              </Badge>
            </Group>
            <GuestSelectBoxComponent />
          </Stack>

          {pricing && <PaymentSummary loading={loading} />}

          {needToContact ? (
            <Paper className={classes.contactBox} p="md" radius={PAYMENT_BOX_RADIUS}>
              <Text color="white" ta="center" fz="xl">
                {contactInfor}
              </Text>
            </Paper>
          ) : (
            <Button
              fullWidth
              className={classes.paymentButton}
              disabled={!pricing}
              onClick={() => router.push('/payment')}>
              {DETAILS_TEXT.BOOK_NOW_TEXT.toUpperCase()}
            </Button>
          )}
        </Stack>
      </Paper>
    </React.Fragment>
  );
}
