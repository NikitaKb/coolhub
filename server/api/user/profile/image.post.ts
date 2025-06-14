import { writeFile } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Проверяем авторизацию через куки
    const userId = getCookie(event, 'user_id')
    
    if (!userId) {
      return {
        success: false,
        message: 'Unauthorized'
      }
    }

    const formData = await readMultipartFormData(event)
    if (!formData) {
      return {
        success: false,
        message: 'No file uploaded'
      }
    }

    const file = formData[0]
    if (!file || !file.type?.startsWith('image/')) {
      return {
        success: false,
        message: 'Invalid file type'
      }
    }

    // Generate unique filename
    const ext = file.filename?.split('.').pop() || 'jpg'
    const filename = `${uuidv4()}.${ext}`
    
    // Save file to public/uploads directory
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    const filepath = join(uploadDir, filename)
    await writeFile(filepath, file.data)

    // Update user profile in database
    await prisma.$executeRaw`
      UPDATE users 
      SET profileImage = ${`/uploads/${filename}`}
      WHERE id = ${parseInt(userId)}
    `

    return {
      success: true,
      imageUrl: `/uploads/${filename}`
    }
  } catch (error) {
    console.error('Error uploading profile image:', error)
    return {
      success: false,
      message: 'Error uploading image'
    }
  }
}) 