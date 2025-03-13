// Store the global HabitStore and CohabitServiceImpl instances in Zustand state
// Zustand state is "global", but the global HabitStore doesn't always exist,
// as it is initialized asynchronously. To isolate the initialization
// and do it as early as possible in the app, we provide a non-async `getHabitStore`
// function. When the global HabitStore hasn't been initialized, the app should
// show a loading screen (and no dependent screens should be rendered in the tree).
// Because of this, all dependent screens may assume that the global HabitStore
// instance exists.

import LocalHabitStore, { HabitStore } from "@/utils/habitStore";
import CohabitServiceImpl, { CohabitService } from "@/utils/service";
import { create } from "zustand";

export interface BackendStore {
  server: CohabitService;
  _habits: HabitStore | null;
  getHabitStore(): HabitStore;
  initHabitStore(): Promise<void>;
}

const useBackendStore = create<BackendStore>((set, get) => ({
  server: new CohabitServiceImpl(),
  _habits: null,
  getHabitStore() {
    let store = get()._habits;
    if (store === null)
      throw new RangeError("Programming error: Global habit store dependency found it uninitialized. The dependency should not be have been rendered!");
    return store;
  },
  async initHabitStore() {
    const store = await LocalHabitStore.init(get().server);
    set(() => ({ _habits: store }));
  },
}));

export function isStoreInitialized(store: BackendStore): boolean {
  return store._habits !== null;
}

export default useBackendStore;