import { writable } from 'svelte/store'

import json from '$lib/pubPosts.json'
const map = new Map(Object.entries(json))
export const pubPosts = writable(map)

export const privPosts = writable(new Map())
