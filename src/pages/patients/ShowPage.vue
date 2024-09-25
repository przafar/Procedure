<template>
  <div class="container w-full px-2 sm:px-4 custom-h-screen">
    <!-- Top left button -->
    <div class="flex justify-start mb-4">
      <button @click="appointmentModalView" class="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600">
        {{ $t('createAppointment') }}
      </button>
    </div>

    <!-- Patient Details -->
    <div v-if="patient" class="grid grid-cols-1 md:grid-cols-12 gap-6 w-full h-auto">
      <!-- Block 1: Patient Information -->
      <div class="col-span-12 md:col-span-4 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg info-block">
        <h2 class="text-lg sm:text-xl font-semibold mb-4">{{ $t('patientInfo') }}</h2>
        <div class="space-y-2">
          <div class="bg-white p-3 rounded-lg shadow-sm">
            <h3 class="text-md font-semibold">{{ $t('patientId') }}</h3>
            <p class="text-gray-700 text-sm">{{ patient.id }}</p>
          </div>
          <div class="bg-white p-3 rounded-lg shadow-sm">
            <h3 class="text-md font-semibold">{{ $t('fullName') }}</h3>
            <p class="text-gray-700 text-sm">{{ patient.full_name }}</p>
          </div>
          <div class="bg-white p-3 rounded-lg shadow-sm">
            <h3 class="text-md font-semibold">{{ $t('passport') }}</h3>
            <p class="text-gray-700 text-sm">{{ formatIdentifiers(patient.identifier) }}</p>
          </div>
          <div class="bg-white p-3 rounded-lg shadow-sm">
            <h3 class="text-md font-semibold">{{ $t('birthDate') }}</h3>
            <p class="text-gray-700 text-sm">{{ formatDate(patient.birth_date) }}</p>
          </div>
          <div class="bg-white p-3 rounded-lg shadow-sm">
            <h3 class="text-md font-semibold">{{ $t('phoneNumber') }}</h3>
            <p class="text-gray-700 text-sm">{{ patient.phone_number || $t('noPhoneNumber') }}</p>
          </div>
          <div class="bg-white p-3 rounded-lg shadow-sm">
            <h3 class="text-md font-semibold">{{ $t('gender') }}</h3>
            <p class="text-gray-700 text-sm">{{ patient.gender === '1' ? $t('male') : $t('female') }}</p>
          </div>
        </div>
      </div>

      <!-- Block 2: Patient History -->
      <div class="col-span-12 md:col-span-8 bg-white rounded-lg shadow-lg history-block custom-h-screen-minus-300">
        <h2 class="text-lg sm:text-xl font-semibold sticky top-0 bg-white z-10 pt-4 sm:pt-6 px-4 sm:px-6">
          {{ $t('appointments') }}
        </h2>

        <div class="p-4 sm:p-6" v-if="state.appointments.length > 0">
          <ul class="space-y-4">
            <li
              v-for="(item, index) in state.appointments"
              :key="item.id"
              class="relative p-4 rounded-lg shadow-sm transition-colors bg-gray-50"
            >
              <!-- Status badge -->
              <span
                class="absolute right-2 top-2 px-3 py-1 rounded-full text-sm font-bold shadow-sm"
                :class="statusClass(item.status)"
              >
                {{ $t(item.status) }}
              </span>
              <router-link :to="{ name: 'appointment-show', params: { id: item.id } }" class="block">
                <h4 class="font-bold text-gray-700">{{ $t('appointment') }} #{{ index + 1 }}</h4>
              </router-link>
              <p class="text-gray-600">{{ $t('createdAt') }}: {{ formatData(item.created_at) }}</p>
              <p class="text-gray-600">{{ $t('direction') }}: <b>{{ item.encounter_class.code }}</b> {{ item.encounter_class.display }}</p>
              <p class="text-gray-600">{{ $t('appointmentType') }}: {{ item.encounter_type.display }}</p>
              <p class="text-gray-600">{{ $t('note') }}: {{ item.reason_text }}</p>
            </li>
          </ul>
        </div>
        <div class="p-5" v-else>
          <p class="text-gray-500">{{ $t('noAppointments') }}</p>
        </div>



      </div>
    </div>

    <div v-else class="text-center">
      <p class="text-gray-500">{{ $t('loadingPatientData') }}</p>
    </div>

    <!-- Modal for creating an appointment -->
    <VaModal
      v-slot="{ cancel, ok }"
      v-model="appointmentVisible"
      size="medium"
      mobile-fullscreen
      close-button
      hide-default-actions
      :before-cancel="beforeEditFormModalClose"
    >
      <h1>{{ $t('createAppointment') }}</h1>
      <div class="flex flex-col gap-4 w-full mt-4">
        <VaForm v-slot="{ isValid }" ref="add-appointment-form" class="flex-col justify-start items-start gap-4 inline-flex w-full">
          <div class="w-full">
            <VaSelect
              v-model="state.newAppointment.role"
              class="w-full"
              :rules="[validators.required, isEmptyValidator]"
              :options="getEncounterClasses"
              text-by="display"
              value-by="code"
            >
              <template #label>
                <span>{{ $t('selectDirection') }}</span><span class="ml-1 text-red-500">*</span>
              </template>
            </VaSelect>
          </div>
          <div class="w-full">
            <VaTextarea :label="$t('note')" v-model="state.newAppointment.text" class="w-full" />
          </div>
          <div class="w-full flex justify-end">
            <VaButton :disabled="!isValid" @click="onSave">{{ $t('create') }}</VaButton>
          </div>
        </VaForm>
      </div>
    </VaModal>
  </div>
