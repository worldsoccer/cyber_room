declare module "next-connect" {
  import { NextApiRequest, NextApiResponse } from "next";

  type Middleware<Req = NextApiRequest, Res = NextApiResponse> = (
    req: Req,
    res: Res,
    next: (err?: any) => void
  ) => void;

  interface Options<Req = NextApiRequest, Res = NextApiResponse> {
    onError?: (err: any, req: Req, res: Res, next: (err?: any) => void) => void;
    onNoMatch?: (req: Req, res: Res) => void;
  }

  interface NextConnect<Req = NextApiRequest, Res = NextApiResponse> {
    use(...handlers: Middleware<Req, Res>[]): this;
    all(...handlers: Middleware<Req, Res>[]): this;
    get(...handlers: Middleware<Req, Res>[]): this;
    post(...handlers: Middleware<Req, Res>[]): this;
    put(...handlers: Middleware<Req, Res>[]): this;
    delete(...handlers: Middleware<Req, Res>[]): this;
    patch(...handlers: Middleware<Req, Res>[]): this;
    options(...handlers: Middleware<Req, Res>[]): this;
    trace(...handlers: Middleware<Req, Res>[]): this;
    head(...handlers: Middleware<Req, Res>[]): this;
    handler(
      onError?: (
        err: any,
        req: Req,
        res: Res,
        next: (err?: any) => void
      ) => void,
      onNoMatch?: (req: Req, res: Res) => void
    ): (req: Req, res: Res) => void;
  }

  export default function nextConnect<
    Req = NextApiRequest,
    Res = NextApiResponse
  >(options?: Options<Req, Res>): NextConnect<Req, Res>;
}
