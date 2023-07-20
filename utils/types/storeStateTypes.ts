import { rootReducer } from '@redux/reducers';

export type RootState = ReturnType<typeof rootReducer>;

export type DateSelectedStateProps = [Date | null, Date | null];

export type HotelBookingTime = {
  checkinTime: Date | null;
  checkoutTime: Date | null;
};

export interface CarouselProps {
  images: string[];
  link?: string;
  type: string;
}

export interface VillaCardProps {
  _id: string;
  id: string;
  images: string[];
  name: string;
  address: string;
  star: number;
  rank: number;
  price?: number;
  size?: 'sm' | 'md';
  isForContact: boolean;
  phone: string;
  images360: string[];
  lat: number;
  lng: number;
  boxWidth?: string;
  ownerID?: string;
  totalRoom?: number;
  dayOrderMaxRoom?: number;
  promotionDescription?: string;
  needToContact: boolean;
  contactInfor: string;
  deposit?: number;
  minRoomPrice?: number;
  amenities: {
    icon: string;
    _id: string;
    description: string;
  }[];
}

export interface HotelProps extends VillaCardProps {
  description: string;
}

export interface CommentDto {
  _id: string;
  hotelID?: string;
  date: string;
  content: string;
  userID: string;
  userName: string;
  userAvatar: string;
  phoneNumber: string;
  parentID?: string;
  starRating: number;
  level: number;
  replyComment: CommentDto[];
}

export type Hotels = HotelProps[];

export interface RoomProps {
  id: string;
  roomNo: number;
  numberOfBed: number;
  hotelID: string;
  dayPrice?: number;
  hourFeePolicy?: Array<{ fee: number; hour: number }>;
}

export type HotelsLevel = RoomProps[];

export type HotelsRooms = HotelsLevel[];

export interface GuestSelectProps {
  elder: number;
  children: number;
}

export interface IPricing {
  roomIDs: Array<string>;
  roomPrice: number;
  totalPrice: number;
  vat: number;
  vatInPrice: number;
  mustPayDeposit: number;
  nights: number;
}

export interface IHotelPaymentInfo {
  id: string;
  name: string;
  address: string;
  rooms: RoomProps[];
  image: string;
  type: string;
}

export interface IPaymentInformation {
  paymentType: 'palpay' | 'vnpay';
  guestCount: GuestSelectProps;
  date: HotelBookingTime;
  bookerInfo: {
    name: string;
    phoneNum: string;
    email: string;
  };
  hotelInfo: IHotelPaymentInfo;
  pricing?: IPricing;
}

export interface IOrder {
  userName: string;
  gmail: string;
  phoneNumber: string;
  numberOfCustomer: number;
  vat?: number;
  hotelID?: string;
  villaID?: string;
  townhouseID?: string;
  roomIDs?: string[];
  checkIn: string;
  checkOut: string;

  orderType?: number;
}
