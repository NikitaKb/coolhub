<template>
  <div class="event-card card">
    <div class="card-img">
      <span class="star" @click="toggleFavorite">&#9734;</span>
    </div>
    <div class="card-title">{{ title }}</div>
    <div class="card-desc">{{ description }}</div>
    <button class="btn" @click="$emit('view')">Смотреть</button>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['view', 'toggle-favorite'])

const toggleFavorite = () => {
  emit('toggle-favorite')
}
</script>

<style scoped>
.event-card {
  background: var(--main-white);
  border-radius: var(--main-radius);
  box-shadow: var(--main-shadow);
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: box-shadow 0.2s, transform 0.2s;
}
.event-card:hover {
  box-shadow: 0 4px 16px #007bff22;
  transform: translateY(-2px) scale(1.01);
}
.card-img {
  aspect-ratio: 16/9;
  background: var(--main-bg);
  border-radius: 8px;
  position: relative;
}
.star {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 24px;
  color: var(--main-blue);
  cursor: pointer;
  transition: color 0.2s;
}
.star:hover {
  color: var(--main-blue-dark);
}
.card-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--main-blue-dark);
  margin-bottom: 0.25rem;
}
.card-desc {
  font-size: 15px;
  color: var(--main-text);
  flex: 1;
}
.btn {
  background: var(--main-blue);
  color: var(--main-white);
  border: none;
  border-radius: var(--main-radius);
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 0.5rem;
}
.btn:hover {
  background: var(--main-blue-dark);
}
</style> 