import { Ability, AbilityBuilder } from '@casl/ability';

/**
 * @param user содержит информацию о вошедшем пользователе: его id, fullname, role и т.д.
 */

export function defineAbilitiesFor(user) {
  const { can, cannot, rules } = new AbilityBuilder(Ability);

  // Проверяем роль пользователя
  const role = user?.role;

  if (role) {
    switch (role) {
      case 'super_admin':
        can('dashboard_index');
        can('services_index');
        can('practitioner_index');
        can('patients_index');
        can('appointments_index');
        can('projects_index');
        can('settings_index');
        can('preferences_index');
        break;
      case 'owner':
        can('dashboard_index');
        can('services_index');
        can('practitioner_index');
        can('patients_index');
        can('appointments_index');
        can('projects_index');
        can('settings_index');
        can('preferences_index');
        break;

      case 'reception':
        can('dashboard_index');
        can('services_index');
        can('patients_index');
        can('patients_create');
        can('patients_show');
        can('patients_edit');
        can('appointments_index');
        can('appointments_create');
        can('appointments_show');
        can('settings_index');
        can('preferences_index');
        break;

      case 'pediatric_therapeutic_dentistry':
        can('patients_index');
        can('patients_show');
        can('appointments_index');
        can('appointments_create');
        can('appointments_show');
        can('appointments_edit');
        can('settings_index');
        can('preferences_index');
        break;

      case 'surgical_dentistry':
        can('patients_index');
        can('patients_show');
        can('appointments_index');
        can('appointments_create');
        can('appointments_show');
        can('appointments_edit');
        can('settings_index');
        can('preferences_index');
        break;

      case 'ent_specialist':
        can('patients_index');
        can('patients_show');
        can('appointments_index');
        can('appointments_create');
        can('appointments_show');
        can('appointments_edit');
        can('settings_index');
        can('preferences_index');
        break;

      case 'orthopedic_dentistry':
        can('patients_index');
        can('patients_show');
        can('appointments_index');
        can('appointments_create');
        can('appointments_show');
        can('appointments_edit');
        can('settings_index');
        can('preferences_index');
        break;

      case 'therapeutic_dentistry':
        can('patients_index');
        can('patients_show');
        can('appointments_index');
        can('appointments_create');
        can('appointments_show');
        can('appointments_edit');
        can('settings_index');
        can('preferences_index');
        break;

      case 'procedural_specialist':
        can('patients_index');
        can('patients_show');
        can('appointments_index');
        can('appointments_create');
        can('appointments_show');
        can('appointments_edit');
        can('settings_index');
        can('preferences_index');
        break;

    }
  } else {
    can('logout'); // Если роль не найдена, можно только выйти из системы
  }

  return new Ability(rules);
}
