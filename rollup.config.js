// Import required Rollup plugins
import resolve from '@rollup/plugin-node-resolve' // Resolves node modules in node_modules
import commonjs from '@rollup/plugin-commonjs' // Converts CommonJS modules to ES6 for Rollup
import terser from '@rollup/plugin-terser' // Minifies the output bundle
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve as resolvePath } from 'path'

// Set up file paths for ESM compatibility
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Read package.json for version and other metadata
const pkg = JSON.parse(
  readFileSync(resolvePath(__dirname, './package.json'), 'utf8')
)

// Create a banner comment for the output files
const banner = `/*!
  * ${pkg.name} v${pkg.version}
  * (c) ${new Date().getFullYear()} ${pkg.author}
  * Released under the ${pkg.license} License
  */`

// List of external dependencies that should not be bundled
const external = ['axios', 'query-string']

// Main Rollup configuration
export default {
  // Entry point for the bundle
  input: 'src/index.js',

  // Dependencies that should not be included in the bundle
  external,

  // Output configurations for different formats
  output: [
    {
      // ES Module format for modern environments
      file: pkg.main,
      format: 'es', // Output format
      exports: 'named', // Export named exports
      banner, // Add banner comment to the output
      sourcemap: true // Generate source maps for debugging
    },
    {
      // UMD (Universal Module Definition) format for browser and Node.js
      file: pkg.unpkg,
      format: 'umd', // Output format
      name: 'AxiosCancelable', // Global variable name for UMD
      exports: 'named', // Export named exports
      globals: {
        // Map external dependencies to global variables
        axios: 'axios',
        'query-string': 'queryString'
      },
      banner, // Add banner comment to the output
      sourcemap: true // Generate source maps for debugging
    }
  ],

  // Plugins to transform the code
  plugins: [
    // Resolve node modules
    resolve({
      browser: true, // Prefer browser versions of modules
      preferBuiltins: false // Don't prefer Node.js built-in modules
    }),

    // Convert CommonJS modules to ES6
    commonjs(),

    // Minify the output
    terser({
      format: {
        comments: false // Remove comments from the output
      }
    })
  ]
}
