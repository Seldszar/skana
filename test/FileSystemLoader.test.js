const FileSystemLoader = require("../lib/FileSystemLoader");

describe("FileSystemLoader", () => {
  it("has `getSource` function", () => {
    expect(typeof new FileSystemLoader().getSource).toEqual("function");
  });
});
