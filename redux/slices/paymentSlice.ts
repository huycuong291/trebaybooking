import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { hydrate } from '@redux/actions';
import { IHotelPaymentInfo, IPaymentInformation, IPricing } from '@/utils/types';

export const paymentSlice = createSlice({
  name: 'payment',
  initialState: { paymentType: 'vnpay' } as IPaymentInformation,
  reducers: {
    setPaymentType: (state, action: PayloadAction<'palpay' | 'vnpay'>) => {
      state.paymentType = action.payload;
    },
    setPricing: (state, action: PayloadAction<IPricing | undefined>) => {
      state.pricing = action.payload;
    },
    setHotelInfo: (state, action: PayloadAction<IHotelPaymentInfo>) => {
      state.hotelInfo = action.payload;
    },
    setBookerInfo: (state, action: PayloadAction<any>) => {
      state.bookerInfo = action.payload;
    }
  },
  extraReducers: {}
});
