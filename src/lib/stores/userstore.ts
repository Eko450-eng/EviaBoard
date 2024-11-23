import type { User } from '@/types';
import { writable, type Writable } from 'svelte/store';

export let userStore: Writable<User | undefined> = writable(undefined);
export let isLoggedIn: Writable<boolean> = writable(false);
export let adminModeVal: Writable<boolean> = writable(true);
