<template>
  <CompleteProfileForm v-model="profile"
    :available-tags="tagSuggestions"
    @save="onSave"
    @update:availableTags="tagSuggestions = $event"
  />
</template>

<script setup>
import { ref } from 'vue'
import CompleteProfileForm from '../components/CompleteProfileForm.vue'

const profile = ref({
  gender: null,
  orientation: null,
  bio: '',
  tags: [],
  photos: [] // will be [{ id, file, previewUrl, isPrimary }]
})

const tagSuggestions = ref(['vegan', 'geek', 'piercing'])

function onSave(payload) {
  // e.g., upload `payload.photos[i].file` to your backend
  console.log('to-save:', payload)
}
</script>
