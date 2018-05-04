# Skana

> This simple blade becomes immensely powerful in the hands of a master.

Namespace-based loader for Nunjucks.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Author](#author)
- [License](#license)

## Installation

```bash
npm install skana --save
```

## Usage

```javascript
const nunjucks = require('nunjucks');
const skana = require('skana');

const env = new nunjucks.Environment(
  new skana.FileSystemLoader(namespace => {
    switch (namespace) {
      case "lorem": {
        return [
          "/path/to/lorem/views",
        ];
      }

      case "ipsum": {
        return [
          "/path/to/ipsum/views",
        ];
      }

      default: {
        return [
          "/path/to/default/views",
        ];
      }
    }
  }),
);

// Resolve and synchronously render
const result = env.render("my-view.html");

// Resolve and asynchronously render
env.render("@lorem/my-view.html", (error, result) => {
  // ...
});
```

# API

See the detailed [API Reference](API.md).

## Author

Alexandre Breteau - [@0xSeldszar](https://twitter.com/0xSeldszar)

## License

MIT © [Alexandre Breteau](https://seldszar.fr)
