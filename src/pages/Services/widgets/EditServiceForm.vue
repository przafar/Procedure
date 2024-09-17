<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { User, UserRole } from '../types'
import { ServicesStore } from '../../../stores/services'
import { validators } from '../../../services/utils'
import moment from 'moment'


const props = defineProps({
  user: {
    type: Object as PropType<User | null>,
    default: null,
  },
  encounters: {
    type: Array as PropType<User[]>,
    required: true,
  },
  saveButtonLabel: {
    type: String,
    default: 'Saqlash',
  },
})

const defaultNewUser: User = {
  code: '',
  text: ''
}

const newUser = ref<User>({ ...defaultNewUser })
const store = ServicesStore()

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newUser.value).some((key) => {
    if (key === 'avatar' || key === 'projects') {
      return false
    }
    return newUser.value[key as keyof User] !== (props.user ?? defaultNewUser)?.[key as keyof User]
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.user,
  (newUserProps) => {
    console.log(newUserProps, 'newUserProps')
  },
  { immediate: true },
)

const form = useForm('add-user-form')

const emit = defineEmits(['close', 'save'])

const onSave = async () => {
  if (form.validate()) {
    const payload = {
      code: newUser.value.code,
      display: newUser.value.text
    }
    try {
      if (props.user) {
        await store.CREATE_ENCOUNTER_CLASSES(payload, props.user.id).then(async (response) => {
          if (response.status === 200) {
            const data = await response.data
            emit('save', data)
          } else {
            console.error('Failed to save user data:', response)
          }
        })
      } else {
        await store.CREATE_ENCOUNTER_CLASSES(payload).then(async (response) => {
          if (response.status === 201) {
            const data = await response.data
            emit('save', data)
          } else {
            console.error('Failed to save user data:', response)
          }
        })
      }
    } catch (error) {
      console.error('Error during request:', error)
    }
  }
}

</script>


<template>
  <VaForm v-slot="{ isValid }" ref="add-user-form" class="flex-col justify-start items-start gap-4 inline-flex w-full">
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <div class="w-full">
        <div class="flex gap-4 flex-col sm:flex-row w-full mb-2">
          <VaInput v-model="newUser.code" :rules="[validators.required]" :label="'Code'" class="w-full" name="code" />


        </div>
        <div class="w-full">
          <VaInput v-model="newUser.text" :rules="[validators.required]" label="Tekst" class="w-full" name="display" />
        </div>
      </div>


      <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
        <VaButton preset="secondary" color="secondary" @click="$emit('close')">Bekor qilish</VaButton>
        <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
      </div>
    </div>
  </VaForm>
</template>
