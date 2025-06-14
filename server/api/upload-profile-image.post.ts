import { writeFile } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)
    if (!formData) {
      throw createError({
        statusCode: 400,
        message: 'No form data received'
      })
    }

    const file = formData.find(item => item.name === 'image')
    if (!file) {
      throw createError({
        statusCode: 400,
        message: 'No image file received'
      })
    }

    // Проверяем тип файла
    if (!file.type?.startsWith('image/')) {
      throw createError({
        statusCode: 400,
        message: 'Invalid file type. Only images are allowed'
      })
    }

    // Создаем уникальное имя файла
    const fileExtension = file.filename?.split('.').pop() || 'jpg'
    const fileName = `${randomUUID()}.${fileExtension}`
    
    // Путь для сохранения файла
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'profiles')
    const filePath = join(uploadDir, fileName)

    // Сохраняем файл
    await writeFile(filePath, file.data)

    // Возвращаем URL для доступа к файлу
    return {
      imageUrl: `/uploads/profiles/${fileName}`
    }
  } catch (error: any) {
    console.error('Error uploading profile image:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Error uploading image'
    })
  }
}) 