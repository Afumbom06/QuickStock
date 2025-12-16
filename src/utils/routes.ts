// Re-export the router from the TSX file so imports using './utils/routes'
// continue to work. Explicitly reference the `.tsx` file to avoid
// accidental resolution to this `.ts` file which would create a cycle.
export { router } from './routes.tsx';