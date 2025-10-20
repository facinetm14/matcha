import { computed, reactive, ref, watch, onBeforeUnmount, type Ref } from 'vue'

export interface Photo {
  id: string
  file: File
  previewUrl: string
  isPrimary: boolean
}

export interface ProfileModel {
  gender: string | null
  orientation: string | null
  bio: string
  tags: string[]
  photos: Photo[]
}

export interface CompleteProfileFormProps {
  modelValue: ProfileModel
  availableTags?: string[]
  maxPhotos?: number
  bioMax?: number
}

export function CompleteProfileForm(
  props: CompleteProfileFormProps,
  emit: (evt: 'update:modelValue' | 'save' | 'update:availableTags', payload: any) => void
) {
  const bioMax = computed(() => props.bioMax ?? 300)
  const maxPhotos = computed(() => props.maxPhotos ?? 5)

  const isValid = ref<boolean>(true)
  const formRef = ref()

  const genderOptions: string[] = [
    'Woman',
    'Man',
    'Non-binary',
    'Other'
  ] as const

  const orientationOptions: string[] = [
    'Women',
    'Men',
    'Gender non-conforming people',
  ] as const

  // Local editable copy (avoid mutating prop directly)
  const local = reactive<ProfileModel>({
    gender: props.modelValue?.gender ?? null,
    orientation: props.modelValue?.orientation ?? null,
    bio: props.modelValue?.bio ?? '',
    tags: [...(props.modelValue?.tags ?? [])],
    photos: [...(props.modelValue?.photos ?? [])]
  })

  const tagPool: Ref<string[]> = ref([
    ...new Set([...(props.availableTags ?? ['vegan', 'geek', 'piercing', 'travel', 'fitness']), ...(local.tags ?? [])])
  ])

  // File input buffer (File[])
  const fileInput = ref<File[] | null>(null)

  // Validation rules usable by Vuetify components
  const rules = {
    required: (v: unknown) => (!!v ? true : 'Required'),
    maxBio: (v: string) => (v?.length ?? 0) <= bioMax.value || `Max ${bioMax.value} characters`,
    photoLimit: () => local.photos.length <= maxPhotos.value || `Max ${maxPhotos.value} photos`
  }

  // Sync to parent via v-model
  watch(
    () => ({ ...local }),
    (val) => emit('update:modelValue', { ...val }),
    { deep: true }
  )

  // Keep tag suggestions in sync when parent updates them
  watch(
    () => props.availableTags,
    (next) => {
      if (!next) return
      tagPool.value = [...new Set([...(next ?? []), ...(local.tags ?? [])])]
    }
  )

  function onTagsUpdated(tags: Array<string>) {
    const normalized = (tags || [])
      .map((t) => String(t).replace(/^#/, '').trim().toLowerCase())
      .filter(Boolean)
    local.tags = [...new Set(normalized)]
    const before = new Set(tagPool.value)
    const merged = [...new Set([...tagPool.value, ...local.tags])]
    tagPool.value = merged
    const added = merged.filter((t) => !before.has(t))
    if (added.length) emit('update:availableTags', merged)
  }

  function removeTag(tag: string) {
    const key = String(tag).toLowerCase()
    local.tags = local.tags.filter((t) => t.toLowerCase() !== key)
  }

  function onFilesSelected(files: File | File[])  {
    if (!files || !files.length) return
    const remaining = maxPhotos.value - local.photos.length
    const take = Math.max(0, Math.min(remaining, files.length))
    const picked = Array.from(files).slice(0, take)

    const newPhotos: Photo[] = picked.map((f) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file: f,
      previewUrl: URL.createObjectURL(f),
      isPrimary: false
    }))

    local.photos.push(...newPhotos)

    if (!local.photos.some((p) => p.isPrimary) && local.photos.length) {
      local.photos[0].isPrimary = true
    }

    fileInput.value = null
  }

  function removePhoto(idx: number) {
    const [removed] = local.photos.splice(idx, 1)
    if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl)
    if (!local.photos.some((p) => p.isPrimary) && local.photos.length) {
      local.photos[0].isPrimary = true
    }
  }

  function setPrimary(idx: number) {
    local.photos.forEach((p, i) => {
      p.isPrimary = i === idx
    })
  }

  function reset() {
    local.gender = props.modelValue?.gender ?? null
    local.orientation = props.modelValue?.orientation ?? null
    local.bio = props.modelValue?.bio ?? ''
    local.tags = [...(props.modelValue?.tags ?? [])]
    local.photos.forEach((p) => p.previewUrl && URL.revokeObjectURL(p.previewUrl))
    local.photos = [...(props.modelValue?.photos ?? [])]
  }

  function emitSave() {
    // force validation if Vuetify form is present
    ;(formRef.value as any)?.validate?.()
    if (!isValid.value) return
    emit('save', { ...local })
  }

  onBeforeUnmount(() => {
    try {
      local.photos.forEach((p) => p.previewUrl && URL.revokeObjectURL(p.previewUrl))
    } catch {}
  })

  return {
    bioMax,
    maxPhotos,
    isValid,
    formRef,
    genderOptions,
    orientationOptions,
    local,
    tagPool,
    fileInput,
    rules,
    onTagsUpdated,
    removeTag,
    onFilesSelected,
    removePhoto,
    setPrimary,
    reset,
    emitSave
  }
}
