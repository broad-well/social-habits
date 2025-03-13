import { resolveConflict } from "@/utils/conflict";

describe('resolveConflict', () => {
  it("recognizes new habits to upload", async () => {
    const actions = await resolveConflict(
      new Set(['1', '2']), // Local
      new Set(['1']),      // Remote
      async () => ({}), // No remote removals
      async () => null, // No local removals
    );
    expect(actions.upload).toEqual(new Set(['2']));
    expect(actions.download.size).toBe(0);
    expect(actions.deleteLocal.size).toBe(0);
    expect(actions.deleteRemote.size).toBe(0);
  });
  
  it("recognizes new habits to download", async () => {
    const actions = await resolveConflict(
      new Set(['1', '2']),      // Local
      new Set(['1', '2', '0']), // Remote
      async () => ({}), // No remote removals
      async () => null, // No local removals
    );
    expect(actions.upload.size).toBe(0);
    expect(actions.download).toEqual(new Set(['0']));
    expect(actions.deleteLocal.size).toBe(0);
    expect(actions.deleteRemote.size).toBe(0);
  });

  it("recognizes uploads and downloads simultaneously", async () => {
    const actions = await resolveConflict(
      new Set(['1', '2']), // Local
      new Set(['1', '3']), // Remote
      async () => ({}), // No remote removals
      async () => null, // No local removals
    );
    expect(actions.upload).toEqual(new Set(['2']));
    expect(actions.download).toEqual(new Set(['3']));
    expect(actions.deleteLocal.size).toBe(0);
    expect(actions.deleteRemote.size).toBe(0);
  });

  it("deletes-remote instead of downloads if locally deleted", async () => {
    const actions = await resolveConflict(
      new Set(['1', '2']), // Local
      new Set(['1', '3']), // Remote
      async () => ({}), // No remote removals
      async (id) => id === '3' ? new Date() : null,
    );
    expect(actions.upload).toEqual(new Set(['2']));
    expect(actions.download.size).toBe(0);
    expect(actions.deleteLocal.size).toBe(0);
    expect(actions.deleteRemote).toEqual(new Set(['3']));
  });

  it("deletes-local instead of uploads if remote deleted", async () => {
    const actions = await resolveConflict(
      new Set(['1', '2']), // Local
      new Set(['1', '3']), // Remote
      async () => ({ '2': new Date() }), // Remote
      async () => null,  // Local
    );
    expect(actions.upload.size).toBe(0);
    expect(actions.download).toEqual(new Set(['3']));
    expect(actions.deleteLocal).toEqual(new Set(['2']));
    expect(actions.deleteRemote.size).toBe(0);
  });
});