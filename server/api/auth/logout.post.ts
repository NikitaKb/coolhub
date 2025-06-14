export default defineEventHandler(async (event) => {
  try {
    // Удаляем cookie с ID пользователя
    deleteCookie(event, 'user_id', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })

    return {
      success: true
    }
  } catch (error) {
    console.error('Error during logout:', error)
    throw createError({
      statusCode: 500,
      message: (error as any).message || 'Error during logout'
    })
  }
}) 