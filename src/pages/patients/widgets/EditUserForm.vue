<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { User, UserRole } from '../types'
import { patientStore } from '../../../stores/patient'
import { validators } from '../../../services/utils'
import moment from 'moment'


const props = defineProps({
  user: {
    type: Object as PropType<User | null>,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: 'Saqlash',
  },
})

const defaultNewUser: User = {
  lastname: '',
  firstname: '',
  middlename: '',
  nnuzb: '',
  ppn: '',
  phone: '',
  birthdate: null,
  url: '',
  gender: 'men',
}

const newUser = ref<User>({ ...defaultNewUser })
const store = patientStore()

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
    if (newUserProps) {
      newUser.value = {
        lastname: newUserProps.last_name || '',
        firstname: newUserProps.first_name || '',
        middlename: newUserProps.middle_name || '',
        nnuzb: newUserProps.identifier.find(i => i.code === 'NNUZB')?.value || '',
        ppn: newUserProps.identifier.find(i => i.code === 'PPN')?.value || '',
        phone: newUserProps.phone_number || '',
        birthdate: newUserProps.birth_date || null,
        url: newUserProps.url || '',
        gender: newUserProps.gender || 'men', // Adjust if necessary
      }
    } else {
      newUser.value = { ...defaultNewUser }
    }
  },
  { immediate: true },
)

const form = useForm('add-user-form')

const emit = defineEmits(['close', 'save'])

const onSave = async () => {
  if (form.validate()) {
    const payload = {
      lastName: newUser.value.lastname,
      firstName: newUser.value.firstname,
      middleName: newUser.value.middlename,
      identifier: [
        {
          id: 1,
          code: 'PPN',
          value: newUser.value.ppn,
          system: 'http://fhir.ssv.uz/ValueSet/identifier-type',
          display: 'Серия и номер паспорта',
          parent_id: null,
        },
        {
          id: 2,
          code: 'NNUZB',
          value: newUser.value.nnuzb,
          system: 'http://fhir.ssv.uz/ValueSet/identifier-type',
          display: 'Идентификационный номер гражданина в Республике Узбекистан (ПИНФЛ)',
          parent_id: null,
        },
      ],
      phoneNumber: newUser.value.phone,
      url: newUser.value.url,
      gender: newUser.value.gender === 'men' ? 'male' : 'female',
      birthDate: moment(newUser.value.birthdate).format('YYYY-MM-DDTHH:mm:ssZ'),
    }

    try {
      if (props.user) {
        await store.UPDATE_PATIENT(payload, props.user.id).then(async (response) => {
          if (response.status === 200) {
            const data = await response.data
            emit('save', data)
          } else {
            console.error('Failed to save user data:', response)
          }
        })
      } else {
        await store.CREATE_PATIENT(payload).then(async (response) => {
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

const roleSelectOptions: { text: Capitalize<UserRole>; value: UserRole }[] = [
  { text: 'Erkak', value: 'men' },
  { text: 'Ayol', value: 'female' },
]

</script>


<template>
  <VaForm v-slot="{ isValid }" ref="add-user-form" class="flex-col justify-start items-start gap-4 inline-flex w-full">
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newUser.lastname"
          :label="$t('lastname')"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="lastname"
        />
        <VaInput
          v-model="newUser.firstname"
          :label="$t('firstname')"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="firstname"
        />
        <VaInput v-model="newUser.middlename" :label="$t('middlename')" class="w-full sm:w-1/2" name="middlename" />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput v-model="newUser.nnuzb" :label="$t('pinfl')" class="w-full sm:w-1/2" name="nnuzb" />
        <VaInput v-model="newUser.ppn" :label="$t('passport')" class="w-full sm:w-1/2" name="ppn" />
      </div>

      <div class="flex gap-4 w-full">
        <div class="w-1/2">
          <VaSelect
            v-model="newUser.gender"
            :label="$t('gender')"
            class="w-full"
            :options="roleSelectOptions"
            :rules="[validators.required]"
            name="gender"
            value-by="value"
          />
        </div>
        <VaDateInput
          v-model="newUser.birthdate"
          :label="$t('birthDate')"
          class="w-full"
          name="birthdate"
          manual-input
        />
      </div>

      <VaInput v-model="newUser.phone" :label="$t('phoneNumber')" class="w-full sm:w-1/2" name="phone" />
      <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
        <VaButton preset="secondary" color="secondary" @click="$emit('close')">{{ $t('cancel') }}</VaButton>
        <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
      </div>
    </div>
  </VaForm>
</template>

