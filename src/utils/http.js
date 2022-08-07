import axios from 'axios';
import qs from 'qs';

const defaultConfig = {
  debug: false, // 调试模式，每个请求都会打印
  baseURL: '',
  timeout: 15 * 1000,
  headers: {
    'Content-Type': 'application/json',
    'Source-Client': '1', // 示例
    // 'Source-Client': Platform.isMobile() ? '1' : '2', // 1-移动端，2-PC端
  },

  /**
   * HTTP响应状态码处理
   * @param status
   * @returns {boolean}
   */
  validateStatus: status => status == 200,

  /**
   * 对接口响应数据进行处理，返回true：promise 将被 resolve， 否则，promise将被reject
   * @param data
   * @returns {boolean}
   */
  validateData: data => data.success === true,

  /**
   * 响应失败后的统一处理
   * @param res
   */
  handlerDataError: (data) => { console.log(data); },
};

export class Http {
  constructor(config = {}) {
    this.config = { ...defaultConfig, ...config };
    this._axios = this.createAxios();
    // 如果
    this._worker = new Map();
  }

  get(url, params = {}) {
    return this.request({ method: 'get', url, params });
  }

  post(url, data = {}) {
    return this.request({ method: 'post', url, data });
  }

  put(url, params = {}) {
    return this.request({ method: 'put', url, params });
  }

  delete(url, params = {}) {
    return this.request({ method: 'delete', url, params });
  }

  postForm(url, data = {}) {
    return this.request({
      method: 'post',
      url,
      data,
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    });
  }

  /**
   * 通用请求方法
   * @param options {
   *   url: '',
   *   baseURL: '',
   *   method: 'get', // 默认是get; 'post'、'get'
   *   params: {}, // 请求参数在拼接在url上面
   *   data: {}, // 请求主体被发送的数据，只适用与这些请求方法 'PUT', 'POST', 和'PATCH'
   *   timeout: 15 * 1000, // 超时时间默认15s
   *   headers: {},
   *   single: false, // 请求去重，如果为true：同时发送多个请求，只有一个会发送真实请求，其他放入缓存数组，等响应成功后全部返回
   * }
   */
  request(options) {
    if (!options) throw new Error('Http:options不能为空！');
    if (!options.url) throw new Error('Http:url不能为空！');

    const newOptions = mergeOptions(options, this.config);
    newOptions.sameKey = getRequestKey(options);
    newOptions.single = Object.prototype.hasOwnProperty.call(options, 'single')
      ? options.single
      : false;

    if (!newOptions.single) {
      return this._axios(newOptions);
    }

    // 需要去重的请求
    const { sameKey } = newOptions;
    const worker = this._worker;

    return new Promise((resolve, reject) => {
      if (worker.has(sameKey)) {
        worker.get(sameKey).push({ resolve, reject });
      } else {
        worker.set(sameKey, [{ resolve, reject }]);

        this._axios(newOptions)
          .then((res) => {
            worker.get(sameKey).forEach(item => item.resolve(res));
            worker.delete(sameKey);
          })
          .catch((error) => {
            worker.get(sameKey).forEach(item => item.reject(error));
            worker.delete(sameKey);
          });
      }
    });
  }

  createAxios() {
    const axiosNew = axios.create({ timeout: 15 * 1000 });
    // 本地支持跨域请求带上cookie；线上环境不一定不支持
    // if (process.env.NODE_ENV === "development") {
    //   axiosNew.defaults.withCredentials = true; // 设置为true, 跨域请求带上cookie
    // }
    // 请求拦截
    axiosNew.interceptors.request.use(
      (config) => {
        // 是否表单请求，文件上传形式
        const isFormData =
          Object.prototype.toString.call(config.data) == '[object FormData]';
        const headers = config.headers;

        if (
          !isFormData &&
          (config.method === 'post' ||
            config.method === 'put' ||
            config.method === 'delete') &&
          headers &&
          headers['content-type'] ===
            'application/x-www-form-urlencoded; charset=UTF-8'
        ) {
          // 序列化
          config.data = qs.stringify(config.data);
        }

        if (this.config.debug) {
          console.log('config', config);
        }
        return config;
      },
      error =>
        Promise.reject(new HttpError(HttpErrorType.REQUEST, null, null, error)),
    );
    // 响应拦截
    axiosNew.interceptors.response.use(
      (res) => {
        // 判断HTTP响应状态码非200
        if (!this.config.validateStatus(res.status)) {
          return Promise.reject(
            new HttpError(
              HttpErrorType.SERVICE,
              `Server Error:status=${res.status}`,
            ),
          );
        }

        // json解析报错
        if (typeof res.data === 'string') {
          return Promise.reject(
            new HttpError(
              HttpErrorType.API,
              'Api Error:响应数据json解析错误',
              res.data,
            ),
          );
        }

        // 将接口返回的success为string类型改为boolean类型
        if (typeof res.data.success === 'string') {
          res.data.success = res.data.success === 'true';
        }

        // **业务中需要的响应结构(状态码200, success为true)**
        if (this.config.validateData(res.data)) {
          return res.data;
        }

        // 响应失败后的统一处理(状态码200, success为false)
        this.config.handlerDataError(res.data);

        return Promise.reject(
          new HttpError(
            HttpErrorType.API,
            `Api Error:${res.data.errorMessage || res.data.message || '请求失败，请稍后重试'}`,
            res.data,
          ),
        );
      },
      (error) => {
        // 服务器有响应
        if (error.response) {
          return Promise.reject(
            new HttpError(HttpErrorType.SERVICE, null, null, error),
          );
        }
        // 无网络或者服务器无响应
        return Promise.reject(
          new HttpError(
            HttpErrorType.NOT_NETWORK,
            'Network Error:not network',
            null,
            error,
          ),
        );
      },
    );

    return axiosNew;
  }
}

