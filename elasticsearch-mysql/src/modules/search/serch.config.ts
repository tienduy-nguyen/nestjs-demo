export class SearchConfig {
  public static configSetup(url: string): any {
    return {
      node: url,
      maxRetries: 5,
      requestTimeout: 6000,
      sniffOnStart: true,
    };
  }
}
