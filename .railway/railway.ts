import { bucket, defineRailway, github, project, service } from 'railway/iac'

// Production lives in europe-west4 (next to the Supabase DB in eu-west-1).
// Variables are not managed here (managed: false): secrets stay in the Railway dashboard.
// Apply with `railway config plan` then `railway config apply`.
const REGION = 'europe-west4-drams3a'

export default defineRailway(() => {
  const simonBackups = bucket('simon-backups', { region: 'ams' })

  const web = service('simon-musical-instruments', {
    source: github('rares04/simon-musical-instruments', { branch: 'main', checkSuites: false }),
    build: {
      buildEnvironment: 'V3',
      builder: 'RAILPACK',
      // The backup job lives in ops/backup and must not redeploy the web app.
      watchPatterns: ['/**', '!/ops/**'],
    },
    deploy: {
      startCommand: 'pnpm start',
      healthcheckPath: '/api/health',
      healthcheckTimeout: 300,
      restartPolicyType: 'ON_FAILURE',
      restartPolicyMaxRetries: 10,
    },
    replicas: { [REGION]: 1 },
    domains: ['simoninstruments.com', 'www.simoninstruments.com'],
    // Turned on by hand on 2026-10-24; media images rely on edge caching.
    cdn: { enabled: true },
  })

  const dbBackup = service('db-backup', {
    source: github('rares04/simon-musical-instruments', { rootDirectory: 'ops/backup' }),
    build: { buildEnvironment: 'V3', builder: 'RAILPACK', watchPatterns: ['/ops/backup/**'] },
    replicas: { [REGION]: 1 },
    deploy: { cronSchedule: '15 0 * * *', restartPolicyType: 'NEVER' },
  })

  return project('alluring-laughter', {
    variables: { managed: false },
    resources: [web, dbBackup, simonBackups],
  })
})
