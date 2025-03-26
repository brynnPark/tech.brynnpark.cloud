// src/tech_posts/Post2.js
import React from 'react';
import MarkdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import MarkdownRenderer from '../utils/MarkdownRenderer';
import SlugGenerator from '../utils/SlugGenerator';
import HeadingExtractor from '../utils/HeadingExtractor';
import '../post.css'

// Initialize markdown-it
const mdParser = new MarkdownIt({ html: true });
mdParser.use(markdownItAttrs);

const title = 'AWS Technical Essentials (2)';

const postContent = `
이 글은 AWS의 주요 스토리지 서비스인 EBS, EFS, S3를 비롯해 RDS와 DynamoDB와 같은 데이터베이스, 그리고 CloudWatch, ELB, Auto Scaling 등 인프라 관리 도구들을 소개한다. 각 스토리지 타입의 특성과 사용 목적, 보안 및 백업 전략, 로드 밸런싱 방식 및 오토 스케일링 정책까지 실무에 필요한 내용을 체계적으로 정리한다.

# 4 AWS 스토리지

> **AWS Storage 종류**
> 
> Amazon Elastic Block Store(Amazon EBS)
> 
> 
> Amazon Elastic File System(Amazon EFS)
> 
> Amazon Simple Storage Service(Amazon S3)
> 

## 스토리지 유형
스토리지는 저장하는 데이터의 형태에 따라 크게 블록(Block) 스토리지, 파일(File) 스토리지, 객체(Object) 스토리지 3가지로 구분할 수 있다. 
AWS에서는 각 타입별로 EBS, EFS, S3를 제공하고 있으며 EBS는 EC2에 붙여서만 사용할 수 있다. 각 종류와 서비스에 대해서 알아보자.

### 블록 스토리지
![image9.png](./images/post3/image9.png) 
- 파일을 블록 단위로 쪼개서 저장
- EC2에 붙여서 사용하는 애들
- EC2와 동일한 범위의 AZ에서만 사용할 수 있음
- on-premise에서 사용 불가능 > EC2 전용으로 나옴
- **Instance store**
    - 데이터 휘발성
    - 굉장히 빠름
- **EBS**
    - 데이터 영구보존
    - 하드 종류 2가지 - HDD / SDD
    - snapshot 제공 - 증분 스냅샷 제공 (차이점만 스냅샵 찍음)
        - 하지만 장기적으로 보면 다 저장해야 하니까 다 비용
    - 암호화 지원

### 파일 스토리지

- 파일 형태 그대로 저장
- EC2와 다른 AZ에서도 사용할 수 있고, 심지어 on-premise에서도 사용 가능
- **EFS (linux용)**
- **FSX for window**

### 객체 스토리지

- 파일을 객체 형태로 다시 만들어서 저장
- (파일 + 파일에 대한 메타데이터 + 파일의 key 값) = 객체 (object)
- **S3**
    - 백업용
        - 언제든지 다시 꺼내서 필요할 때 때때로 빠르게 접근할 수 있어야함
    - 아기사진
    - Bucket이라고 표현함 (나머지 저장공간은 다 리소스를 volume이라고 표현)
        - 버킷은 고유한 이름이 있어야 함 (DNS)
        - console에 붙어서 따로 작동하지 않고 바깥에서도 접근 가능
    - 완전히 플랫한 스토리지
        - 버킷 이름 밑에 있는 \`image/1/dddd\` 는 폴더가 아니라 그냥 전체가 키 값임
    - 버저닝 가능 > 데이터 소실을 막기 위해
        - 왜냐면 수정이라는 개념이 없고 오버라이트해야 하는 구조라서.. ?
- **S3 glacier**
    - 장기보관용
        - 액세스 시간이 길고 (최대 24시간 걸릴 수 있음) 비용이 들 수도 있음
    - 결혼사진 (빠르게 엑세스할 필요없음)

### Amazon Elastic Block Store(Amazon EBS)

![image10.png](./images/post3/image10.png) 
- SSD
    - 처리할 때 사용
    - 비쌈
- HDD
    - 저장하는 용도로 보통 사용

### Amazon Elastic File System(Amazon EFS)

![image11.png](./post3/image11.png) 
- 리눅스용!

- 가용영역 여러 곳에서 동시에 작업할 때 사용해야함
    - ex) 문서 공유 시스템

### Amazon Simple Storage Service(Amazon S3)

![image12.png](./images/post3/image12.png) 
![image13.png](./images/post3/image13.png) 

- 리전 서비스
    - vpc 내부에 있는 서비스가 아니라 Region 단위 서비스
    - 따라서 vig를 이용해서 vpc로 나가야함 > 따라서 endpoint를 뚫어서 private하게 경로 설정해두기도함
    - 또 다른 리전 서비스 예시) kms, dynamoDB

- 보안
![image14.png](./images/post3/image14.png)     
    - 서버 측에서 kms이용해서 암호화해주거나
    - 클라이언트 측에서 이 키로 암호화해줘하거나
    - 뭐가 됐든 일단 클라이언트가 선택해야함

- 스토리지 클래스   
![image15.png](./images/post3/image15.png)     
    - S3 특징
        - 무제한 서비스
        - 비용은 아래와 같이 2가지로 나뉨:
            - 저장 비용
            - 검색 비용
        - <u>**최고의 내구성과 가용성을 보장**</u>
            - 우리는 하나의 S3에 저장한다고 생각하지만 <u>**내부적으로는 3개의 AZ를 이용해서 저장**</u>
    - One Zone-Infrequent Access
        - 기본적으로 3개의 AZ에 저장하는 것이 아니라 한 개의 Zone에만 보관
        - 왜 사용하나?
            - 보통 Glacier에서 좀 자주 검색하는 데이터만 따로 봅아서 복사해두고 사용
    - S3 Interlligent-Tiereing
        - 액세스 패턴에 따라 객체를 계층 간에 자동으로 이동해줌 (GCP Lifecyle policy인듯?)
        - 비용듦 (알고리즘 사용하기 때문에)
    - Glacier도 3가지 종류로 나뉨
    - Google Cloud에서 Cloud Storage와 비슷한 개념
- S3 버저닝
    
    ![image16.png](./post3/image16.png)     
    - 초기 생성 시 버저닝 미사용이 기본값

# 5 데이터베이스

- 직접 관리해야하는 DB
  ![image17.png](./images/post3/image17.png)     
    - EC2위에 DB를 올려서 사용하기도 함
    - 그래서 그냥 AWS에서 자체적인 완전관리형 DB를 만들어버림
- AWS는 **완전관리형** 데이터베이스
  ![image18.png](./images/post3/image18.png)     
    - 하드웨어 종류, 저장 공간 용량 등과 같은 부분들 설정하면 AWS에서 알아서 해줌

![image18.png](./images/post3/image18.png) 
- DynamoDB
    - 게임회사에서 굉장히 많이 씀
    - 랭킹변경과 같은 부분이 빠르게 처리되어야 하기 때문에 global로 깔아서 사용 많이 함
    - 요즘은 RDB에서 DynamoDB로 많이 넘어가는 추세이기도 함
        - 아무래도 ai이런 거는 스키마를 정해두기 힘드니까

## RDS

### DB 인스턴스

- 크게 두가지 업무를 수행
    - 컴퓨팅 - 여기서 인스턴스 클래스를 지정
    - 저장 - 여기서 인스턴스 스토리지를 지정
- 인스턴스 클래스 > 컴퓨팅용
    ![image19.png](./images/post3/image19.png)     
    - DB에 맞는 클래스를 선택해주면 됨
    - 부스트 가능: 특정 기간 동안 사용하지 않았던 cpu를 모아서 한 번에 사용?
- 인스턴스 스토리지 > 저장용
    ![image20.png](./images/post3/image20.png)     
    - 범용
        - G(General)로 시작되는 애 쓰면됨
    - 프로비저닝된 IOPS
        - 조금 더 빠른 속도
    - 마그네틱 사용 X
    - 사실상 얘네들이 EBS의 스토리지 종류들
- 인스턴스에 DB연결할 때 EBS 사용
    - DB의 핵심요소인 재해복구 - 스냅샷 가능
    - 인스턴스가 EC2이기 때문에 EC2에 사용할 수 있는 Storage 필요

### 보안
![image21.png](./images/post3/image21.png) 
- RDS 암호화 꼭 하기!

### 백업 

- 스냅샷 이용해서 백업 - 자동
    - <u>**35일동안 보관**
    - **EBS를 사용하기 때문에 스냅샷 사용**</u>
- 수동 백업
    - 35일 이후에 더 필요하면 수동백업을 이용해서 백업해야함

### DB 이중화

![image22.png](./images/post3/image22.png) 
- 백업용 DB
    - 하나는 아무일도 안하고 진짜 대기만 함 (읽기도 못함)
    - 자동으로 동기화됨
    - 프라이머리가 다운되면 아무 조치를 취하지 않아도 자동으로 대기→프라이머리로 변경
    - 이후, 장애 복귀되면 다운됐던 DB 상태를 다시 대기로 바꿈
    - 그럼 왔다갔다 하면서 작업되나???
- 위 그림은 초창기 버전
    - 동기식으로 작업 진행
- <u>**idle DB의 비용 문제로 인해 Read replica라는 모델 추후에 새로 생김**</u>
    - 따라서 Read latency를 줄일 수 있게 되는 느낌?
    - 비용적인 측면에서 놀리지 말자 > 돈 냈으니까 뭐라도 일해

## DynamoDB

- <u>**NoSQL**
    - **값이 비어있어도 문제가 되지 않음**</u>
    - 있으면 있고 없으면 없고 > 굉장히 유연한 스키마
    - Null이라도 넣어줘야 하는 RDB와의 차이점
- <u>**완전관리형 서비스**</u>
- 키-값 DB
- <u>**키값이 동일하면 sortkey라는 기능을 통해 같이 배열하는 기능**있음</u>

# 6 모니터링, 로드 밸런싱 및 크기 조정

> CloudWatch 모니터링 기능
> 
> 
> Elastic load Balancing
> 
> EC2(Clastic Compute Cloud) Auto Scaling
> 

## 모니터링

![image24.png](./images/post3/image24.png) 
- 데이터에 기반한 의사 결정
    - 모니터링 데이터를 가지고 객관적인 의사 결정할 수 있음

### CloudWatch

![image25.png](./images/post3/image25.png) 
- 하이브리드로 온프레미스와 클라우드를 같이 운영할 때, 두 데이터를 한 눈에 볼 수 있어서(단일 위치에서 모든 지표)매우 유용
- 시간을 짧게 할 순 있으나 비용 더 많이 들긴함
    - 가장 짧게는 1초 간격으로 가지고 갈 수 있음
- 경보 대응 자동화
    - 람다, 오토스케이링과 함께 유용하게 쓸 수 있음
    - 한국의 경우, 이메일로 경보 받음
    - 다른 리전의 경우, 문자로도 보내줌
- 기능
    - 지표 모니터링 (다른 서비스들의 모든 지표)
    - 알람 기능
    - 로그 수집 (흐름 로그 포함해서 모든 로그)
    - 원래 한 개 더 해서 4개인데 오늘은 3개만..

### Elastic Load Balancing

![image26.png](./post3/image26.png) 
- 클라이언트는 그냥 ELB로만 보내고 ELB가 알아서 분배해줌
    - RR, Sticky, Hash 등등 알아서 분배함
- Health check 기능
    - application의 상태를 “확인”해서 안좋으면 아예 request 안보냄
    - 근데 확인만 하고, 조치는 안함
- Target group = Autoscaling group

![image27.png](./images/post3/image27.png) 
- 고가용성
    - 트래픽이 많아지면 내부적으로 ELB안에서 로드밸런싱을 처리하는 애를 늘려줌

- ELB 구성 요소
    
    ![image28.png](./images/post3/image28.png)     
    - 리스너
        - 본인이 처리할 특정 범위를 정의해서 그것만 가져감
        - 리스너가 알아서 로드밸런싱해줌
    - 대상 그룹 (Target group)
        - 리스너에 뒤에 묶여서 리스너가 작업을 수행하는 대상
        - ec2, eks 등 될 수 있음
    - 규칙
        - 리스너가 처리할 범위를 정하는 Rule

![image29.png](./images/post3/image29.png) 
- Classic Load Balancer
    - 더이상 사용하는 것이 권장되지 않는 레거시
- Gateway Load Balancer
    - <u>**들어온 트래픽을 써드파티에 먼저 보내고 싶을 때 사용**
        - **예를 들어 보안적 이유 - 대다수가 트래픽 분석**</u>
        - AWS marketplace에서 가져다가 사용할 수 있음
    - 즉, <u>**로드밸런싱하기 전에 써드파티에 보내고 다시 받음**</u>
- ALB
    
    ![image30.png](./images/post3/image30.png)     
    - <u>**Http를 처리하는 로드밸런서**
    - **OSI 7 계층에서 application layer에서 작동**
    - **고정 ip를 제공할 수 없음**
        - **안에서 자동으로 오토스케일링**</u>
        - 따라서 ip가 계속 생성됐다 삭제됐다 하기 때문에
    - <u>**dns 기반으로 사용**</u>
        - 사용자 입장에서는 문제가 없음
    - <u>**굳이 고정 ip써야하면 alb앞에 nlb를 한 번 더 붙임**
    - **콘텐츠 기반 라우팅**</u>
        - 콘텐츠를 기준으로 라우팅할 수 있음 → ALB 장점
        - 임의로 그냥 라우팅하는 게 아님
    - TLS 오프로드
        - ec2에 부하주기 싫어서 직접 해줌
    - <u>**고정 응답**</u>
        - 특정 응답에 대해서는 ec2로 안보내고 본인이 그냥 답변 가능
        - 예) 에러 메세지
- NLB
    
  ![image31.png](./images/post3/image31.png)     
    - <u>**ALB에 비해서 빠름**</u>
    - field에서 가장 많이 씀
        - <u>**고정 ip를 사용할 수 있기 때문**</u>
    - <u>**소스 IP 주소 유지**</u>
        - 내 어플리케이션에 어느 나라 사람이 많이 들어왔는지 보고싶을 때 유용
    - <u>**탄력적 IP 주소 지원**</u>
        - 비용을 내고 ip를 살 수 있음
    
- GLB
    
  ![image32.png](./images/post3/image32.png)     

### AutoScaling

![image33.png](./images/post3/image33.png) 

- Amazon Machine Image(AMI)뿐만 아니라 다른 파일들도 필요함
- 조정 정책
    - <u>**대상 추적 조정 정책** (가장 최근에 나온 방법)</u>
        - 문제 생겼을 때 바로바로 조정 가능
    - <u>**단순 조정 정책**</u>
        - 몇 퍼씩 늘려줘
        - 조정하는 동안 트래픽이 물려서 문제 발생
    - <u>**단계 조정 정책**</u>
        - 단순 조정의 문제점을 해결하기 위해 나온 문제
        - 10프로, 20프로 이렇게 단계적으로 조정을 할 수 있게 해줌
        - 조정하는 중에도 상황이 바뀌면 유동적으로 조정 가능 (10일때 바꾸다가 20되면 다시 조정)
- 비용
    - EC2에 자동으로 포함되어 추가 비용 없음

`;

const Post7 = {
  id: 7,
  slug: SlugGenerator(title),
  title: title,
  date: 'June, 2024',
  tags: ['AWS', 'Technical Essentials', 'Storage', 'S3'],
  excerpt: '이 글은 AWS의 주요 스토리지 서비스인 EBS, EFS, S3를 비롯해 RDS와 DynamoDB와 같은 데이터베이스, 그리고 CloudWatch, ELB, Auto Scaling 등 인프라 관리 도구들을 소개한다. 각 스토리지 타입의 특성과 사용 목적, 보안 및 백업 전략, 로드 밸런싱 방식 및 오토 스케일링 정책까지 실무에 필요한 내용을 체계적으로 정리한다.',
  headings: HeadingExtractor(postContent),
  content: <MarkdownRenderer markdownText={postContent} /> // Render markdown using the MarkdownRenderer
};

export default Post7;