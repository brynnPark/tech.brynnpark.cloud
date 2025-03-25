# 1. Observability의 개념
Observability(가시성)는 시스템의 내부 상태를 **외부에서 드러나는 데이터(로그, 메트릭, 트레이스)**를 통해 이해하고 분석할 수 있는 능력을 말함.

원래는 제어 이론에서 유래한 개념인데, 현재는 소프트웨어 시스템의 안정성과 성능을 유지하기 위한 핵심 개념으로 자리잡음.

> 시스템이 “observable”하다는 것은, 문제가 발생했을 때 그 원인을 파악할 수 있을 정도로 충분한 정보를 수집하고 있다는 뜻. 

<br/>

### Observability의 3대 구성요소 ("Three Pillars")
![Three pillars](/images/post14/image-1.png)
1. **Logs** – 이벤트 기반 정보 (무슨 일이 언제 일어났는가?)

2. **Metrics** – 시스템 상태를 수치로 표현 (지속적인 상태 감시)

3. **Traces** – 분산 시스템에서 요청 흐름을 추적 (병목 분석)

**이 세 가지가 통합되어야 “진짜” Observability를 구현할 수 있음.**

<br/>

## Logging과 Monitoring의 개념과 차이점
![logging vs. monitoring](/images/post14/image.png)

### **Logging**:

예외, 경고, 디버깅 정보 등을 포함.
- 예: `{"timestamp": "...", "level": "ERROR", "message": "DB 연결 실패"}`

### **Monitoring**:

대시보드와 알람을 통해 실시간 상태를 감시함.

- 예: `Prometheus로` 메트릭 수집 → `Grafana로` 시각화 → `Alertmanager로` 알림 발송.


<br/>

# 3. Observability가 사용되는 분야 및 필요성
### 사용 분야:
- 대규모 분산 시스템 (ex. Kubernetes 기반 MSA)

- 클라우드 인프라 (AWS, GCP, Azure)

- 금융/이커머스/게임/스트리밍 등 실시간 서비스 제공 기업

> 💡 왜 필요한가?
>
> - 시스템이 점점 복잡해지면서, 단순한 로그/모니터링만으로는 원인 분석이 어려움.
>   - 예) 하나의 요청이 여러 마이크로서비스를 거치는 구조에서는 트레이싱이 없으면 문제 위치를 알기 어려움.
> - 다운타임 최소화, 신속한 디버깅, 서비스 안정성 확보를 위해 필수적임.

<br/>

# 4. 사용 사례 (실제 기업 사례)
### 🔸 Netflix
- 수백 개의 마이크로서비스를 운영.
- 자체 Observability 플랫폼인 Atlas, Titus, Hystrix 등을 사용해 메트릭, 로그, 트레이스를 통합 관리.
- 장애 복원력(Resilience)을 높이기 위해 Observability에 큰 투자를 함.

### 🔸 Pinterest
- OpenTelemetry + Prometheus + Grafana로 observability 구성.
- 장애 발생 시, 트레이스 기반 분석으로 병목 구간 신속 파악.

### 🔸 쿠팡
- 실시간 알림 시스템과 로그 분석 도구를 통해 배송 상태 트래킹, 에러 대응 자동화.

<br/>

---
**출처**

- https://devopscube.com/what-is-observability/
- 