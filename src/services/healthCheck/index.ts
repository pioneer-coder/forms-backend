class HealthCheckService {
  check({ forcedIsHealthy }: { forcedIsHealthy?: boolean }): boolean {
    return forcedIsHealthy === undefined ? true : forcedIsHealthy;
  }
}

const healthService = new HealthCheckService();
export default healthService;
