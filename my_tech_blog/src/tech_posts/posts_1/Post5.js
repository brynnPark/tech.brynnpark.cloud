// src/tech_posts/Post2.js
import React from 'react';
import MarkdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import MarkdownRenderer from '../utils/MarkdownRenderer';
import SlugGenerator from '../utils/SlugGenerator';
import HeadingExtractor from '../utils/HeadingExtractor';
import '../post.css'

const imgUrl = `${process.env.REACT_APP_S3_IMG_URL}/post4`;

// Initialize markdown-it
const mdParser = new MarkdownIt({ html: true });
mdParser.use(markdownItAttrs);

const title = 'Architecting on AWS (5)';

const postContent = `
이 포스팅은 AWS 서버리스 컴퓨팅 개념과 Lambda, API Gateway, SQS, SNS, Kinesis 등의 서버리스 서비스에 대해 정리한다. 
또한 Route 53, CloudFront 등 엣지 서비스와 함께 백업 및 복구 전략까지 아우르며, 
효율적인 인프라 운영과 고가용성 아키텍처 설계를 위한 방법들을 다룬다.


# 11 Serverless

*Serverless : 관리할 서버를 직접 띄우지 않아도 됨

## 서버리스란?

- <u>**프로비저닝하거나 관리할 인프라가 없음**
- **종량제 요금제**
- **소비 단위에 따라 자동으로 크기 조정**
- **내장된 보안, 고가용성 컴퓨팅**</u>
- AWS 서버리스 서비스들
    ![image84](${imgUrl}/84.png)    
    

### 서버리스 아키텍처의 예시
![image130](${imgUrl}/130.png)

- 한국 region에서는 문자 서비스 지원 안됨 (이메일만 가능)

**<아키텍처 개념>**
![image131](${imgUrl}/131.png)

- **Monolithic Architecture**
    - 기능 모두를 통째로 묶어서 하나의 어플리케이션화하는 아키텍처
    - 기술 스택, 개발 환경, 개발 언어 등을 통일하고자 할 때 사용
    - 부분 수정이 사실상 불가능 (부분 수정 후 디펜더시가 있기 때문에 전체 테스팅 필수)
- **MSA (Micro Service Architecture)**
    ![image155](${imgUrl}/155.png)    
    
    - <u>**어플리케이션을 기능 단위로 나눠서 모듈 배포**
    - **각 모듈을 다른 언어로 개발할 수 있음**
    - **각 모듈끼리는 API 호출을 통해 소통**
    - **각 모듈이 독립적**
    - **로드밸런서를 통해서 나눠서 api 분배 가능**</u>
    - 각 모듈을 격리하기 위해 VM, Container, Serverless를 주로 사용

### AWS Lambda
![image132](${imgUrl}/132.png)
![image0](${imgUrl}/0.png)

- **Lambda**
    - <u>**람다 안에 함수(소스코드)를 미리 작성**</u>

    - 호출하는 방법
        - 직접 호출
        - 예약(특정 시간에 호출되도록)
        - Event 발생
- Call이 되는 순간 AWS 내부에서 자동으로 실행환경을 만들어줌
    - 런타임
    - OS
    - 스토리지
- 따라서 람다를 만들 때, 사용자가 지정해줘야 하는 부분이 있음
    - <u>**Runtime**
        - **지원해주는 것 외에 사용자 지정 런타임도 올릴 수 있음**
    - **권한 (Role-람다라는 리소스한테 줘야함)**
    - **timeout (최대 15분)**
    - **memory (메모리만 설정하면, CPU나 네트워크 대역폭은 알아서 설정됨 / 최대 10GB 지원) > pricing 결정 요소** </u>
- 이후, 구축한 실행환경 내부에서 람다 함수가 실행됨
- 실행 환경을 사용자가 생성하는 것이 아니 aws가 생성해줌> 서버리스의 개념
- <u>**Cold start 와 Warm start 있음**</u>
- 길게 사용하는 데에는 적합하지 않음
- Lambda 사용사례
    ![image85](${imgUrl}/85.png)    
    
- 람다 이벤트 소스 (람다를 Call할 수 있는 소스)
    ![image133](${imgUrl}/133.png)    
    

## API Gateway
![image134](${imgUrl}/134.png)

- <u>**캐시 가능**
- **내부적으로 api 호출하는 데 많이 사용** </u>
- 외부 인터페이스로도 열 수 있음
- <u>**WAF랑 묶어서 사용** </u>
- 서버리스

### 기능

- <u>**여러 마이크로서비스를 위한 통합 API 프런트 엔드를 생성**
- **백엔드에 DDoS 보호 및 제한 기능 제공**
    - **WAF 연동**
- **백엔드에 대한 요청을 인증 및 권한 부여**
    - **Cognito 연동**
- **서드 파티 개발자에 의해 API 사용을 조절, 측정 및 수익화**</u>
    - api 콜 몇 번 이상이면 제한두기 (무료 플랜일 때 이런 거 흔함)

### API Gateway 아키텍처 예시
![image135](${imgUrl}/135.png)

## Amazon SQS (Simple Queue Service)

- <u>**FIFO Queue**</u>
- 완전관리형 메시지 대기열 서비스
- <u>**처리 및 삭제될 때까지 메시지를 저장하고 있음**
- **발신자와 수신자 간 버퍼 역할을 담당**
- **소비자(task를 처리하는 애)가 큐에서 polling하는 방식**</u>
    ![image136](${imgUrl}/136.png)

    - <u>**본인이 할 task를 큐로부터 가져오고, 해당 일을 처리하면 큐에서 삭제하는 것도 직접 해야함**
    - **배달 못한 편지 대기열**</u> (옵션으로 선택 가능)
        - 처리할 수 있는 애가 없는 경우, 배달 못한 편지 대기열로 옮겨둘 수 있음
        - 옮기고 뭐가 문제인지 확인하면 핸들링하고 다시 큐로 옮길 수 있음

### 사용 사례
![image137](${imgUrl}/137.png)

- **요청 오프로딩**
    - 큐에 쌓인 애들 중에 처리하는 데 오래 걸리는 애들은 따로 느린 요청 대기열을 만들어서 빼둠
- **자동 크기 조정**
    - 큐에 너무 많은 양이 쌓이면 오토 스케일링 함

### SQS 대기열 유형
![image138](${imgUrl}/138.png)

- **Standard**
    - 무제한
    - <u>**소비자가 랜덤으로 본인이 처리할 애를 polling함**
    - **polling 시, 가시성 제한 시간을 정해두고 해당 시간동안 preemption 걸어둠**</u>
    - 시간 내에 처리 못하면 preemption이 풀리고 다른 소비자가 폴링해갈 수 있음
    - <u>**따라서 이중 처리 가능성 있음 > 그래도 비용이 저렴하기 때문에 (무제한)**</u>
    - 이런 거 상관없는 서비스에는 Standard 사용
- **FIFO**
    - <u>**순차적인 처리**
    - **초당 API 호출 제한**</u>
- 대기열 구성 최적화
    ![image139](${imgUrl}/139.png)    
    
    - **짧은 폴링**
        - 처리하는 쪽에서 짧은 간격으로 큐를 폴링함
        - 폴링할 때, 처리할 게 있으면 무조건 가져옴
        - 처리할 게 없는 빈 큐면 그냥 옴
        - 그냥 있든 없든 계속 찔러보는 형태
    - **긴 폴링**
        - 가서 일정 시간동안 기다림
        - 따라서 처리할 일을 못가져오는 일이 적음
        - 최대 20초까지 선택 가능
        - 몇 개가 있던 무조건 대기하고, 큐에서 가져옴
- <u>**메세지 보존 기간**
    - **최대 14일**</u>
- 메시지 대기열의 사용
    - 서비스 간 통신 (버퍼 역할을 해줌)
    - <u>**비동기 작업 항목**
    - **상태 변경 알림 (큐의 상태 변경되면 알림 발생 가능)**
- **사용 불가능한 항목**
    - **대용량 메시지**
        - **최대 메세지 크기는 256 KB 밖에 안됨**
    - **특정 메시지 선택**
        - **어떤 메세지만 가져갈거야 안됨**</u>

## Amazon SNS (Simple Notification Service)
![image160](${imgUrl}/160.png)

- **GCP Pub/Sub인듯**?
- <u>**푸시(Push) 베이스**</u>
- SMS 메시지 알림은 한국은 지원안함
    - 하지만 다른 분보니까 문자알림기능자체는 lambda 이용해서 직접 구현하긴 하는 듯

![image48](${imgUrl}/48.png)
- **특징**
    - <u>**회수 옵션 없음**
    - **단일 메시지로 날라감**
    - **http or https 요청**</u>
    - 표준(순서 유지 X) 또는 fifo(순서 유지 O, 중복 제거?) 주제

### AWS SNS 아키텍처 예시
![image49](${imgUrl}/49.png)

- **팬아웃**
    - 일대일이 아닌 여러 개의 토픽을 구독한 대기열에 쫙 뿌리는 거
- SQS가 Subscriber, 클라이언트 서버가 Publisher인듯?

## SNS vs. SQS
![image161](${imgUrl}/161.png)

## Kinesis

- <u>**실시간 스트리밍 데이터 수집 및 분석**</u>을 수행하는 서버리스 서비스
- 종류는 아래와 같이 4가지가 있음
    ![image50](${imgUrl}/50.png)    
    

### Kinesis Video Streams

- 비디오 데이터에 관련된 것들을 수집하고 S3 혹은 그 외의 저장소에 저장할 때 사용

### Managed Service for Apache Flink

- <u>**모아진 데이터를 실시간 데이터 분석을 위해 사용**</u>
- Apache Flink를 실무에서 많이 사용하기 때문에 연동해서 사용할 수 있는 aws용 완전관리형 서비스

### Kinesis Data Streams
![image162](${imgUrl}/162.png)

- <u>**분석을 위해 데이터 스트림을 수집 및 저장**
- **실시간**</u>으로 데이터 전달 및 저장 가능 **(버퍼링 없음)**
- <u>**데이터 전달하는 중간에 소비자가 데이터를 처리하거나 할 수 있음**</u>
- 처음에 샤드수를 정의해야함
- **샤드를 통해 데이터 송출**
    - 실시간으로 저장할 데이터가 많으면 샤드 수를 늘리고
    - 적다면 샤드 수를 적당히 조절

### Kinesis Data Firehose
![image163](${imgUrl}/163.png)

- <u>**단순히 저장소에 저장을 하기 위해 연결하는 서비스**</u>
- 중간 처리하는 과정, 데이터가 <u>**중간에 다른 일을 하는 일 없음**</u>
- <u>**준 실시간**으로 데이터가 전송됨 **(퍼버링 존재)**</u>
    - 사용자가 샤드 수를 조절할 필요없음
- <u>**데이터가 어느 정도 모일 때까지 기다렸다가, 특정 용량이 모이면 전송**</u>

## Step Functions
![image164](${imgUrl}/164.png)

- 하나의 흐름을 순서도 그리듯이 구현해서 워크플로우 조절하는 것
    - 즉, 다단계 워크플로 오케스트레이션 도구
- 원래는 JSON으로 만들어야 했는데, 최근에 Workflow studio가 생겨서 드래그 & 드랍으로 만들 수 있음
- 다양한 서비스들을 붙여서 워크플로우 만들 수 있음

### Step functions 예시
![image51](${imgUrl}/51.png)

- 병렬 처리도 가능

# 12 Edge Service
![image165](${imgUrl}/165.png)

- **Edge Location**
    - PoP (Point of Presence)라고도 함
    - 5가지의 Edge Service를 운용할 수 있음
        - CloudFront
        - AWS WAF
        - <u>**AWS Shield > Route 53하고 CloudFront에 자동으로 붙음**</u>
- **Local Zone**
    - VPC의 확장이라고 생각
    - 자주 쓰는 일부 aws 서비스(EC2, S3 등)를 조금 더 가까이에 로컬 존이라는 것을 만들어서 해당 서비스들을 직접 실행할 수 있도록 함
- **AWS outposts**
    - <u>**AWS에서 데이터 센터에 사용할 수 있는 서버렉(outposts)을 배달해줌**</u>
    - 온프레미스에서 직접 사용하고자 함
    - 모든 서비스가 아닌 일부 지원되는 서비스만 사용 가능
- **AWS Snow Family**
    - 오프라인으로 데이터를 전송받거나 전송하는 서비스

## Route 53

- DNS service
- 도메인 이름을 ip 주소로 확인
- 도메인 이름을 등록 또는 이전하는 것을 관리
- 지연 시간, 상태 확인 및 기타 기준에 따라 라우팅해줌
- <u>**AWS Shield가 자동으로 붙음**</u>

### Hosting 영역
![image58](${imgUrl}/58.png)

- <u>**ip를 기반으로 움직임**</u>
- 퍼블릭 호스팅 영역
    - 우리가 흔히 생각하는 DNS 서비스
- 프라이빗 호스팅 영역
    - <u>**프라이빗 영역에서도 Route53 호스팅 가능**</u>
    - ip를 사용하지 않고 도메인으로 호스팅하고 싶을 때 프라이빗 영역을 만들어서 사용
    - 온프레미스까지 연결 가능
    - 이때 Route 53 Resolver를 사용해서 호스팅

### 라우팅 정책

- 어느 ip로 보낼 지에 대한 결정을 할 수 있음
- ELB와 뭐가 다르지?
    - <u>**route 53은 리전 단위로 분배**
    - **load balancer는 vpc 내에서 분배**
    - **따라서 LB 전에 미리 한 번 더 분배를 하는 느낌** </u>

**<라우팅 정책의 특성>**

- **단순 라우팅 (Simple routing policy)**
    - 단순하게 리소스 하나에 트래픽을 라우팅
- **장애 조치 라우팅 (Failover routing policy)**
    - health check를 해서 만약에 장애가 난 리전이 확인되면 해당 리전으로는 트래픽을 보내지 않음
- **지리적 위치 라우팅**
    - <u>**사용자 ip를 기반으로 리전을 파악해서 각 리전으로 보내줌**</u>
    - 지역적으로 서로다른 서비스를 제공해야할 때 사용됨
    - 예를 들어 미국에서 들어온 ip는 미국 리전으로 보냄
- **지리 근접 라우팅 (Geoproximity routing policy)**
    - 지리적 위치 라우팅보다 더 나은 서비스를 제공할 수 있다는 걸 생각
    - 꼭 리전이 아니라 위도와 경도를 기준으로 더 가까운 곳에 라우팅을 해주자
    - 예를 들어, 미국과 캐나다의 경계 부분의 라우팅 생각
- **지연 시간 기반 라우팅 (Latency routing policy)**
    - 특정 리전들의 latency를 보고, 처리 시간이 짧은 리전으로 보냄
- **다중값 응답 라우팅 (Multivalue answer routing policy)**
    - DNS를 이용해서 ip값을 요청했을 때 정상상태인 ip(최대 8개까지 반환 가능) 여러 개가 한 번에 전달되는 경우에 클라이언트측에서 이 중에서 하나를 선택해서 하나를 사용할 수 있도록 하는 서비스
- **가중치 기반 라우팅 (Weighted routing policy)**
    - 새로운 서비스를 오픈했을 때, 일단 안정적인 곳으로 90프로 보내고 새로운 환경에는 10프로만 보내서 테스트 (90 아니어도 됨)
    - <u>**GCP의 traffic split과 동일** </u>

## Amazon CloudFront

- <u>**관리형 글로벌 CDN 서비스**</u>
    - 글로벌하게 컨텐츠를 전송하길 원할 때, 조금 더 빠르게 컨텐츠 전송을 할 수 있는 <u>**캐싱 서비스**
    - **멀티 티어 캐싱 지원**
- **DDoS 공격을 막기 위한 서비스인 WAF와 Shield와 통합해서 사용**
- **내장된 보안 기능**
    - **암호화**
- **전 세계 현재 500개가 넘는 PoP 존재**
- **S3 외에도 EC2, ELB 연결해서 사용하기도 함 > 동적 컨텐츠**</u>

### Edge Caching
![image59](${imgUrl}/59.png)

- 사용자 위치 <> CloudFront 위치까지만 인터넷망 사용
- 이후 CloudFront <> AWS는 AWS 전용망 사용
- <u>**Origin**
    - **CloudFront에서 캐싱을 할 대상을 의미**
    - **두 가지 존재**
        - **S3 Origin > 정적 컨텐츠 (S3)**
        - **사용자 지정 Origin > 동적 컨텐츠 (EC2, ELB)**</u>
    - 동적컨텐츠를 지원한다는 것의 의미는 사용자로부터 동적 컨텐츠 요청을 받아서 처리해줄 수 있다
        - 즉, CloudFront에서 캐싱된 데이터를 주는 것이 아니라 그냥 aws 전용 네트워크를 사용하기 위해 CloudFront까지만 사용자가 인터넷망을 통해 접근하고 그 요청 처리는 aws 망
    - Origin Group으로 묶을 수 있음
        - 그룹 안에서 Primary - Secondary로 나눠서 사용 가능
        - 예를 들어, primary가 15초 이상 반응 안하면 secondary 사용
- 캐싱 과정
    ![image166](${imgUrl}/166.png)    
    

### CloudFront 구성

1. 오리진 선택
    - S3
    - ELB 로드 밸런서
        - 왜 ALB는 안되는지?
        - ELB가 상위 개념이고 하위에 ALB,NLB있음
        - <u>**CloudFront는 http/s 프로토콜을 지원**
    - **사용자 지정 오리진**
        - **EC2 인스턴스**
        - **온프레미스** </u>
2. Distribution (배포) 생성
    - 캐시 동작 정의
        - http 메서드 (get, post 등)
        - 프로토콜 정책 (http, tcp 등)
        - 캐시 정책 (유지 시간/TTL, 캐시 키 등)
            - TTL : 기본 24시간이고, expire되면 갱신할지(다시 사용), 변경할지(다시 받음) 오리진한테 물어봄
            - 캐시 키:
        - 경로 패턴
        - 서명된 url
            - 키 값을 사용해 private key를 가지고있는 사람만 접근할 수 있게 함(캐싱할 수 있음)
            - 특정기간 사용 - 사용기간 설정할 수 있음 (시간 지나면 expire)
3. <u>**선택 사항**
    - **함수 연결**
        - **람다 엣지라는 가벼운 함수를 통해 간단한 처리 해결**
    - **WAF 웹 액세스 제어 목록(웹 ACL) 연결**
    - **사용자 도메인 이름 추가** </u>

## DDoS 공격 보호

### AWS Shield
![image167](${imgUrl}/167.png)
![image60](${imgUrl}/60.png)

- 보통 3/4 계층에서 공격 자주 발생
- DDoS 공격 보호용
- **Standard는 무료 서비스**
    - **CloudFront, Route 53에서 무료**
    - 따라서 무조건 CloudFront 둬서 사용하는 것을 추천
- Advanced는 유료 서비스
    - ELB 보호까지 해줌
    - **WAF 공짜로 주어짐**

### WAF
![image61](${imgUrl}/61.png)

- 위 5가지 서비스에서만 WAF 사용할 수 있음
- 웹 ACL
    - 특정 ip 막을 수 있고, 기준을 정해서 도메인 중에 이상한 내용이 붙어있으면 막는 규칙을 만들 수 있음
    ![image62](${imgUrl}/62.png)    
    

### Firewall Manager
![image168](${imgUrl}/168.png)

- 아래의 보안 조치들을 중앙 집중 관리할 수 있도록 만든 서비스
    - WAF
    - VPC Security Group
    - Shield Advanced
    - Network Firewall
- 다중 계정 관리할 때 매우 유용

![image63](${imgUrl}/63.png)
- 다중 계층을 이용해서 최대한 보안에 신경써라

### Outposts

- AWS에서 서버 랙 혹은 서버를 직접 데이터 센터에 놓고 사용할 수 있도록 함
    - 규정 상 데이터가 데이터센터 밖으로 나갈 수 없음 등등의 이유로
        ![image64](${imgUrl}/64.png)    
    
    - <u>**AWS 서비스를 온프레미스(오프라인)에서 사용할 수 있게 함**</u>
        ![image65](${imgUrl}/65.png)        
        
        - VPC 확장이라는 점에서 로컬존과 비슷하지만 얘는 로컬존과 달리 본점(본 vpc region)에 갈 필요는 없다!
- 하지만 사용할 수 있는 서비스의 종류는 아래와 같이 제한적
    ![image66](${imgUrl}/66.png)    
    

# 13 백업 및 복구

- 재해 복구 계획은 항상 업데이트 해줘야 함
- 테스트도 충분히 하기

### 가용성이란?

- 가용성 높은 어플리케이션을 위한 재해 복구
    ![image67](${imgUrl}/67.png)    
    

### RPO & RTO
![image68](${imgUrl}/68.png)

- **RPO (Recovery Point Objective)**
    - RPO 시간만큼 데이터를 복구할 수 있음
    - 즉, RPO 시간만큼의 데이터를 항상 백업해놔야 함
    - 해당 point부터 데이터 복구 가능
- **RTO (Recovery Time Objective)**
    - RTO 시간만큼은 서비스가 작동하지 않아도 됨
    - 즉, 서비스를 다시 복구해야하는 시간
    - RTO 시간 안에 서비스를 다시 복구해야함
    - 해당 time까지는 복구 가능

### 스토리지 복제 옵션
![image69](${imgUrl}/69.png)

- CRR (Cross-Region Replica)
- DataSync
    - 데이터 무결성 보장
    - migration service
    - 지속적으로 백업
- Snow Family
    - 직접 오프라인으로 백업

### 어플리케이션 복제 옵션
![image70](${imgUrl}/70.png)

- EC2는 S3에 있는 AMI 가져다가 사용
- 컨테이너는 ECR에 있는 이미지 가져다가 사용

### 네트워크 설계 옵션
![image71](${imgUrl}/71.png)

### DB 백업 옵션
![image72](${imgUrl}/72.png)

- <u>**RDS는 35일까지 자동백업**</u>
    - 그 이후는 수동백업으로 설정하기
- 클릭 몇 번으로 백업 가능

### 인프라 백업
![image169](${imgUrl}/169.png)

- <u>**IaC를 이용해 인프라 백업**</u>

## AWS Backup

- 백업 서비스를 중앙 집중 관리 해주는 서비스
    ![image73](${imgUrl}/73.png)    
    
    - 한 번만 들어가서 확인할 수 있음

- 이점
    ![image74](${imgUrl}/74.png)    
    
    - <u>**서비스에서 백업에 관한 로그 한 번에 확인 가능** </u>

### AWS Backup 작동 방식
![image75](${imgUrl}/75.png)

## 복구 전략

- 복구 전략
    ![image76](${imgUrl}/76.png)    
    
    - 백업 및 복원
    - 파일럿 라이트
    - 웜 스탠바이
    - 다중 사이트 액티브-액티브

### 백업 및 복원
![image170](${imgUrl}/170.png)

- 데이터를 정기적으로 백업
- <u>**복원 시 필요한 서버를 미리 백업해두진 않음 (오직 데이터만 백업)**</u>
- 이럴 경우, 백업한 데이터를 이용해 서버를 생성하는 데 시간이 소요됨
- <u>**다만 비용적으로는 제일 저렴**
    - **프로비저닝을 미리 해두진 않으니까**</u>

### 파일럿 라이트
![image172](${imgUrl}/172.png)
![image171](${imgUrl}/171.png)

- <u>**데이터 + 인프라까지 복제해둠**
- **다만, 복제한 인프라는 평소에는 꺼두고 재해 복구 시 빠르게 가동 및 스케일 아웃하여 사용**</u>

### 웜 스탠바이
![image173](${imgUrl}/173.png)
![image174](${imgUrl}/174.png)

- <u>**실제로 작동하는 똑같은 환경을 복제해서 Route53을 이용해 가중치 트래픽 전송을 함**
- **평소에는 적은 트래픽만 처리하며 재해 복구 시, 복구 환경으로 전환하여 전체 용량 처리** </u>
- 파일럿 라이트에 비해 재해 복구 시간이 적게 걸리지만, 평소에 가동을 하고 있기 때문에 더 많은 비용 소요

### 다중 사이트 액티브-액티브
![image175](${imgUrl}/175.png)
![image176](${imgUrl}/176.png)

- <u>**평소 프로덕션 환경과 완벽하게 똑같이 복제해서 실제로 프로덕션 트래픽을 처리함** </u>
- 복구 옵션 중 재해 복구 시간이 가장 짧음
- 하지만 그만큼 비용은 제일 비쌈
`;

const Post5 = {
  id: 5,
  slug: SlugGenerator(title),
  title: title,
  date: 'July, 2024',
  tags: ['AWS', 'Architecting', 'Cloud Computing', 'Architecting on AWS', 'Serverless', 'Lambda', 'Edge Services'],
  excerpt: '이 포스팅은 AWS 서버리스 컴퓨팅 개념과 Lambda, API Gateway, SQS, SNS, Kinesis 등의 서버리스 서비스에 대해 정리한다. 또한 Route 53, CloudFront 등 엣지 서비스와 함께 백업 및 복구 전략까지 아우르며, 효율적인 인프라 운영과 고가용성 아키텍처 설계를 위한 방법들을 다룬다.',
  headings: HeadingExtractor(postContent),
  content: <MarkdownRenderer markdownText={postContent} allowImages /> // Render markdown using the MarkdownRenderer
};

export default Post5;

