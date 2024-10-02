<template>
  <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between mb-4">
    <VaButton @click="showAddUserModal">{{ $t('addPatient') }}</VaButton>
  </div>
  <VaCard>
    <VaCardContent>
      <div class="grid gap-4 grid-cols-4 mb-4">
        <div class="w-full">
          <VaInput v-model="formValues.lastname" :label="$t('lastname')" :placeholder="$t('lastname')" />
        </div>
        <div class="w-full">
          <VaInput v-model="formValues.firstname" :label="$t('firstname')" :placeholder="$t('firstname')" />
        </div>
        <div class="w-full">
          <VaInput v-model="formValues.middlename" :label="$t('middlename')" :placeholder="$t('middlename')" />
        </div>
        <div>
          <VaSelect
            v-model="formValues.gender"
            :label="$t('gender')"
            class="w-full"
            :options="roleSelectOptions"
            name="gender"
            value-by="value"
            clearable
          />
        </div>
        <div>
          <VaButton color="warning" @click="filterPatients">{{ $t('filter') }}</VaButton>
        </div>
      </div>

      <PatientsTable
        :users="users"
        :loading="isLoading"
        :pagination="pagination"
        @update:current_page="updateCurrentPage"
        @editUser="showEditUserModal"
        @deleteUser="onUserDelete"
      />
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowEditUserModal"
    size="large"
    mobile-fullscreen
    close-button
    hide-default-actions
  >
    <h1 class="va-h5">{{ userToEdit ? 'Tahrirlash' : 'Bemor qo`shish' }}</h1>
    <EditUserForm
      ref="editFormRef"
      :user="userToEdit"
      :save-button-label="userToEdit ? 'Saqlash' : 'Qo`shish'"
      @close="cancel"
      @save="
        (user) => {
          onUserSaved(user)
          ok()
        }
      "
    />
  </VaModal>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PatientsTable from './widgets/PatientsTable.vue'
import EditUserForm from './widgets/EditUserForm.vue'
import { User, UserRole } from './types'
import { useUsers } from './composables/useUsers'
import { useToast } from 'vuestic-ui'

const doShowEditUserModal = ref(false)
const userToEdit = ref<User | null>(null)

const { users, isLoading, filters, pagination, fetch, searchFetch, ...usersApi } = useUsers()

const { init: notify } = useToast()

const router = useRouter()
const route = useRoute()


const roleSelectOptions: { text: Capitalize<UserRole>; value: UserRole }[] = [
  { text: 'Erkak', value: '1' },
  { text: 'Ayol', value: '2' },
]
const formValues = ref({
  firstname: '',
  lastname: '',
  middlename: '',
  gender: null,
})

const initializeFormValuesFromRoute = () => {
  const query = route.query
  formValues.value.firstname = query.firstname || ''
  formValues.value.lastname = query.lastname || ''
  formValues.value.middlename = query.middlename || ''
  formValues.value.gender = query.gender || null
}

const filterPatients = () => {
  filters.value.firstname = formValues.value.firstname
  filters.value.lastname = formValues.value.lastname
  filters.value.middlename = formValues.value.middlename
  filters.value.gender = formValues.value.gender

  router.push({
    query: {
      ...route.query,
      page: 1,
      firstname: formValues.value.firstname || undefined,
      lastname: formValues.value.lastname || undefined,
      middlename: formValues.value.middlename || undefined,
      gender: formValues.value.gender || undefined,
    },
  })

  searchFetch()
}

onMounted(() => {
  initializeFormValuesFromRoute()
})

const updateCurrentPage = (page) => {
  pagination.current_page = page;
  fetch();
}

const showEditUserModal = (user: User) => {
  userToEdit.value = user
  doShowEditUserModal.value = true
}

const showAddUserModal = () => {
  userToEdit.value = null
  doShowEditUserModal.value = true
}

const onUserSaved = async (user: User) => {
  console.log(userToEdit.value, 'reee')
  if (userToEdit.value) {
    await fetch();
    notify({
      message: `${user.fullname} has been updated`,
      color: 'success',
    })
  } else {
    await fetch();
    notify({
      message: `${user.fullname} has been created`,
      color: 'success',
    })
  }
}

const onUserDelete = async (user: User) => {
  await usersApi.remove(user)
  notify({
    message: `${user.fullname} has been deleted`,
    color: 'success',
  })
}
</script>
