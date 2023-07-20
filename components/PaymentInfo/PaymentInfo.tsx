import React, { useEffect } from 'react';
import { Box, Button, Divider, Paper, Stack, Text } from '@mantine/core';

import { usePaymentInfoStyle } from './PaymentInfo.style';
import { IconVNPay1 } from '@/icons/index';
import Link from 'next/link';
import moment from 'moment';
import queryString from 'query-string';
import { vnpay_config } from './config/vnpay';
import crypto from 'crypto';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useRouter } from 'next/router';
import PaymentSummary from '../PaymentSummary/PaymentSummary';
import { useSelector } from 'react-redux';
import {
  getGuestInfo,
  getHotelPaymentInfo,
  getPricing,
  getSelectedRooms,
  selectBookedDate,
  selectCountGuest
} from '@redux/selectors';
import hotelApi from '@/api/hotel';

interface VNPayPaymentParams {
  vnp_Amount: number;
  vnp_Command: string;
  vnp_CreateDate: string;
  vnp_CurrCode: string;
  vnp_IpAddr: string;
  vnp_Locale: string;
  vnp_OrderInfo: string;
  vnp_OrderType: string;
  vnp_ReturnUrl: string;
  vnp_TmnCode: string;
  vnp_TxnRef: number;
  vnp_Version: string;
  vnp_SecureHash?: string;
}

const currency = 'USD';

