// Re-export the router from the TSX file so imports using './utils/routes'
// continue to work. Explicitly reference the `.tsx` file to avoid
// accidental resolution to this `.ts` file which would create a cycle.
// Re-export the router from the TSX file. Keep the import without extension so
// TypeScript resolves to the proper module without requiring `allowImportingTsExtensions`.
// Re-export the router implementation from the TSX file directly.
export { router } from './routes.tsx';