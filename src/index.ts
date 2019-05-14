interface LocalStorageValue {
  ttl: number;
  content: string;
}

interface LocalStorageValueWithKeyName {
  key: string;
  ttl: number;
  content: string;
}

interface configuration {
  prefix?: string;
  ttl?: number;
}

export default class LocalStorage {
  private prefix: string;
  private ttl: number;

  constructor(config: configuration = {}) {
    this.prefix = config.prefix || "app";
    this.ttl = config.ttl || 1000 * 60 * 60 * 24;
  }

  private objects(): LocalStorageValueWithKeyName[] {
    return Object.keys(localStorage)
      .filter(key => new RegExp(`^${this.prefix}.*?`).test(key))
      .map(key => {
        return { key, ...JSON.parse(localStorage[key]) };
      });
  }

  private clean(): void {
    this.objects()
      .filter(o => o.ttl < new Date().getTime())
      .forEach(o => localStorage.removeItem(o.key));
  }

  private quotaClean(): boolean {
    try {
      localStorage.removeItem(
        this.objects().sort((a, b) =>
          a.ttl < b.ttl ? -1 : a.ttl > b.ttl ? 1 : 0
        )[0].key
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  public get(key: string): any {
    this.clean();
    try {
      return JSON.parse(localStorage.getItem(`${this.prefix}_${key}`)).content;
    } catch (error) {
      return null;
    }
  }

  public clear(): void {
    this.objects().forEach(o => localStorage.removeItem(o.key));
  }

  public set(
    key: string,
    value: any,
    ttl: number = 1000 * 60 * 60 * 24
  ): boolean {
    this.clean();
    try {
      const lsObject: LocalStorageValue = {
        ttl: new Date().getTime() + ttl,
        content: value
      };
      localStorage.setItem(`${this.prefix}_${key}`, JSON.stringify(lsObject));
    } catch (error) {
      if (this.quotaClean()) {
        return this.set(key, value, ttl);
      }
      return false;
    }
  }
}
