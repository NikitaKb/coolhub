<template>
  <footer>
    <div class="footer-desc">
      "ПЛАТФОРМА ДЛЯ ПОИСКА И ОРГАНИЗАЦИИ МЕРОПРИЯТИЙ В КОЛЛЕДЖЕ.<br>
      УЧАСТВУЙ. СОЗДАВАЙ. БУДЬ В КУРСЕ!"
    </div>
    <div class="footer-cols">
      <div>
        <div class="footer-title">Социальные сети</div>
        <div>Telegram: @qwerty</div>
        <div>Вконтакте: @qwerty</div>
      </div>
      <div>
        <div class="footer-title">Контакты</div>
        <div>пл. Гагарина,1, Ростов-на-Дону</div>
        <div>Тел.поддержки: 7-999-999-99-99</div>
        <div>Почта: qwerty@gmail.com</div>
      </div>
      <div>
        <div class="footer-title">Доп.информация</div>
        <div>Правила участия</div>
        <div>Обратная связь</div>
        <div>О проекте</div>
      </div>
    </div>
    <div class="footer-copy">© 2025 College Hub</div>
  </footer>
</template>

<style scoped>
footer {
  background: #f7f9fb;
  padding: 40px 32px;
  margin-top: 60px;
}

.footer-desc {
  text-align: center;
  color: #5a6a7a;
  font-size: 14px;
  margin-bottom: 32px;
}

.footer-cols {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto 32px auto;
}

.footer-title {
  font-weight: 700;
  color: #5a6a7a;
  margin-bottom: 12px;
}

.footer-cols div div:not(.footer-title) {
  color: #8d9db6;
  margin-bottom: 8px;
  font-size: 14px;
}

.footer-copy {
  text-align: center;
  color: #8d9db6;
  font-size: 14px;
}

@media (max-width: 700px) {
  footer {
    padding: 32px 16px;
  }
  
  .footer-cols {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}
</style> 