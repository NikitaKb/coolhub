import prisma from '~/server/utils/prisma'
import { getCookie, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    // Получить все мероприятия с создателем и участниками
    const events = await prisma.event.findMany({
      include: {
        creator: { select: { id: true, name: true, email: true } },
        participants: { include: { user: { select: { id: true, name: true, email: true } } } }
      },
      orderBy: { date: 'asc' }
    })
    return { success: true, events }
  }

  if (event.method === 'POST') {
    // Создать мероприятие (только для авторизованных)
    const userId = getCookie(event, 'userId')
    if (!userId) return { success: false, message: 'Не авторизован' }
    const body = await readBody(event)
    const { title, description, date, place, contact } = body
    if (!title || !description || !date || !place || !contact) {
      return { success: false, message: 'Все поля обязательны' }
    }
    const eventObj = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        place,
        contact,
        creatorId: Number(userId)
      }
    })
    return { success: true, event: eventObj }
  }

  return { success: false, message: 'Метод не поддерживается' }
}) 