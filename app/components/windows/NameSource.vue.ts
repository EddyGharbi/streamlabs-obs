import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Inject } from '../../util/injector';
import ModalLayout from '../ModalLayout.vue';
import { WindowsService } from '../../services/windows';
import windowMixin from '../mixins/window';
import { IScenesServiceApi } from '../../services/scenes';
import { ISourcesServiceApi, TSourceType} from '../../services/sources';
import { WidgetsService, WidgetDefinitions, WidgetType } from '../../services/widgets';

@Component({
  components: { ModalLayout },
  mixins: [windowMixin]
})
export default class NameSource extends Vue {

  @Inject()
  sourcesService: ISourcesServiceApi;

  @Inject()
  scenesService: IScenesServiceApi;

  @Inject()
  widgetsService: WidgetsService;

  @Inject()
  windowsService: WindowsService;

  options: {
    sourceType?: TSourceType,
    widgetType?: string,
    rename?: string
  }  = this.windowsService.getChildWindowQueryParams();

  name = this.options.rename || '';
  error = '';

  mounted() {
    const sourceType =
      this.sourceType &&
      this.sourcesService.getAvailableSourcesTypesList()
        .find(sourceTypeDef => sourceTypeDef.value === this.sourceType);

    this.name = this.sourcesService.suggestName(
      (this.sourceType && sourceType.description) || WidgetDefinitions[this.widgetType].name
    );
  }

  submit() {
    if (this.isTaken(this.name)) {
      this.error = 'That name is already taken';
    } else if (this.options.rename) {
      this.sourcesService.getSourceByName(this.options.rename).setName(this.name);
      this.windowsService.closeChildWindow();
    } else {
      let sourceId: string;

      if (this.sourceType != null) {
        sourceId = this.scenesService.activeScene.createAndAddSource(
          this.name,
          this.sourceType
        ).sourceId;
      } else if (this.widgetType != null) {
        sourceId = this.widgetsService.createWidget(
          this.widgetType,
          this.name
        ).sourceId;
      }

      this.sourcesService.showSourceProperties(sourceId);
    }
  }

  isTaken(name: string) {
    return this.sourcesService.getSourceByName(name);
  }

  get sourceType(): TSourceType {
    return this.options.sourceType;
  }

  get widgetType(): WidgetType {
    return parseInt(this.options.widgetType) as WidgetType;
  }

}