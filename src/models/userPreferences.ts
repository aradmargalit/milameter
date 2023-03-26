import { MapStyle } from '@/components/MapboxMap/mapStyles';
import { SmartCollapseKey } from '@/components/SmartCollapse/smartCollapses';

export type UserPreferences = {
  mapTheme: MapStyle;
  collapsedSections: Record<SmartCollapseKey, boolean>;
};
