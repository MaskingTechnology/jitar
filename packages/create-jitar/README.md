
# Create Jitar

The Create Jitar package provides a command line tool to create a new Jitar application.

## Usage

With npm:

```bash
npm create jitar@latest
```

With yarn:

```bash
yarn create jitar
```

With pnpm:

```bash
pnpm create jitar
```

The tool will ask you a few questions and then create a new Jitar application in the current directory.

## Development

To use Vite for development jitar needs to run in a separate process. To start the development server open a new terminal and run:

```bash
npm run dev
```

## Options

You can pass options to the tool by using the `--` separator:

```bash
npm create jitar@latest -- --template=value
```

The following templates are available:
* react
* vue
* svelte
* lit
* solid
* none (jitar-only)
