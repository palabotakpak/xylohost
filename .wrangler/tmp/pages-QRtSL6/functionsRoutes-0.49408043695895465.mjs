import { onRequest as __api___path___js_onRequest } from "E:\\xylohost\\functions\\api\\[[path]].js"
import { onRequest as __f___path___js_onRequest } from "E:\\xylohost\\functions\\f\\[[path]].js"

export const routes = [
    {
      routePath: "/api/:path*",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api___path___js_onRequest],
    },
  {
      routePath: "/f/:path*",
      mountPath: "/f",
      method: "",
      middlewares: [],
      modules: [__f___path___js_onRequest],
    },
  ]