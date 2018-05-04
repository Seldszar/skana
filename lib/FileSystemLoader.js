const fs = require("fs-plus");
const defaults = require("lodash.defaults");
const nunjucks = require("nunjucks");

/**
 * A file system loader.
 *
 * @extends {nunjucks.Loader}
 * @param {Function} resolver The namespace paths resolver.
 * @param {Object} [options] The loader options.
 * @param {Boolean} [options.noCache=false] Indicate if the views must be cached.
 * @param {RegExp} [options.pattern=/^(?:@([^\/]+)\/)?(.*)$/] The pattern used by the loader.
 * @param {Array<String>} [options.extensions=["nunjucks", "njk", ""]] The extensions used to resolve the files.
 */
class FileSystemLoader extends nunjucks.Loader {
  constructor(resolver, options) {
    super();

    /**
     * The namespace paths resolver.
     *
     * @type {Function}
     */
    this.resolver = resolver;

    /**
     * The loader options.
     *
     * @type {Object}
     */
    this.options = defaults(options, {
      noCache: false,
      pattern: /^(?:@([^\/]+)\/)?(.*)$/,
      extensions: ["nunjucks", "njk", ""],
    });
  }

  /**
   * Resolve search paths.
   *
   * @private
   * @param {?String} namespace The namespace.
   * @return {?Array<String>} The resolved search paths.
   */
  resolveSearchPaths(namespace) {
    const searchPaths = this.resolver(namespace);

    if (searchPaths == null) {
      return null;
    }

    if (Array.isArray(searchPaths)) {
      return searchPaths;
    }

    return [searchPaths];
  }

  /**
   * Resolve a source path.
   *
   * @private
   * @param {?String} namespace The namespace.
   * @param {String} path The path to resolve.
   * @return {?String} The resolved path.
   */
  resolveSourcePath(namespace, path) {
    const searchPaths = this.resolveSearchPaths(namespace);

    if (searchPaths) {
      return fs.resolve(...searchPaths, path, this.options.extensions);
    }

    return null;
  }

  /**
   * Resolves a source.
   *
   * @private
   * @param {String} name The source name.
   * @param {Function} [callback] Function called when the source is resolved.
   * @return {?Object} The resolved source, or `null` otherwise.
   */
  getSource(name, callback) {
    const match = name.match(this.options.pattern);

    if (match) {
      const resolvedPath = this.resolveSourcePath(match[1], match[2]);

      if (resolvedPath) {
        if (callback) {
          return fs.readFile(resolvedPath, "utf-8", (error, data) => {
            if (error) {
              return callback(error);
            }

            return callback(null, {
              path: resolvedPath,
              src: data,
              noCache: this.options.noCache,
            });
          });
        }

        return {
          path: resolvedPath,
          src: fs.readFileSync(resolvedPath, "utf-8"),
          noCache: this.options.noCache,
        };
      }
    }

    return null;
  }
}

module.exports = FileSystemLoader;
