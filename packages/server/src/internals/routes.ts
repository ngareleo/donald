/**
 * For each route on the server we care about a couple of parameters:
 *
 * 1. What is the shape of the incoming server request
 * 2. What is the shape of the outbound response
 * 3. What is the route (name)
 *
 * we can break it down like this =>
 *
 * router app = {
 *  route: "app",
 *  routes: [
 *      router auth = {
 *          route: "auth",
 *          routes: [
 *              router login <R> = {
 *                  route: "login",
 *                  app: [Elysia App instance <R>],
 *                  shape: {
 *                      body: Body,
 *                      headers: Headers,
 *                      params: Params,
 *                  }
 *              },
 *              router logout <R> = {
 *                  route: "logout",
 *                  app: [Elysia App instance <R>],
 *                  shape: {
 *                      body: Body,
 *                      headers: Headers,
 *                      params: Params,
 *                  }
 *              }
 *          ]
 *      },
 *      router users = {
 *          route: "users",
 *          routes: [...]
 *      }
 * ]
 * }
 */

export const createRoute = () => {};
