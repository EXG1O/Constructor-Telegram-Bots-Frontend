export namespace APIResponse {
  export namespace StatsAPI {
    export interface Get {
      telegram_bots: {
        total: number;
        enabled: number;
      };
      users: {
        total: number;
      };
    }
  }
}
