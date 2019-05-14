import LocalStorage from "./index";

describe("LocalStorage", () => {
  let storage: LocalStorage;

  beforeEach(() => {
    storage = new LocalStorage();
  });

  describe("smoke tests", () => {
    it("should be instance of class", () => {
      expect(storage).toBeInstanceOf(LocalStorage);
    });
    it("should have get method", () => {
      expect(storage.get).toBeInstanceOf(Function);
    });
    it("should have set method", () => {
      expect(storage.set).toBeInstanceOf(Function);
    });
    it("should have clear method", () => {
      expect(storage.clear).toBeInstanceOf(Function);
    });
  });

  describe("get and set", () => {
    test("it should store and read integer", () => {
      storage.set("test", 1000);
      expect(storage.get("test")).toBe(1000);
    });
    test("it should store and read boolean", () => {
      storage.set("test", true);
      expect(storage.get("test")).toBe(true);
      storage.set("test", false);
      expect(storage.get("test")).toBe(false);
    });
    test("it should store and read float", () => {
      storage.set("test", 1.23);
      expect(storage.get("test")).toBe(1.23);
    });
    test("it should store and read string", () => {
      storage.set("test", "test");
      expect(storage.get("test")).toBe("test");
    });
    test("it should store and read object", () => {
      const test = { a: 1, b: 2 };
      storage.set("test", test);
      expect(storage.get("test")).toEqual(test);
    });
    test("it should store and read array", () => {
      const test = [{ a: 1, b: 2 }, 4, 5, 6];
      storage.set("test", test);
      expect(storage.get("test")).toEqual(test);
    });
  });
  describe("time to live", () => {
    it("should not return value after tll", async () => {
      const newStorage = new LocalStorage();
      newStorage.set("test", 1, 900);
      await new Promise(resolve => setTimeout(() => resolve(true), 1000));
      expect(newStorage.get("test")).toBeNull();
    });
  });
});
