export interface IScraperPostBodyResponse {
  success: boolean
  id: string
  url: string
}

export interface IScraperPostBody {
  url: string
}

export interface IScraperGetBodyResponse {
  completed: number
  creditsUsed: number
  data: Daum[]
  expiresAt: string
  status: string
  success: boolean
  total: number
}

export interface Daum {
  markdown: string
  metadata: Metadata
}

export interface Metadata {
  description: string
  keywords: string
  "og:image": string
  "og:title": string
  "og:url": string
  ogImage: string
  ogLocaleAlternate: any[]
  ogTitle: string
  ogUrl: string
  "p:domain_verify": string
  sourceURL: string
  statusCode: number
  title: string
  url: string
  viewport: string
}
