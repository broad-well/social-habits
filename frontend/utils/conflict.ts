
export interface ConflictActionSet {
  upload: Set<string>;
  download: Set<string>;
  deleteRemote: Set<string>;
  deleteLocal: Set<string>;
}

// All items in a that are not in b
// This function is necessary here because Set.difference may not be available
// in the React Native JS runtime. It was not the case on iOS.
export function setDifference<T>(a: Set<T>, b: Set<T>): Set<T> {
  const out = new Set<T>();
  for (const item of a) {
    if (!b.has(item)) {
      out.add(item);
    }
  }
  return out;
}

export async function resolveConflict(
  localSet: Set<string>,
  remoteSet: Set<string>,
  getRemoteRemovedHabits: (localIds: Set<string>) => Promise<{[id: string]: Date}>,
  getLocalRemoved: (id: string) => Promise<Date | null>,
): Promise<ConflictActionSet> {
  const onlyLocalIds = setDifference(localSet, remoteSet);
  const onlyRemoteIds = setDifference(remoteSet, localSet);
  const remoteRemovals = onlyLocalIds.size === 0 ?
    {} : await getRemoteRemovedHabits(onlyLocalIds);
  const actions: ConflictActionSet = {
    upload: new Set(),
    download: new Set(),
    deleteRemote: new Set(),
    deleteLocal: new Set(),
  };

  for (const localId of onlyLocalIds) {
    if (remoteRemovals[localId] === undefined) {
      actions.upload.add(localId);
    } else {
      actions.deleteLocal.add(localId);
    }
  }

  for (const remoteId of onlyRemoteIds) {
    const localTombstone = await getLocalRemoved(remoteId);
    if (localTombstone === null) {
      actions.download.add(remoteId);
    } else {
      actions.deleteRemote.add(remoteId);
    }
  }

  return actions;
}