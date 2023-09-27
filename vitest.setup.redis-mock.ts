import { vitest } from 'vitest'

vitest.mock('redis', () => vitest.importActual('redis-mock'))
