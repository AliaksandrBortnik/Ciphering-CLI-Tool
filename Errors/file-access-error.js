module.exports =
  class FileAccessError extends Error {
    constructor(message) {
      super(message);
      this.name = "FileAccessError";
    }
  };