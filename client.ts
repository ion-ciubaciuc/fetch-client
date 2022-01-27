export default class Client {
  headers: Headers
  baseUrl: string

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl

    this.headers = new Headers({
      'Content-Type': 'application/json',
    })
  }

  withHeaders(headers: Record<string, string>) {
    Object.entries(headers).forEach(([key, value]) => {
      this.headers.append(key, value)
    })

    return this
  }

  get(url: string, query: object = {}) {
    url = this.appendQuery(url, query)

    return this.fetch(url, 'get')
  }

  post(url: string, data: object = {}) {
    return this.fetch(url, 'post', data)
  }

  patch(url: string, data: object = {}) {
    return this.fetch(url, 'patch', data)
  }

  delete(url: string, data: object = {}) {
    return this.fetch(url, 'delete', data)
  }

  private fetch(url: string, method: string, data: object = {}) {
    url = this.prepareUrl(url)

    return fetch(url, {
      headers: this.headers,
      method: method,
      body: JSON.stringify(data),
    })
  }

  private appendQuery(url: string, query: object): string {
    const _url = new URL(url)

    Object.entries(query).forEach(([key, value]) => {
      _url.searchParams.append(key, value)
    })

    return _url.toString()
  }

  private prepareUrl(url: string): string {
    return new URL(url, this.baseUrl).toString()
  }
}

export const frontendClient = () => {
  return new Client(process.env.REACT_APP_FRONTEND_API_URL)
}

export const backendClient = () => {
  return new Client(process.env.REACT_APP_BACKEND_API_URL)
}
