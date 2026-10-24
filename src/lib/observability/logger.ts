import { scrubError, scrubProperties } from './scrub'

type Level = 'debug' | 'info' | 'warn' | 'error'
type Fields = Record<string, unknown>

/**
 * JSON-lines logger for the server. Railway indexes the fields, so you can filter on
 * `@level:error` or `@request_id:…` in its log viewer. Fields go through `scrubProperties`:
 * emails, names, phone numbers, tokens and query strings never reach the logs.
 */
export type Logger = {
  debug: (msg: string, fields?: Fields) => void
  info: (msg: string, fields?: Fields) => void
  warn: (msg: string, fields?: Fields) => void
  error: (msg: string, fields?: Fields & { err?: unknown }) => void
  child: (fields: Fields) => Logger
}

function write(level: Level, msg: string, base: Fields, fields: Fields = {}): void {
  const { err, ...rest } = fields
  const line: Fields = {
    level,
    time: new Date().toISOString(),
    msg,
    ...scrubProperties({ ...base, ...rest }),
  }
  if (err !== undefined) {
    const safe = scrubError(err)
    line.err = { name: safe.name, message: safe.message, stack: safe.stack }
  }
  const out = JSON.stringify(line)
  if (level === 'error' || level === 'warn') console.error(out)
  else console.log(out)
}

function create(base: Fields): Logger {
  return {
    debug: (msg, fields) => {
      if (process.env.LOG_LEVEL === 'debug') write('debug', msg, base, fields)
    },
    info: (msg, fields) => write('info', msg, base, fields),
    warn: (msg, fields) => write('warn', msg, base, fields),
    error: (msg, fields) => write('error', msg, base, fields),
    child: (fields) => create({ ...base, ...fields }),
  }
}

export const logger: Logger = create({})

type HeaderSource = Headers | Readonly<Record<string, string | string[] | undefined>>

/** Railway's edge request ID when present, so a log line can be matched with Railway's HTTP log. */
export function requestIdFrom(headers: HeaderSource): string {
  const read = (name: string): string | undefined => {
    if (typeof (headers as Headers).get === 'function') {
      return (headers as Headers).get(name) ?? undefined
    }
    const value = (headers as Record<string, string | string[] | undefined>)[name]
    return Array.isArray(value) ? value[0] : value
  }
  return read('x-railway-request-id') ?? read('x-request-id') ?? crypto.randomUUID()
}

/** A logger tagged with the request ID and route, for route handlers. */
export function requestLogger(request: Request, route: string): Logger {
  return logger.child({ request_id: requestIdFrom(request.headers), route })
}