/**
 * 请求的key: 保证url和参数相同，返回同一个值
 * @param options
 * @returns {string}
 */
function getRequestKey(options) {
  const { url, params, data } = options;
  const query = { ...params, ...data };
  const querySort = {};
  Object.keys(query)
    .sort()
    .forEach(key => (querySort[key] = query[key]));
  return `${url}@@${JSON.stringify(querySort)}`;
}

/**
 * 合并默认请求默认配置项
 * @param options
 * @returns {object}
 */
function mergeOptions(options = {}, config = {}) {
  return {
    url: options.url || '',
    baseURL: options.baseURL || config.baseURL,
    method: options.method || 'get',
    params: options.params || null,
    data: options.data || null,
    timeout: options.timeout || config.timeout,
    headers: { ...config.headers, ...options.headers },
  };
}

export const HttpErrorType = {
  NOT_NETWORK: -1, // 无网络，服务器无响应
  API: -4, // 接口错误: success!== true
  SERVICE: -2, // 服务器错误，请求错误返回码不为：200
  REQUEST: -5, // 请求之前错误
};

export class HttpError extends Error {
  /**
   *
   * @param type // 错误类型, HttpErrorType中的值
   * @param message
   * @param data // 接口响应的数据
   * @param error // 可为空
   */
  constructor(type, message, data, error) {
    super(message);
    this.type = type;
    this.data = data;
    if (!message && error) {
      this.message = error.message;
    }
    if (error) {
      this.stack = error.stack;
    }
  }
}

/**
 * 判断错误的类型
 * @param error
 * @param httpErrorType
 * @returns {boolean}
 */
HttpError.isType = function (error, httpErrorType) {
  // TODO：error instanceof HttpError 判断有问题
  return error && error instanceof HttpError && error.type == httpErrorType;
};
/**
 * 是否接口错误
 * @param error
 * @returns {boolean}
 */
HttpError.isApiType = function (error) {
  return HttpError.isType(error, HttpErrorType.API);
};

/**
 * 判断接口返回的errorCode是否在errorCodes中
 * @param error
 * @param errorCodes 可以传 string 或 array
 */
HttpError.hasErrorCode = (error, errorCodeList = []) => {
  if (!error || !errorCodeList || !HttpError.isApiType(error)) return false;

  const errorCode = error.data.errorCode;

  if (typeof errorCodeList === 'string') {
    return errorCode == errorCodeList;
  } else if (Array.isArray(errorCodeList)) {
    return errorCodeList.some(item => item == errorCode);
  }
  return false;
};

/**
 * 获取接口错误errorMessage
 * @param error
 * @returns {string}
 */
HttpError.getMsg = function (error) {
  return HttpError.isType(error, HttpErrorType.API)
    ? error.data.errorMessage
    : '请求失败，请稍后重试';
};

/**
 * 跨域请求封装的jsonp，只能get请求
 * @param url
 * @param data
 * @returns {Promise<unknown>}
 */
export const jsonp = (url, data = {}) => new Promise((resolve, reject) => {
  window.__fn__ = (data1) => {
    resolve(data1);
  };
  const script = document.createElement('script');
  const query = Object.entries(data)
    .map(a => `${a[0]}=${a[1]}`)
    .join('&');
  script.src = `${url}?callback=__fn__&${query}`;
  script.onerror = () => reject('加载失败');
  document.head.appendChild(script);
  document.head.removeChild(script);
});

export const http = new Http();
