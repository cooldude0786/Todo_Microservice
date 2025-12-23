// import  PrismaClient  from '@prisma/client'

// const prisma = new PrismaClient()

// export { prisma }
// export * from '@prisma/client'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export { prisma, PrismaClient }
export * from '@prisma/client'