</template>


<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import moment from 'moment';
import { patientStore } from '../../stores/patient';
import { ServicesStore } from '../../stores/services';
import { appointmentStore } from '../../stores/appointment';
import { validators } from '../../services/utils'
import { useForm } from 'vuestic-ui'

const route = useRoute();
const patientId = route.params.id;
const store = patientStore();
const encounter = ServicesStore();
const appointment = appointmentStore();

const patient = ref(null);
const loading = ref(true);
const appointmentVisible = ref(false);

const getEncounterClasses = computed(() => encounter.getEncounterClasses);
const getEncounterTypes = computed(() => encounter.getEncounterTypes);

const state = reactive({
  newAppointment: {
    role: null,
    type: '',
    text: ''
  },
  appointments: [],
});
const form = useForm('add-appointment-form')

watch(() => state.newAppointment.role, async (newRoleCode) => {
  if (newRoleCode) {
    try {
      await encounter.GET_LIST_OF_ECOUNTER_TYPES(newRoleCode);
    } catch (error) {
      console.error('Failed to fetch encounter types:', error);
    }
  }
});

const fetchDetails = async () => {
  loading.value = true;
  try {
    const params = {
      patient_id: patientId,
      page: 1,
      per_page: 10
    };
    const response = await store.GET_BY_ID(patientId);
    const appointments = await appointment.GET_LIST_OF_APPOINTMENTS(params);
    patient.value = {
      ...response,
      full_name: `${response.last_name} ${response.first_name} ${response.middle_name}`
    };
    state.appointments = appointments.data.data;
  } catch (error) {
    console.error('Failed to fetch patient data:', error);
  } finally {
    loading.value = false;
  }
};

const formatIdentifiers = (identifiers) => {
  if (!identifiers || identifiers.length === 0) return 'No Document';
  return identifiers.map(identifier => `${identifier.display}: ${identifier.value}`).join(', ');
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const appointmentModalView = async () => {
  appointmentVisible.value = true;
  await encounter.GET_LIST_OF_ECOUNTER_CLASSES();
};

const beforeEditFormModalClose = async (hide: () => unknown) => {
  hide();
};

const formatData = (date) => {
  return moment(date).format('DD-MM-YYYY HH:mm');
};

const statusClass = (status) => {
  switch (status) {
    case 'in-progress':
      return 'bg-yellow-300 text-yellow-900';
    case 'completed':
      return 'bg-green-300 text-green-900';
    case 'canceled':
      return 'bg-red-300 text-red-900';
    case 'draft':
      return 'bg-gray-300 text-gray-900';
    default:
      return 'bg-gray-200 text-gray-700';
  }
};

const onSave = async () => {
  if (form.validate()) {
    const payload = {
      patient_id: patientId,
      encounter_class: state.newAppointment.role,
      reason_text: state.newAppointment.text
    };
    await appointment.CREATE_APPOINTMENT(payload);
    await fetchDetails();
    appointmentVisible.value = false;
  }
};

onMounted(async () => {
  await fetchDetails();
});
const isEmptyValidator = (value: string) => {
  if (!value || value.length !== 1) {
    return 'Поле не должно быть пустым'
  }
  return true
}
</script>

<style scoped>
html, body {
  padding: 0;
  margin: 0;
}

.container {
  max-width: 100%;
  padding: 0;
}

.bg-white {
  background-color: #fff;
}

.bg-gray-50 {
  background-color: #f9fafb;
}

.bg-gray-100 {
  background-color: #f7fafc;
}

.shadow-sm {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.shadow-lg {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.text-center {
  text-align: center;
}

.text-gray-700 {
  color: #4a4a4a;
}

.text-gray-600 {
  color: #718096;
}

.text-gray-500 {
  color: #a0aec0;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

.status-badge {
  font-size: 0.875rem;
  font-weight: bold;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px; /* Fully rounded */
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
}

.overflow-auto {
  overflow: auto;
}

.custom-h-screen {
  height: auto;
}

.custom-h-screen-minus-300 {
  height: auto;
  overflow: auto;
}

@media (min-width: 768px) {
  .custom-h-screen {
    height: 100vh;
  }

  .custom-h-screen-minus-300 {
    height: calc(100vh - 200px);
    overflow: auto;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }
}

</style>
