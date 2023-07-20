import { PRIMARY_COLOR } from '@/constants/theme';
import { createStyles } from '@mantine/core';

export const usePaymentBoxStyles = createStyles((theme) => ({
  grid: { border: '1px solid #E2E7ED' },

  box: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0
  },

  priceBox: {
    backgroundColor: PRIMARY_COLOR.PRIMARY_LIGHT_GREEN,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },

  contactBox: {
    backgroundColor: PRIMARY_COLOR.PRIMARY_LIGHT_GREEN
  },

  paymentButton: {
    fontSize: 18,
    height: 50,
    backgroundColor: PRIMARY_COLOR.PRIMARY_LIGHT_GREEN,
    '&:hover': {
      backgroundColor: PRIMARY_COLOR.PRIMARY_DARK_GREEN
    }
  }
}));
