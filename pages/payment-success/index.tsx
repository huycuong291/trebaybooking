import { Button, Container, Text, RingProgress, Center, Paper } from '@mantine/core';
import { IconCheck } from '@tabler/icons';
import { AppShell } from '@/components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import hotelApi from '@/api/hotel';
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
          const res = await hotelApi.createOrder(
            { ...JSON.parse(orderInfo), paidDeposit: Number(router.query.vnp_Amount) } || ''
          );
          console.log(res);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (router.query.vnp_OrderInfo) createOrder();
  }, [router]);
  return (
    <AppShell headerSize={'lg'}>
      <Center>
        <Container size="xl" fluid={true} p={100}>
          <Center>
            <RingProgress
              size={200}
              roundCaps
              thickness={8}
              sections={[{ value: 100, color: 'teal' }]}
              label={
                <Center>
                  <IconCheck size="10rem" stroke={1.5} />
                </Center>
              }
            />
          </Center>
          <Text weight={700} size={50}>
            Bạn đã thanh toán thành công
          </Text>
          <Center>
            <Link href={'.'}>
              <Button color="teal" variant="outline" style={{ marginTop: '16px' }}>
                Quay về trang chủ
              </Button>
            </Link>
          </Center>
        </Container>
      </Center>
    </AppShell>
  );
}
