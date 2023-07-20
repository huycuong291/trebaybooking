import React, { ReactNode } from 'react';
import {
  Group,
  MantineNumberSize,
  GroupPosition,
  Stack,
  Text,
  Divider,
  Tooltip,
  Skeleton
} from '@mantine/core';
import { useSelector } from 'react-redux';

import { PRICE_CURRENCY, PRICE_UNIT } from '@/constants/prices';
import { formatMoney } from '@/utils/formatter';
import { getPricing, selectBookedDate } from '@redux/selectors';
import { IconInfoCircle } from '@tabler/icons';
import { usePaymentSummaryStyles } from './PaymentSummary.style';

const totalGridProps = {
  position: 'apart' as GroupPosition,
  pl: 'xs' as MantineNumberSize,
  pr: 'xs' as MantineNumberSize
};

const PaymentSummary = ({ loading }: { loading?: boolean }) => {
  const { classes } = usePaymentSummaryStyles();
  const dates = useSelector(selectBookedDate);
  const pricing = useSelector(getPricing);
  const unitTextProps = { color: 'dimmed', span: true };

  const renderCalcPrice = (price: number | ReactNode, unit?: string) => {
    return (
      <Text className={classes.price}>
        {typeof price === 'number' ? formatMoney(price).replace('VND', '') : price}
        <Text {...unitTextProps} className={classes.priceUnit}>
          {unit}
        </Text>
      </Text>
    );
  };

  const renderRoomPrice = () => {
    return (
      <Tooltip
        label={`${pricing?.roomIDs?.length} phòng x ${pricing?.nights} ${PRICE_UNIT.replace(
          '/',
          ''
        )}`}>
        <Text className={classes.price}>
          Tổng trước thuế <IconInfoCircle size={17} />
        </Text>
      </Tooltip>
    );
  };

  const renderVAT = () => {
    return (
      <Tooltip label={`${pricing?.vat} %`}>
        <Text className={classes.price}>
          Thuế VAT <IconInfoCircle size={17} />
        </Text>
      </Tooltip>
    );
  };

  return (
    <Stack>
      <Group {...totalGridProps}>
        {renderCalcPrice(renderRoomPrice())}
        {loading ? (
          <Skeleton height={25} width={100} />
        ) : (
          (pricing?.roomPrice && renderCalcPrice(pricing?.roomPrice, PRICE_CURRENCY)) ||
          (pricing?.totalPrice && renderCalcPrice(pricing?.totalPrice, PRICE_CURRENCY))
        )}
      </Group>

      <Group {...totalGridProps}>
        {renderCalcPrice(renderVAT())}
        {loading ? (
          <Skeleton height={25} width={100} />
        ) : (
          renderCalcPrice(pricing?.vatInPrice, PRICE_CURRENCY)
        )}
      </Group>
      <Divider my="auto" />
      <Group {...totalGridProps}>
        <Text className={classes.label}>Tổng cộng</Text>
        {loading ? (
          <Skeleton height={25} width={100} />
        ) : (
          renderCalcPrice(pricing?.totalPrice, PRICE_CURRENCY)
        )}
      </Group>
      <Group {...totalGridProps}>
        <Text className={classes.label}>Tiền cọc cần trả</Text>
        {loading ? (
          <Skeleton height={25} width={100} />
        ) : (
          renderCalcPrice(pricing?.mustPayDeposit, PRICE_CURRENCY)
        )}
      </Group>
    </Stack>
  );
};

export default PaymentSummary;
