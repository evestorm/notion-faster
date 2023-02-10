export declare interface IObjectKeys {
  [key: string]: string | number;
}
export declare class Storage implements IObjectKeys {
  constructor();
  get(key: string): Promise;
  set(key: string, data: any, timeout: number): Promise;
  remove(key: string): Promise;
  has(key: string): Promise;
  clear(): Promise;
  getStorageData(key: string): Promise;
  setStorageData(key: string, data: any): Promise;
}

export declare const storage: Storage;
