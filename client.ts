export default class Client {
  headers: Headers
  baseUrl: string

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl

    this.headers = new Headers({
      'Content-Type': 'application/json',
    })
  }

  public withHeaders = (headers: Record<string, string>) => {
    Object.entries(headers).forEach(([key, value]) => {
      this.headers.append(key, value)
    })

    return this
  }

  public get = (url: string, query: object = {}) => {
    url = this.appendQuery(url, query)

    return this.fetch(url, 'get')
  }

  public post = (url: string, data: object = {}) => {
    return this.fetch(url, 'post', data)
  }

  public patch = (url: string, data: object = {}) => {
    return this.fetch(url, 'patch', data)
  }

  public delete = (url: string, data: object = {}) => {
    return this.fetch(url, 'delete', data)
  }

  private fetch = async (url: string, method: string, data: object = {}) => {
    url = this.prepareUrl(url)

    const init: RequestInit = {
      headers: this.headers,
      method: method,
    }

    if (!this.isEmpty(data)) {
      init.body = JSON.stringify(data)
    }

    const response = await fetch(url, init)

    if (response.status === 204) {
      return
    }

    const responseData = await this.getResponseBody(response)

    if (!response.ok) {
      const message = `Error ${response.status}: ${response.statusText}`
      throw new RequestError(message, responseData)
    }

    return responseData
  }

  private getResponseBody = async (response: Response) => {
    const responseClone = response.clone()

    try {
      return await response.json()
    } catch (error) {}

    try {
      return await responseClone.text()
    } catch (error) {}
  }

  private appendQuery = (url: string, query: object): string => {
    const _url = new URL(url, this.baseUrl)

    Object.entries(query).forEach(([key, value]) => {
      _url.searchParams.append(key, value)
    })

    return _url.toString()
  }

  private prepareUrl = (url: string): string => {
    return new URL(url, this.baseUrl).toString()
  }

  private isEmpty = (data: object): boolean => {
    return Object.keys(data).length === 0
  }
}

class RequestError extends Error {
  data: object
  constructor(message: string, data: object) {
    super(message)
    this.data = data
  }
}
