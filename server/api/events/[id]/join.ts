import prisma from '~/server/utils/prisma'
import { getCookie } from 'h3'

export default defineEventHandler(async (event) => {
  if (!event.context.params?.id) return { success: false, message: 'Некорректный id' }
  const id = Number(event.context.params.id)
  if (!id) return { success: false, message: 'Некорректный id' }
  const userId = getCookie(event, 'userId')
  if (!userId) return { success: false, message: 'Не авторизован' }

  // Проверяем, не вступил ли уже
  const exists = await prisma.eventParticipant.findUnique({
    where: { eventId_userId: { eventId: id, userId: Number(userId) } }
  })
  if (exists) return { success: false, message: 'Вы уже участник' }

  await prisma.eventParticipant.create({
    data: { eventId: id, userId: Number(userId) }
  })
  return { success: true, message: 'Вы успешно вступили в мероприятие' }
}) 