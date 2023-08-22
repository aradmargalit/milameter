import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { UserPreferences } from '@/models/userPreferences';
import {
  getStoredPreferences,
  removeInvalidUserPrefs,
  storeUserPreferences,
} from '@/storage/userPreferencesLocalStorage';

type UserPrefsContextData = {
  userPrefs: UserPreferences;
};

type UserPrefsContextMethods = {
  updateUserPrefs: (_userPrefs: Partial<UserPreferences>) => void;
};

type UserPrefsContextValue = UserPrefsContextData & UserPrefsContextMethods;

const UserPrefsContext = createContext<UserPrefsContextValue | undefined>(
  undefined
);

const defaultUserPrefs: UserPreferences = {
  mapTheme: 'Satellite',
};

export function UserPrefsProvider({ children }: { children: ReactNode }) {
  // Start with default preferences until we hydrate
  const [userPrefs, setUserPrefs] = useState<UserPreferences>(defaultUserPrefs);

  useEffect(() => {
    removeInvalidUserPrefs();
    const storedPrefs = getStoredPreferences();
    setUserPrefs({
      ...defaultUserPrefs,
      ...storedPrefs,
    });
  }, []);

  function updateUserPrefs(prefs: Partial<UserPreferences>): void {
    const resolvedPrefs = {
      ...userPrefs,
      ...prefs,
    };
    setUserPrefs(resolvedPrefs);
    storeUserPreferences(resolvedPrefs);
  }

  const value: UserPrefsContextValue = {
    updateUserPrefs,
    userPrefs,
  };

  return (
    <UserPrefsContext.Provider value={value}>
      {children}
    </UserPrefsContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserPrefsContext);

  if (!context) {
    throw Error(
      'Cannot use "useUserPreferences" without wrapping this component in a UserPrefsProvider'
    );
  }

  return context;
}
