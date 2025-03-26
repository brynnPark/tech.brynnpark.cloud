# 1. Istio 개념
## 1.1 등장 배경
클라우드 네이티브 환경에서 마이크로서비스 아키텍처(MSA)가 널리 사용되면서, 서비스 간 통신, 보안, 관찰성, 트래픽 제어 등의 복잡성이 증가하였다.
이러한 복잡성을 애플리케이션 코드가 아닌 인프라 계층에서 해결하고자 등장한 개념이 **서비스 메시(Service Mesh)**이다.
그중 대표적인 구현체가 바로 Istio이다.

## 1.2 Istio란
Istio는 마이크로서비스 간 트래픽을 제어, 보안 적용, 관찰할 수 있도록 돕는 서비스 메시 오픈소스 플랫폼이다.
애플리케이션의 수정 없이도 세분화된 정책을 적용할 수 있는 것이 장점이다.

## 1.3 Istio의 구성 요소
Envoy Proxy: 각 서비스에 사이드카(sidecar) 형태로 배포되며, 서비스 트래픽을 가로채고 제어하는 역할을 한다.

Istiod: 트래픽 라우팅, 인증, 정책 적용 등 Istio의 핵심 기능을 담당하는 **컨트롤 플레인(Control Plane)**이다.

VirtualService, DestinationRule: Istio에서 트래픽 제어를 위해 사용하는 주요 리소스이다.

# 2. Istio 사용 방법
## 2.1 설치 방법
Istio는 istioctl, Helm, Operator 등을 통해 설치할 수 있다.
가장 간단한 방법은 istioctl을 사용하는 것이다.

```bash
istioctl install --set profile=demo -y
```
설치 후 사이드카 프록시를 자동으로 주입하려면 아래와 같이 네임스페이스에 라벨을 추가해야 한다.

```bash
kubectl label namespace default istio-injection=enabled
```

## 2.2 기본 사용 흐름
서비스가 배포되면, 각 Pod에 Envoy Proxy가 자동으로 주입된다.

서비스 간 트래픽은 모두 Envoy를 통해 흐르며, 정의한 정책에 따라 라우팅된다.

사용자는 YAML 형식으로 VirtualService, DestinationRule 등의 리소스를 정의하여 트래픽 분산, 인증, 장애 대응 등을 설정할 수 있다.

예: 두 버전 간 50:50 비율로 트래픽을 분산하는 VirtualService 설정

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: my-service
spec:
  hosts:
  - my-service
  http:
  - route:
    - destination:
        host: my-service
        subset: v1
      weight: 50
    - destination:
        host: my-service
        subset: v2
      weight: 50
```


# 3. Istio의 활용 사례
## 3.1 트래픽 분산 및 Canary 배포
Istio는 Canary 배포, Blue/Green 배포 등 점진적 배포 전략을 구현할 수 있도록 지원한다.
운영 트래픽 중 일부만 새 버전으로 라우팅하거나, 특정 조건에 따라 트래픽을 조절할 수 있다.

## 3.2 관찰성(Observability) 향상
Istio는 Prometheus, Grafana, Jaeger, Kiali 등과 연동하여 서비스 간 호출 관계, 응답 시간, 오류율 등을 시각화할 수 있다.
이를 통해 마이크로서비스 간의 통신을 쉽게 모니터링할 수 있다.

## 3.3 보안 강화
Istio는 기본적으로 서비스 간 통신에 **mTLS(mutual TLS)**를 적용하여 암호화된 통신을 제공한다.
또한, RequestAuthentication, AuthorizationPolicy 리소스를 통해 세분화된 인증 및 인가 정책을 설정할 수 있다.

# 4. 사용 시 주의할 점
## 4.1 사이드카 프록시로 인한 오버헤드
Envoy Proxy가 각 Pod에 주입되므로, 리소스 사용량이 증가할 수 있다.
클러스터 규모가 커질수록 운영 복잡성이 증가하므로 주의가 필요하다.

## 4.2 버전 및 구성 변화
초기 Istio는 Mixer, Citadel, Galley 등 여러 컴포넌트로 구성되었으나, 현재는 대부분 Istiod로 통합되었다.
버전마다 구조와 설치 방식이 달라질 수 있으므로 공식 문서를 참고해야 한다.

## 4.3 Ambient Mesh (개발 중 기능)
사이드카 없이 서비스 메시를 구성하는 Ambient Mesh가 개발 중이다.
이는 리소스 오버헤드를 줄이고 운영을 단순화하려는 목적을 가진 구조이다.