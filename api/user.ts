import queryString from 'query-string';
import client from './client';
import { NewsDetailDto } from '@/utils/types';

class UserApi {
  public static classInstance: UserApi;

  static get instance() {
    if (!this.classInstance) {
      this.classInstance = new UserApi();
    }

    return this.classInstance;
  }

  public async getUserInfor(accessToken: string): Promise<any> {
    const response = await client.get(`/user/info`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    console.log(response);
    return response;
  }

  public async login(data: { username: string; password: string }): Promise<any> {
    const response = await client.post(`/user/login`, {
      username: data.username,
      password: data.password
    });

    localStorage.setItem('accessToken', response as unknown as string);
    return { status: 200 };
  }

  public async signUp(data: { username: string; password: string; email: string }): Promise<any> {
    const response = await client.post(`/user/signup`, {
      username: data.username,
      password: data.password,
      email: data.email
    });

    return { status: 200 };
  }
}

export default UserApi.instance;
