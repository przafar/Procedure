<template>
  <div class="container mx-auto px-4 sm:px-6 py-6 relative">
    <!-- Check if appointmentInfo is available -->
    <div v-if="appointmentInfo" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Block 1: Patient Information -->
      <div class="col-span-12 lg:col-span-4 bg-white p-4 lg:p-6 rounded-lg shadow-lg">
        <h2 class="text-lg lg:text-2xl font-bold text-gray-800 mb-4 lg:mb-6">{{ $t('patientInfo') }}</h2>
        <div class="space-y-3 lg:space-y-4">
          <div class="bg-gray-50 p-3 lg:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <h3 class="text-sm lg:text-md font-semibold text-gray-700">{{ $t('patientId') }}</h3>
            <p class="text-xs lg:text-sm text-gray-600">{{ appointmentInfo.patient?.id }}</p>
          </div>
          <div class="bg-gray-50 p-3 lg:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <h3 class="text-sm lg:text-md font-semibold text-gray-700">{{ $t('fullName') }}</h3>
            <p class="text-xs lg:text-sm text-gray-600">{{ appointmentInfo.patient?.last_name }} {{ appointmentInfo.patient?.first_name }} {{ appointmentInfo.patient?.middle_name }}</p>
          </div>
          <div class="bg-gray-50 p-3 lg:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <h3 class="text-sm lg:text-md font-semibold text-gray-700">{{ $t('passport') }}</h3>
            <p class="text-xs lg:text-sm text-gray-600">{{ formatIdentifiers(appointmentInfo.patient?.identifier) }}</p>
          </div>
          <div class="bg-gray-50 p-3 lg:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <h3 class="text-sm lg:text-md font-semibold text-gray-700">{{ $t('phoneNumber') }}</h3>
            <p class="text-xs lg:text-sm text-gray-600">{{ appointmentInfo.patient?.phone_number || $t('noPhoneNumber') }}</p>
          </div>
        </div>
      </div>

      <!-- Block 2: Appointment Details -->
      <div class="col-span-12 lg:col-span-8 bg-white p-4 lg:p-6 rounded-lg shadow-lg">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 lg:mb-6">
          <h2 class="text-lg lg:text-2xl font-bold text-gray-800">{{ $t('appointmentDetails') }}</h2>
          <div class="mt-3 sm:mt-0 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div :class="statusClass(appointmentInfo.status)" class="px-3 py-1 rounded-lg text-white font-bold text-xs sm:text-sm">
              {{ formatStatus(appointmentInfo.status) }}
            </div>
            <div class="text-gray-500 text-xs sm:text-sm">
              {{ $t('createdAt') }}: {{ formatDate(appointmentInfo.created_at) }}
            </div>
            <button @click="errorAppointment" class="bg-red-500 text-white px-3 py-1 rounded-lg text-xs sm:text-sm hover:bg-red-600 transition-colors duration-200">
              {{ $t('enteredInError') }}
            </button>
            <button v-if="appointmentInfo.status === 'in-progress'" @click="editAppointment" class="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs sm:text-sm hover:bg-blue-600 transition-colors duration-200">
              {{ $t('edit') }}
            </button>
            <button v-if="appointmentInfo.status === 'in-progress'" @click="endAppointment" class="bg-yellow-500 text-white px-3 py-1 rounded-lg text-xs sm:text-sm hover:bg-yellow-600 transition-colors duration-200">
              {{ $t('endAppointment') }}
            </button>
            <button v-if="appointmentInfo.status === 'draft'" @click="startAppointment" class="bg-green-500 text-white px-3 py-1 rounded-lg text-xs sm:text-sm hover:bg-green-600 transition-colors duration-200">
              {{ $t('startAppointment') }}
            </button>
          </div>
        </div>
        <div class="space-y-3 lg:space-y-4">
          <div class="bg-gray-50 p-3 lg:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <h3 class="text-sm lg:text-md font-semibold text-gray-700">{{ $t('primaryEncounterType') }}</h3>
            <p class="text-xs lg:text-sm text-gray-600">{{ appointmentInfo.encounter_class?.display }}</p>
          </div>
          <!-- Encounter Types Loop -->
          <div v-for="item in appointmentInfo.encounter_types" :key="item.id" class="bg-blue-50 p-3 lg:p-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 lg:w-8 h-5 lg:h-8 text-blue-500">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <h3 class="text-sm lg:text-md font-semibold text-gray-800">{{ item.display }}</h3>
              <p class="text-xs lg:text-sm text-gray-500">Code: {{ item.code }}</p>
            </div>
          </div>
          <div class="bg-gray-50 p-3 lg:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <h3 class="text-sm lg:text-md font-semibold text-gray-700">{{ $t('reason') }}</h3>
            <p class="text-xs lg:text-sm text-gray-600">{{ appointmentInfo.reason_text }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="text-center mt-6">
      <p class="text-gray-500">{{ $t('loadingPatientData') }}</p>
    </div>

    <VaModal
      v-slot="{ cancel, ok }"
      v-model="appointmentVisible"
      size="large"
      mobile-fullscreen
      close-button
      hide-default-actions
      :before-cancel="beforeEditFormModalClose"
    >
      <h1>{{ $t('addService') }}</h1>
      <VaForm v-slot="{ isValid }" ref="add-user-form" class="flex-col justify-start items-start gap-4 inline-flex w-full mt-4">
        <div class="self-stretch flex-col justify-start items-start gap-4 flex">
          <div v-for="item in state.encounterTypesData" class="bg-gray-50 w-full p-4 rounded-lg">
            <div class="flex gap-4 w-full">
              <div class="w-full">
                <VaSelect
                  v-model="item.class.code"
                  :label="$t('primaryEncounterType')"
                  class="w-full"
                  :options="getEncounterClasses"
                  :rules="[validators.required]"
                  text-by="display"
                  value-by="code"
                  disabled
                />
              </div>
            </div>
            <div class="mt-4">
              <div v-for="(c, index) in item.type" class="w-full mb-2 flex flex-col md:flex-row align-center justify-center items-end">
                <VaSelect
                  v-model="c.code"
                  :label="`${$t('encounterType')} #${index + 1}`"
                  class="w-full"
                  :options="item.typesDatas"
                  :rules="[validators.required]"
                  text-by="display"
                  value-by="code"
                />
                <div class="w-full md:w-12 mt-2 md:mt-0 flex justify-end">
                  <button @click="deleteType(index)" class="cursor-pointer">
                    <!-- SVG for delete button -->
                  </button>
                </div>
              </div>
              <div class="flex flex-row justify-end mt-3">
                <button @click="addType" class="bg-green-500 text-white px-3 py-1 rounded-lg text-xs sm:text-sm hover:bg-green-600 transition-colors duration-200">
                  {{ $t('add') }} +
                </button>
              </div>
            </div>
          </div>

          <div class="w-full mb-4">
            <VaTextarea v-model="state.reasonText" :label="$t('reason')" class="w-full" />
          </div>

          <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
            <VaButton preset="secondary" color="secondary" @click="$emit('close')">{{ $t('cancel') }}</VaButton>
            <VaButton :disabled="!isValid" @click="onSave">{{ $t('save') }}</VaButton>
          </div>
        </div>
      </VaForm>
    </VaModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import moment from 'moment';
import { appointmentStore } from '../../stores/appointment';
import { ServicesStore } from '../../stores/services';
import { validators } from '../../services/utils'

const route = useRoute();
const router = useRouter();
const appointmentId = route.params.id;
const appointment = appointmentStore();
const loading = ref(true);
const appointmentInfo = ref(null);
const appointmentVisible = ref(false);
const encounter = ServicesStore();

const getEncounterClasses = computed(() => encounter.getEncounterClasses);


const state = reactive({
  encounterTypesData: [
    {
      class: {
        code: '',
        display: '',
      },
      type: [
        {
          code: null,
          display: '',
          id: '',
        },
      ],
      typesDatas: []
    }
  ],
  reasonText: ''
});


onMounted(async () => {
  await fetchDetails();
});

const fetchDetails = async () => {
  loading.value = true;
  try {
    const response = await appointment.GET_BY_ID(appointmentId);
    appointmentInfo.value = { ...response.data };
  } catch (error) {
    console.error('Failed to fetch patient data:', error);
  } finally {
    loading.value = false;
  }
};

// Function to determine background class for the status badge
const statusClass = (status) => {
  switch (status) {
    case 'draft':
      return 'bg-yellow-500';
    case 'in-process':
      return 'bg-blue-500';
    case 'finished':
      return 'bg-green-500';
    case 'entered-in-error':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

// Function to format status text
const formatStatus = (status) => {
  return status.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

const formatIdentifiers = (identifiers) => {
  if (!identifiers || identifiers.length === 0) return 'No Document';
  return identifiers.map(identifier => `${identifier.display}: ${identifier.value}`).join(', ');
};

// Format birth date and created at
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

// Edit Appointment Function
const editAppointment = async () => {
  appointmentVisible.value = true
  state.encounterTypesData[0].class.code = appointmentInfo.value.encounter_class.code
  state.encounterTypesData[0].class.display = appointmentInfo.value.encounter_class.display
  state.encounterTypesData[0].type = appointmentInfo.value.encounter_types ? appointmentInfo.value.encounter_types : [{ code: '', display: '', id: '' }];
  state.reasonText = appointmentInfo.value.reason_text;
  await encounter.GET_LIST_OF_ECOUNTER_CLASSES();
  await encounter.GET_LIST_OF_ECOUNTER_TYPES(appointmentInfo.value.encounter_class.code).then((response) => {
    state.encounterTypesData[0].typesDatas = response.data.data;
  });
};

const startAppointment = async () => {
  const payload = {
    status: 'in-progress',
  }
  await appointment.UPDATE_STATUS(appointmentId, payload);
  await fetchDetails();
}
const endAppointment = async () => {
  const payload = {
    status: 'finished',
  }
  await appointment.UPDATE_STATUS(appointmentId, payload);
  await fetchDetails();
}
const errorAppointment = async () => {
  const payload = {
    status: 'entered-in-error',
  }
  await appointment.UPDATE_STATUS(appointmentId, payload);
  await fetchDetails();
}

const beforeEditFormModalClose = async (hide: () => unknown) => {
  hide();
};
const addType = () => {
  state.encounterTypesData[0].type.push({
    code: '',
    display: '',
    id: '',
  });
};
const onSave = async () => {
  const encounterTypes = state.encounterTypesData[0].type.map(item => item.code);
  const payload = {
    encounter_types: encounterTypes,
    reason_text: state.reasonText,
    status: 'in-progress'
  };
  console.log(payload, 'payload');
  await appointment.UPDATE(appointmentId, payload);
  await fetchDetails();
};
const deleteType = (index) => {
  state.encounterTypesData[0].type.splice(index, 1);
};

</script>

<style scoped>


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

.bg-blue-50 {
  background-color: #ebf8ff;
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

.status-badge {
  font-size: 0.875rem;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
}

button {
  font-size: 0.875rem;
}

.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.hover\:shadow-lg:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.transition-shadow {
  transition: box-shadow 0.2s;
}
</style>
