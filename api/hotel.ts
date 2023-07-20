import queryString from 'query-string';
import client from './client';
import { Hotels, IOrder } from '@/utils/types';

class HotelApi {
  public static classInstance: HotelApi;

  static get instance() {
    if (!this.classInstance) {
      this.classInstance = new HotelApi();
    }

    return this.classInstance;
  }

  public getAllHotels(): Promise<Hotels> {
    return client.get(`/hotel/all`);
  }

  public getAllVillas(): Promise<any> {
    return client.get(`/villa/all`);
  }
  public getAllTownhouses(): Promise<any> {
    return client.get(`/townhouse/all`);
  }

  public getHotelsByPage(query: { offset?: number; maxPerPage?: number }): Promise<any> {
    return client.get(`/hotel/paged?${queryString.stringify(query)}`);
  }

  public getHotelById(hotelId: string): Promise<any> {
    return client.get(`/hotel/${hotelId}`);
  }

  public getVillaById(hotelId: string): Promise<any> {
    return client.get(`/villa/${hotelId}`);
  }

  public getTownhouseById(hotelId: string): Promise<any> {
    return client.get(`/townhouse/${hotelId}`);
  }

  public getAvailableRooms(query: {
    hotelID?: string;
    checkIn?: string;
    checkOut?: string;
  }): Promise<any> {
    const newQuery = {
      ...query,
      from: query.checkIn,
      to: query.checkOut
    };
    return client.get(`/hotel/room/available?${queryString.stringify(newQuery)}`);
  }

  public getTemporaryPrice(body: {
    checkIn: string;
    checkOut: string;
    numberOfCustomer: number;
    hotelID: string;
    roomIDs: string[];
  }): Promise<any> {
    return client.post(`/calculatePriceOrder/room?orderType=1`, body);
  }

  public getTemporaryPriceVilla(body: {
    checkIn: string;
    checkOut: string;
    numberOfCustomer: number;
    villaID: string;
  }): Promise<any> {
    return client.post(`/calculatePriceOrder/villa`, body);
  }

  public getTemporaryPriceTownhouse(body: {
    checkIn: string;
    checkOut: string;
    numberOfCustomer: number;
    townhouseID: string;
  }): Promise<any> {
    return client.post(`/calculatePriceOrder/townhouse`, body);
  }

  public createOrder(body: IOrder): Promise<any> {
    return client.post(`/order/room?orderType=1&paymentType=0`, body);
  }

  public createOrderVilla(body: IOrder): Promise<any> {
    return client.post(`/order/villa`, body);
  }

  public updatePaidDepositHotel(body: { paidDeposit: number; orderID: string }): Promise<any> {
    return client.put(`/order/room/deposit`, body);
  }

  public updatePaidDepositVillaTownhouse(body: {
    paidDeposit: number;
    orderID: string;
  }): Promise<any> {
    return client.put(`/order/villaTownhouse/deposit`, body);
  }
  public createOrderTownhouse(body: IOrder): Promise<any> {
    return client.post(`/order/townhouse`, body);
  }
  public getAllCommentOfHotel(hotelId: string): Promise<any> {
    return client.get(`/comment/all/detail?id=${hotelId}`);
  }

  public addCommnetToHotel(props: {
    accommodationID: string;
    date: string;
    content: string;
    userID?: string;
    phoneNumber?: string;
    parentID?: string;
    starRating: number;
    level: number;
    type: string;
  }): Promise<any> {
    const {
      accommodationID,
      date,
      content,
      userID,
      phoneNumber,
      parentID,
      starRating,
      level,
      type
    } = props;
    const data = {
      accommodationID: accommodationID,
      date: date,
      content: content,
      userID: userID || null,
      phoneNumber: phoneNumber || '',
      parentID: parentID,
      starRating: starRating,
      level: level
    };

    return client.post(`/comment?accommodationType=${type}`, data);
  }
  public searchHotel(params: {
    address: string;
    checkIn: string;
    checkOut: string;
    maxGuest: string;
  }): Promise<any> {
    return client.get(`/hotel/available?${queryString.stringify(params)}`);
  }
}

export default HotelApi.instance;
