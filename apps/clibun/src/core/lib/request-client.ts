import axios, { AxiosInstance } from "axios"

const BACKEND_URL = process.env["BACKEND_URL"]

export class RequestClient {
	private client: AxiosInstance

	constructor() {
		this.client = axios.create({
			baseURL: BACKEND_URL,
		})
	}

	public setToken(token: string) {
		this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`
	}

	public async get<T = any>(path: string, params?: any): Promise<T> {
		const response = await this.client.get<T>(path, { params })
		return response.data
	}

	public async post<T = any>(path: string, data?: any): Promise<T> {
		const response = await this.client.post<T>(path, data)
		return response.data
	}
}
