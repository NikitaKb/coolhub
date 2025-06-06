declare module '#app' {
  interface PageMeta {
    middleware?: string | string[] | NavigationGuard | NavigationGuard[]
  }
} 