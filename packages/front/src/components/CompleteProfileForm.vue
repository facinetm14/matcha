<template>
  <v-card class="pa-6" rounded="xl" elevation="2">
    <v-card-title class="text-h5 font-bold pb-4">Profile</v-card-title>

    <v-form ref="formRef" v-model="isValid" @submit.prevent>
      <v-row dense>
        <!-- Gender -->
        <v-col cols="12" md="6">
          <v-select label="Gender" :items="genderOptions" v-model="local.gender" :rules="[rules.required]"
            variant="outlined" clearable />
        </v-col>

        <!-- Orientation -->
        <v-col cols="12" md="6">
          <div class="text-subtitle-1 mb-2">I'm interested in…</div>
          <div class="d-flex flex-column">
            <v-checkbox />
          </div>
        </v-col>

        <!-- Biography -->
        <v-col cols="12">
          <v-textarea label="Biography" v-model="local.bio" :rules="[rules.maxBio]" :counter="bioMax" auto-grow rows="3"
            variant="outlined" clearable />
        </v-col>

        <!-- Interests (Reusable Tags) -->
        <v-col cols="12">
          <v-combobox v-model="local.tags" :items="tagPool" label="Interests (add with Enter)" multiple chips
            closable-chips clearable hide-selected variant="outlined" :menu-props="{ maxHeight: 300 }"
            @update:model-value="onTagsUpdated">
            <template #selection="{ item }">
              <v-chip class="ma-1" closable @click:close="removeTag(item.raw)">
                #{{ item.raw }}
              </v-chip>
            </template>
            <template #item="{ item }">
              <div class="d-flex align-center ga-2 px-2 py-1">
                <v-icon size="18">mdi-pound</v-icon>
                <span>#{{ item.raw }}</span>
              </div>
            </template>
          </v-combobox>
          <div class="text-caption text-medium-emphasis mt-1">
            Suggestions are saved for reuse. New tags you add will appear next time.
          </div>
        </v-col>

        <!-- Photos -->
        <v-col cols="12">
          <v-file-input label="Upload photos (up to 5)" prepend-icon="mdi-image-plus" accept="image/*" multiple
            show-size counter :counter-size="maxPhotos" v-model="fileInput" :rules="[rules.photoLimit]"
            variant="outlined" clearable @update:model-value="onFilesSelected" />
        </v-col>

        <v-col cols="12" v-if="local.photos.length">
          <div class="text-subtitle-1 font-medium mb-2">Your photos</div>
          <v-row dense>
            <v-col v-for="(p, idx) in local.photos" :key="p.id" cols="12" sm="6" md="4" lg="3">
              <v-card rounded="xl" class="overflow-hidden">
                <v-img :src="p.previewUrl" height="200" cover />
                <v-card-actions class="justify-space-between">
                  <v-btn size="small" :variant="p.isPrimary ? 'flat' : 'text'"
                    :color="p.isPrimary ? 'primary' : undefined" @click="setPrimary(idx)">{{ p.isPrimary ? 'Profile photo' : 'Set as profile' }}</v-btn>
                  <v-btn icon="mdi-delete" variant="text" @click="removePhoto(idx)" />
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-form>

    <v-divider class="my-4" />

    <v-card-actions class="justify-end">
      <v-btn variant="text" @click="reset">Reset</v-btn>
      <v-btn color="primary" @click="emitSave" :disabled="!isValid">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { CompleteProfileForm, type ProfileModel } from './CompleteProfileForm.ts'
import { computed } from 'vue'

const props = defineProps<{
  modelValue: ProfileModel
  availableTags?: string[]
  maxPhotos?: number
  bioMax?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: ProfileModel): void
  (e: 'save', value: ProfileModel): void
  (e: 'update:availableTags', value: string[]): void
}>()

const {
  local,
  tagPool,
  fileInput,
  isValid,
  formRef,
  genderOptions,
  orientationOptions,
  rules,
  onTagsUpdated,
  removeTag,
  onFilesSelected,
  removePhoto,
  setPrimary,
  reset,
  emitSave
} = CompleteProfileForm(props, emit as (evt: "update:modelValue" | "save" | "update:availableTags", payload: any) => void)

const bioMax = computed(() => props.bioMax ?? 300)
const maxPhotos = computed(() => props.maxPhotos ?? 5)
</script>

<style scoped>
.v-chip { border-radius: 999px; }
</style>


