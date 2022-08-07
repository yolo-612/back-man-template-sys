import { http } from '@/utils/http';

/**
 * 查询直辖市版本是否最新
 * @param data
 * @returns
 */
export const getDistrctVersion = data => http.post('/portal-exp-order/order/switch/getDistrctVersion', data);

export const getDistrctVersion2 = data => http.post('/portal-exp-order/order/switch/getDistrctVersion2', data);
