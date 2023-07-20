import { RootState } from '@/utils/types';

export const selectPaymentType = (state: RootState) => {
  return state.payment.paymentType;
};

export const getPricing = (state: RootState) => {
  return state.payment.pricing;
};

export const getHotelPaymentInfo = (state: RootState) => {
  return state.payment.hotelInfo;
};

export const getGuestInfo = (state: RootState) => {
  return state.payment.bookerInfo;
};
