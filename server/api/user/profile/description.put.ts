import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const userId = getCookie(event, 'user_id')
    
    if (!userId) {
      return {
        success: false,
        message: 'Unauthorized'
      }
    }

    const body = await readBody(event)
    const { description } = body

    // Update user description in database
    await prisma.$executeRaw`
      UPDATE users 
      SET description = ${description}
      WHERE id = ${parseInt(userId)}
    `

    return {
      success: true,
      user: {
        description
      }
    }
  } catch (error) {
    console.error('Error updating user description:', error)
    return {
      success: false,
      message: 'Error updating description'
    }
  }
}) 