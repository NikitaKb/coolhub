import { H3Event, getCookie } from 'h3'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event: H3Event) => {
  const userId = getCookie(event, 'userId')
  if (!userId) {
    return { success: false, message: 'Не авторизован' }
  }
  const user = await prisma.user.findUnique({ 
    where: { id: Number(userId) },
    include: {
      createdEvents: {
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        },
        orderBy: {
          date: 'asc'
        }
      }
    }
  })
  if (!user) {
    return { success: false, message: 'Пользователь не найден' }
  }
  return {
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdEvents: user.createdEvents
    }
  }
}) 