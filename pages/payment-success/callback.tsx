import {
  Button,
  Container,
  Text,
  RingProgress,
  Center,
  Paper,
  LoadingOverlay
} from '@mantine/core';
import { IconCheck } from '@tabler/icons';
import { AppShell } from '@/components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import hotelApi from '@/api/hotel';
import moment from 'moment';
export default function PaymentSuccess() {
  const router = useRouter();

  useEffect(() => {
    const createOrder = async () => {
      try {
        console.log(router);
        if (router && router.query && router.query.vnp_OrderInfo) {
          console.log(router);
          const orderInfo = Array.isArray(router.query.vnp_OrderInfo)
            ? router.query.vnp_OrderInfo[0]
            : router.query.vnp_OrderInfo;
          const infor = JSON.parse(orderInfo);
          console.log(infor);
          switch (infor.type) {
            case 'villa':
              const resVilla = await hotelApi.createOrderVilla(
                {
                  ...infor,
                  checkIn: moment(infor.checkIn).toISOString(),
                  checkOut: moment(infor.checkOut).toISOString(),

                  orderType: 1,
                  vat: 0.1
                } || ''
              );
              const orderVillaRes = await hotelApi.updatePaidDepositVillaTownhouse({
                orderID: resVilla.id,
                paidDeposit: Number(router.query.vnp_Amount) / 100
              });

              break;
            case 'townhouse':
              const resTownHouse = await hotelApi.createOrderTownhouse(
                {
                  ...infor,
                  checkIn: moment(infor.checkIn).toISOString(),
                  checkOut: moment(infor.checkOut).toISOString(),

                  orderType: 2,
                  vat: 0.1
                } || ''
              );
              const orderTownhouseRes = await hotelApi.updatePaidDepositVillaTownhouse({
                orderID: resTownHouse.id,
                paidDeposit: Number(router.query.vnp_Amount) / 100
              });
              break;
            default:
              const resHotel = await hotelApi.createOrder(
                {
                  ...infor,
                  checkIn: moment(infor.checkIn).toISOString(),
                  checkOut: moment(infor.checkOut).toISOString(),

                  vat: 0.1
                } || ''
              );

              const orderRes = await hotelApi.updatePaidDepositHotel({
                orderID: resHotel.id,
                paidDeposit: Number(router.query.vnp_Amount) / 100
              });
              console.log(resHotel);
              break;
          }

          router.push('/payment-success');
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (router.query.vnp_OrderInfo) {
      const order = createOrder();
    }
  }, [router]);
  return (
    <AppShell headerSize={'lg'}>
      <LoadingOverlay visible={true}></LoadingOverlay>
    </AppShell>
  );
}
