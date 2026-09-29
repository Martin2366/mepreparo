/** Vista web (solo diseño): sin notificaciones. */
export const hasPermission = async () => false;
export const syncReminders = async (_opts: { on: boolean; time: string; activeToday: boolean; trialEndsAt?: Date }) => undefined;
export const maybeAskForReminder = (_reminder?: { on: boolean; time: string }, _onGranted?: () => void) => undefined;
