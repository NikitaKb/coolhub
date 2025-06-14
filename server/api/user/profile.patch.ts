import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    // TODO: Заменить на реальную авторизацию
    const userId = 1 // временно используем id=1

    // Обновляем профиль пользователя
    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        ...(body.profileImage !== undefined && { profileImage: body.profileImage }),
        ...(body.description !== undefined && { description: body.description })
      }
    })

    return {
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        profileImage: (updatedUser as any).profileImage,
        description: (updatedUser as any).description
      }
    }
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw createError({
      statusCode: 500,
      message: (error as any).message || 'Error updating profile'
    })
  }
}) 