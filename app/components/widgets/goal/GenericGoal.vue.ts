import { Component } from 'vue-property-decorator';
import {
  GenericGoalService,
  IGoalData
} from 'services/widget-settings/generic-goal';
import WidgetEditor from 'components/windows/WidgetEditor.vue';
import WidgetSettings from 'components/widgets/WidgetSettings.vue';

import { inputComponents } from 'components/widgets/inputs';
import VFormGroup from 'components/shared/inputs/VFormGroup.vue';
import { $t } from 'services/i18n';
import ValidatedForm from 'components/shared/inputs/ValidatedForm.vue';
import CodeEditor from '../CodeEditor.vue';
import CustomFieldsEditor from '../CustomFieldsEditor.vue';

interface IGoalCreateOptions {
  title: string;
  goal_amount: number;
  manual_goal_amount: number;
  ends_at: string;
}

@Component({
  components: {
    WidgetEditor,
    VFormGroup,
    ValidatedForm,
    CodeEditor,
    CustomFieldsEditor,
    ...inputComponents
  }
})
export default class GenericGoal extends WidgetSettings<IGoalData, GenericGoalService> {

  $refs: {
    form: ValidatedForm;
  };

  goalCreateOptions: IGoalCreateOptions = {
    title: '',
    goal_amount: 100,
    manual_goal_amount: 0,
    ends_at: ''
  };

  textColorTooltip = $t('A hex code for the base text color.');

  settings = [
    { value: 'goal', label: $t('Goal') },
    { value: 'visual', label: $t('Visual Settings') },
    { value: 'source', label: $t('Source') }
  ];

  get hasGoal() {
    return this.loaded && this.wData.goal && this.wData.goal.title;
  }

  async saveGoal() {
    const hasErrors = await this.$refs.form.validateAndCheckErrors();
    if (hasErrors) return;
    await this.save(this.goalCreateOptions);
  }

}