export default function PaymentInfoComponent() {
  const { classes } = usePaymentInfoStyle();
  const date = new Date();
  const router = useRouter();
  const pricing = useSelector(getPricing);
  const bookerInfo = useSelector(getGuestInfo);
  const guestCount = useSelector(selectCountGuest);
  const selectedRooms = useSelector(getSelectedRooms);
  const hotelInfo = useSelector(getHotelPaymentInfo);
  const [checkIn, checkOut] = useSelector(selectBookedDate);

  const createDate = moment(date).format('YYYYMMDDHHmmss');

  function sortObject(o: any) {
    const sorted: any = {};
    const onlyKey: any = [];
    for (const key in o) {
      if (o.hasOwnProperty(key)) {
        onlyKey.push(key);
      }
    }
    onlyKey.sort();
    Array.from({ length: onlyKey.length }, (elm, idx) => {
      sorted[onlyKey[idx]] = o[onlyKey[idx]];
      return null;
    });
    return sorted;
  }
  const getBookingInfor = () => {
    switch (hotelInfo.type) {
      case 'villa':
        return {
          userName: bookerInfo.name,
          gmail: bookerInfo.email,
          phoneNumber: bookerInfo.phoneNum,
          numberOfCustomer: guestCount,
          checkIn: checkIn?.toLocaleDateString(),
          checkOut: checkOut?.toLocaleDateString(),
          villaID: hotelInfo.id,
          type: hotelInfo.type
        };
      case 'townhouse':
        return {
          userName: bookerInfo.name,
          gmail: bookerInfo.email,
          phoneNumber: bookerInfo.phoneNum,
          numberOfCustomer: guestCount,
          checkIn: checkIn?.toLocaleDateString(),
          checkOut: checkOut?.toLocaleDateString(),
          townhouseID: hotelInfo.id,
          type: hotelInfo.type
        };
      default:
        return {
          userName: bookerInfo.name,
          gmail: bookerInfo.email,
          phoneNumber: bookerInfo.phoneNum,
          numberOfCustomer: guestCount,
          roomIDs: selectedRooms.map((room) => room.id),
          checkIn: checkIn?.toLocaleDateString(),
          checkOut: checkOut?.toLocaleDateString(),
          hotelID: hotelInfo.id,
          type: hotelInfo.type
        };
    }
  };

  const getVNpayUrl = () => {
    if (!pricing) return;

    if (!checkIn || !checkOut || !bookerInfo) {
      return;
    }
    const tmnCode = vnpay_config.vnp_TmnCode;
    const secretKey = vnpay_config.vnp_HashSecret;
    const returnUrl = vnpay_config.vnp_ReturnUrl;

    const orderId = createDate;
    const amount: number = pricing?.mustPayDeposit;
    const orderInfor = getBookingInfor();
    const orderInfo = JSON.stringify(orderInfor);
    const orderType = 'topup';
    const locale = 'vn';
    const currCode = 'VND';
    const set_vnp_Params: any = {};

    set_vnp_Params['vnp_Version'] = '2.0.1';
    set_vnp_Params['vnp_Command'] = 'pay';
    set_vnp_Params['vnp_TmnCode'] = tmnCode;
    set_vnp_Params['vnp_Locale'] = locale;
    set_vnp_Params['vnp_CurrCode'] = currCode;
    set_vnp_Params['vnp_TxnRef'] = orderId;
    set_vnp_Params['vnp_OrderInfo'] = orderInfo;
    set_vnp_Params['vnp_OrderType'] = orderType;
    set_vnp_Params['vnp_Amount'] = amount * 100;
    set_vnp_Params['vnp_ReturnUrl'] = returnUrl;
    set_vnp_Params['vnp_IpAddr'] = '127.0.0.1';
    set_vnp_Params['vnp_CreateDate'] = createDate;

    const vnp_Params = sortObject(set_vnp_Params);
    console.log(vnp_Params);
    const signData = queryString.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const secureHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    vnp_Params['vnp_SecureHashType'] = 'SHA512';
    vnp_Params['vnp_SecureHash'] = secureHash;
    const vnpUrl = vnpay_config.vnp_Url + '?' + queryString.stringify(vnp_Params, { encode: true });
    console.log(vnpUrl);
    return vnpUrl;
  };

  const convertToUSD = (amount: string): string => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
      throw new Error(`Invalid amount: ${amount}`);
    }
    return (numericAmount / 23000).toFixed(2).toString();
  };

  const createOrder = async () => {
    try {
      switch (hotelInfo.type) {
        case 'villa':
          if (!checkIn || !checkOut || !bookerInfo) {
            return;
          }
          const villaRes = await hotelApi.createOrderVilla({
            userName: bookerInfo.name,
            gmail: bookerInfo.email,
            phoneNumber: bookerInfo.phoneNum,
            numberOfCustomer: guestCount,
            checkIn: checkIn?.toISOString(),
            checkOut: checkOut?.toISOString(),
            villaID: hotelInfo.id,
            orderType: 1,
            vat: 0.1
          });

          const orderVillaRes = await hotelApi.updatePaidDepositVillaTownhouse({
            orderID: villaRes.id,
            paidDeposit: Number(pricing?.mustPayDeposit)
          });
          break;
        case 'townhouse':
          if (!checkIn || !checkOut || !bookerInfo) {
            return;
          }
          const townHousrRes = await hotelApi.createOrderTownhouse({
            userName: bookerInfo.name,
            gmail: bookerInfo.email,
            phoneNumber: bookerInfo.phoneNum,
            numberOfCustomer: guestCount,
            checkIn: checkIn?.toISOString(),
            checkOut: checkOut?.toISOString(),
            townhouseID: hotelInfo.id,

            orderType: 2,
            vat: 0.1
          });

          const orderTownHouseRes = await hotelApi.updatePaidDepositVillaTownhouse({
            orderID: townHousrRes.id,
            paidDeposit: Number(pricing?.mustPayDeposit)
          });
        default:
          if (!checkIn || !checkOut || !bookerInfo || !selectedRooms.length) {
            return;
          }
          const hotelRes = await hotelApi.createOrder({
            userName: bookerInfo.name,
            gmail: bookerInfo.email,
            phoneNumber: bookerInfo.phoneNum,
            numberOfCustomer: guestCount,
            roomIDs: selectedRooms.map((room) => room.id),
            checkIn: checkIn?.toISOString(),
            checkOut: checkOut?.toISOString(),
            hotelID: hotelInfo.id,

            vat: 0.1
          });

          const orderHotelRes = await hotelApi.updatePaidDepositHotel({
            orderID: hotelRes.id,
            paidDeposit: Number(pricing?.mustPayDeposit)
          });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      <Paper shadow="xs" p="lg" radius="lg">
        <Stack>
          <Text size="lg">Thông tin thanh toán</Text>
          <PaymentSummary />
          <Divider my="auto" />
          <Text size="lg">Phương thức thanh toán</Text>
          <Link href={getVNpayUrl() || ''}>
            <Button className={classes.paymentButton}>
              {/* <Button className={classes.paymentButton} onClick={createOrder}> */}
              <IconVNPay1 height={40} width={40} />
              Thanh toán ngay với VNPay
            </Button>
          </Link>

          <PayPalScriptProvider
            options={{
              'client-id':
                'AUgHUFmlq_WB5YKfW-VyWDziYMoydpF_-8oAJyazWXjeTm5DuXpLiG_6kZR68-_zY_Xpy2INKJMtbRIK'
            }}>
            <PayPalButtons
              style={{ layout: 'horizontal', label: 'pay', tagline: false }}
              disabled={false}
              forceReRender={[
                pricing?.mustPayDeposit.toString(),
                currency,
                { layout: 'horizontal' }
              ]}
              fundingSource={undefined}
              createOrder={(data, actions) => {
                if (actions.order) {
                  return actions.order
                    .create({
                      purchase_units: [
                        {
                          amount: {
                            currency_code: currency,
                            value: convertToUSD(pricing?.mustPayDeposit.toString() || '0')
                          }
                        }
                      ]
                    })
                    .then((orderId) => {
                      return orderId;
                    });
                }
                throw new Error('actions.order is undefined');
              }}
              onApprove={function (data, actions) {
                if (actions.order) {
                  return actions.order.capture().then(async function () {
                    await createOrder();
                    router.push('/payment-success');
                  });
                }
                throw new Error('actions.order is undefined');
              }}
            />
          </PayPalScriptProvider>
        </Stack>
      </Paper>
    </Box>
  );
}
