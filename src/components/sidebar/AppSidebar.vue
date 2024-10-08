<template>
  <VaSidebar
    v-model="writableVisible"
    v-if="filteredRoutes.length"
    :width="sidebarWidth"
    :color="color"
    minimized-width="0"
  >
    <VaAccordion v-model="value" multiple>
      <VaCollapse v-for="(route, index) in filteredRoutes" :key="index">
        <template #header="{ value: isCollapsed }">
          <VaSidebarItem
            v-if="vCan.can(route.visible)"
            :to="route.children ? undefined : { name: route.name }"
            :active="routeHasActiveChild(route)"
            :active-color="activeColor"
            :text-color="textColor(route)"
            :aria-label="`${route.children ? 'Open category ' : 'Visit'} ${t(route.displayName)}`"
            role="button"
            hover-opacity="0.10"
          >
            <VaSidebarItemContent class="py-3 pr-2 pl-4">
              <i
                v-if="route.meta.icon"
                :class="route.meta.icon"
                :color="iconColor(route)"
                class="text-lg"
              ></i>
              <VaSidebarItemTitle class="flex justify-between items-center leading-5 font-semibold">
                {{ t(route.displayName) }}
                <VaIcon v-if="route.children" :name="arrowDirection(isCollapsed)" size="20px" />
              </VaSidebarItemTitle>
            </VaSidebarItemContent>
          </VaSidebarItem>
        </template>
        <template v-if="vCan.can(route.visible)" #body>
          <div v-for="(childRoute, index2) in route.children" :key="index2">
            <VaSidebarItem
              :to="{ name: childRoute.name }"
              :active="isActiveChildRoute(childRoute)"
              :active-color="activeColor"
              :text-color="textColor(childRoute)"
              :aria-label="`Visit ${t(route.displayName)}`"
              hover-opacity="0.10"
            >
              <VaSidebarItemContent class="py-3 pr-2 pl-11">
                <VaSidebarItemTitle class="leading-5 font-semibold">
                  {{ t(childRoute.displayName) }}
                </VaSidebarItemTitle>
              </VaSidebarItemContent>
            </VaSidebarItem>
          </div>
        </template>
      </VaCollapse>
    </VaAccordion>
  </VaSidebar>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { authStore } from '../../stores/auth'
import { defineAbilitiesFor } from '../../plugins/ability'
import { useI18n } from 'vue-i18n'
import { useColors } from 'vuestic-ui'
import navigationRoutes, { type INavigationRoute } from './NavigationRoutes'

export default defineComponent({
  name: 'Sidebar',
  props: {
    visible: { type: Boolean, default: true },
    mobile: { type: Boolean, default: false },
  },
  emits: ['update:visible'],
  setup(props, { emit }) {
    const { getColor, colorToRgba } = useColors()
    const route = useRoute()
    const { t } = useI18n()

    const value = ref<boolean[]>([])
    const routes = ref([])

    const writableVisible = computed({
      get: () => props.visible,
      set: (v: boolean) => emit('update:visible', v),
    })

    const isActiveChildRoute = (child: INavigationRoute) => route.name === child.name

    const routeHasActiveChild = (section: INavigationRoute) => {
      if (!section.children) {
        return route.path.endsWith(`${section.name}`)
      }
      return section.children.some(({ name }) => route.path.endsWith(`${name}`))
    }

    const authStorage = authStore()
    const { user } = storeToRefs(authStorage)
    const vCan = defineAbilitiesFor(user?.value)

    const setActiveExpand = () => {
      value.value = navigationRoutes.routes.map((route: INavigationRoute) => routeHasActiveChild(route))
    }

    const sidebarWidth = computed(() => (props.mobile ? '100vw' : '280px'))
    const color = computed(() => getColor('background-secondary'))
    const activeColor = computed(() => colorToRgba(getColor('focus'), 0.1))

    const iconColor = (route: INavigationRoute) => (routeHasActiveChild(route) ? 'primary' : 'secondary')
    const textColor = (route: INavigationRoute) => (routeHasActiveChild(route) ? 'primary' : 'textPrimary')
    const arrowDirection = (state: boolean) => (state ? 'va-arrow-up' : 'va-arrow-down')

    onMounted(() => {
      routes.value = navigationRoutes.routes || []
    })

    const filteredRoutes = computed(() => {
      return routes.value.filter((route) => {
        return route && route.visible !== undefined && vCan.can(route.visible)
      })
    })

    watch(() => route.fullPath, setActiveExpand, { immediate: true })

    return {
      vCan,
      writableVisible,
      sidebarWidth,
      value,
      color,
      activeColor,
      filteredRoutes,
      routeHasActiveChild,
      isActiveChildRoute,
      t,
      iconColor,
      textColor,
      arrowDirection,
    }
  },
})
</script>
