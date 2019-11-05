import { ServiceContext } from '@vtex/api'

declare var process: {
  env: {
    VTEX_APP_ID: string
  }
}

const appId = process.env.VTEX_APP_ID

export default async function settings(
  _root: {},
  _args: {},
  ctx: ServiceContext
) {
  const settings = await ctx.clients.apps.getAppSettings(appId)

  return settings
}
