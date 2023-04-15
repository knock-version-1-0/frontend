import { IncomingMessage, ServerResponse } from "http"

export interface ServerSideOpt {
  req?: IncomingMessage
  res?: ServerResponse
}
