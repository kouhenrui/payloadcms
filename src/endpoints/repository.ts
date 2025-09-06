import { SYSTEM_CONFIG } from '../utilities/key'

export const getRepositoryInfo = {
  path: '/repository/info',
  method: 'get' as const,
  handler: async (req: any) => {
    try {
      return Response.json({
        success: true,
        data: {
          url: SYSTEM_CONFIG.REPOSITORY.URL,
          branch: SYSTEM_CONFIG.REPOSITORY.BRANCH,
          commitHash: SYSTEM_CONFIG.REPOSITORY.COMMIT_HASH,
          lastUpdated: SYSTEM_CONFIG.REPOSITORY.LAST_UPDATED,
          systemName: SYSTEM_CONFIG.SYSTEM_NAME,
          systemVersion: SYSTEM_CONFIG.SYSTEM_VERSION,
        },
      })
    } catch (error) {
      return Response.json(
        {
          success: false,
          error: 'Failed to get repository information',
        },
        { status: 500 },
      )
    }
  },
}
