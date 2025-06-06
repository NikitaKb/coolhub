import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (!id) return { success: false, message: 'Некорректный id' }
  const eventObj = await prisma.event.findUnique({
    where: { id },
    include: {
      creator: { select: { id: true, name: true, email: true } },
      participants: { include: { user: { select: { id: true, name: true, email: true } } } }
    }
  })
  if (!eventObj) return { success: false, message: 'Мероприятие не найдено' }
  return { success: true, event: eventObj }
}) 