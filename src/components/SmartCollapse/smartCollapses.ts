export type SmartCollapseKey = 'garminInstructions';

type SmartCollapse = {
  key: SmartCollapseKey;
  isDefaultCollapsed: boolean;
};

/**
 * smartCollapses is a list of collapsing sections in the app
 * which "remember" their state from local storage
 */
export const smartCollapses: SmartCollapse[] = [
  {
    key: 'garminInstructions',
    isDefaultCollapsed: true,
  },
];
