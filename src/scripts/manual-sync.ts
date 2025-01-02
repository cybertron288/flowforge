// src/scripts/manual-sync.ts
import { syncActions } from '../cron/fetch-actions';

syncActions()
    .then(() => console.log('Sync completed'))
    .catch(console.error);