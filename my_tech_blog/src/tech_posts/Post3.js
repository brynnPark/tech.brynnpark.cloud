// src/tech_posts/Post2.js
import React from 'react';
import MarkdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import MarkdownRenderer from './utils/MarkdownRenderer';
import SlugGenerator from './utils/SlugGenerator';
import HeadingExtractor from './utils/HeadingExtractor';
import './post.css'

// Initialize markdown-it
const mdParser = new MarkdownIt({ html: true });
mdParser.use(markdownItAttrs);

const title = 'AWS Technical Essentials';

const postContent = `
# 1 AWS 소개

## Cloud Computing

- 클라우드 컴퓨팅을 세 단어로 표현하면
    - 인터넷을 통해 연결
    - 온디맨드
    - 종량제 요금제
- 클라우드 컴퓨팅의 주요 이점
    
    ![image1.png](./post3/image1.png)
    
    - 속도 및 민첩성 향상
        - Q) 클라우드도 결국 어딘가에서 서버를 운영하고 있는데, 서버에서 데이터를 빼서 오는 데 시간이 소요되는 거는 똑같은 거 아닌가?
        - A) 엣지 로케이션을 두기도 하고, 아무래도 글로벌 스케일로 봤을 때 유리한 거 같음
    - 몇 분 만에 전 세계에 배포
        - 모든 클라우드 서비스는 전세계에 서버 가지고 있음

## Global infrastructure

- **AZ(가용 영역)**
    - 하나 이상의 데이터 센터들의 집합
    - 데이터 센터는 수천에서 수만 대의 서버의 집합
    - 평균적으로 몇 개의 DC가 있나? 자체적으로도 알 수가 없음 ㅠ 기밀이라서 진짜 직원도 안알려줌
    - 오피셜로 모든 AWS 직원은 가용영역이 어디있는지 모름
    - AZ끼리는 멀리 떨어져 있어도 빠르게 소통할 수 있게 AWS 자체적으로 네트워크를 가지고 있음
    - 가용영역들은 물리적으로 떨어져있음
        <aside>
        💡 Why?

        - 재해복구를 위함
        - **서비스를 만들 때 절대로 하나의 AZ에만 배포하지 말고 복제를 해서 꼭 최소 2개의 AZ에 배포할 것**
        </aside>
        
- **Region**
    - AZ가 3개 이상(최소조건) 모여있는 범위
    - 현재 전세계에 33개 Region이 존재
- **Edge Location**
    - 굉장히 땅이 큰 나라는 내 위치와 Region의 위치가 매우 멀어서 latency 발생
    - 따라서 이를 해결하기 위해 Edge location 만듦
    - **Route53, CloudFront, WAF/Shield, Global Accelerator**
    - 400개 이상의 Edge location 존재
    - Edge location과 AWS 서비스 사이에는 AWS 망을 통해서 통신하게 됨
    - 따라서 사용자가 바로 인터넷 망을 이용해서 리전에 접근하는 것보다 훨씬 빠르고 안정적
    - 보통은 CloudFront를 이용해서 캐시해두고 Edge location인 CloudFront와 사용자 사이에만 인터넷망을 통해 통신하게 됨

- 어떤 리젼에 서비스를 배포해야 하나?
    
    ![image2.png](./post3/image2.png)
    
    - 지연 시간
        - 본인이 서비스를 운영할 나라/지역에서 가장 가까운 곳에 둠으로써 지연 시간을 줄임
    - 요금
        - 지역마다 택스가 다르기 때문에 요금도 다름
        - 현재는 브라질이 가장 비쌈
    - 서비스 가용성
        - 원하는 서비스가 지원하지 않는 리전이 있을 수도 있음
    - 데이터 규정 준수
        - 나라의 법이 어떤 지에 따라 데이터 규정이 달라짐
        

## 보안 : AWS 공동 책임 모델
![image3.png](./post3/image3.png)

## IAM

- AWS Root Account
    - Super User이기 때문에 모든 권한을 다 가지고 있음
    - 따라서 처음에 계정 만들 때나 빌링에 의한 문제 등 외에는 사용하지 말아라
    - Email/pw로 로그인
- IAM User
    - 영구 자격 증명
    - ID/PW로 로그인
    - **Federation User**
        - 해당 사이트에 반드시 로그인할 필요없이, 본인이 신뢰하는 그룹과는 ip연동을 통해 로그인을 제공
        - AWS는 Google, Facebook과 연동
- IAM Group
    - 유저 집합으로 정책을 상속하게 됨
    - 그룹 하위에 그룹이 들어갈 수는 없음
- Policy
    - User 혹은 Group에게 policy를 통해 권한을 부여
    - 권한
        - Identity: 은미한테 S3에 대한 접근 권한을 주는 것
        - Resource: S3한테 많은 요청 중에 은미 요청만 받아!
    - IAM Role
        - 임시 자격 증명
        - 잠시 모자쓰는 느낌 (역할 모자)
        - AssumeRole API를 통해 특정 시간동안만 일을 할 수 있게 STS에 요청해서 Role을 부여받음
        - 대신 해당 시간동안은 본래 가지고 있던 user policy 범위의 업무는 할 수 없게 됨

# 2 AWS 컴퓨팅

> Amazon Elastic Compute Cloud(Amazon EC2)의 주요 개념
> 
> 
> Amazon Elastic Container Service(Amazon ECS)
> 
> Amazon Elastic Kubernetes Service(Amazon EKS)
> 
> AWS Fargate
> 
> AWS Lambda
> 

### 컴퓨팅 서비스 종류

- 인스턴스
- 컨테이너
- 서버리스
    - AWS의 완전 관리형 서비스
    - 필요할 때만, 요청이 들어오는 특정 이벤트 순간에만 서버가 돌아감
    - Fargate, Lambda

### EC2

- AWS의 대표적인 컴퓨팅 서버
- EBS / instance store  스토리지 공간 둘 중에서 선택해서 매핑
    - instance store는 EC2와 같은 공간에 있음 → 따라서 EC2를 종료하거나 죽이면 같이 죽음
        - 속도가 빠르다는 장점이 있으나, 휘발성
    - EBS는 같은 AZ안에 있는 또 다른 저장공간 → 따라서 EC2를 종료하거나 죽여도 죽지 않음
        - 데이터의 지속성이 중요할 때 사용
        - 스냅샵, 암호화 기능 등 더 많은 기능 존재
- AWS에서 필요한 OS 이미지를 미리 만들어뒀기 때문에 그걸 그대로 사용 혹은 커스텀 이미지 사용
    - 이미지 : AMI (Amazon Machine Image)
- 인스턴스 유형 - 크게 5가지
    - 범용 ex) M5
    - 컴퓨팅 최적화 ex) C5
    - 메모리 최적화 ex) R6g
    - 가속 컴퓨팅 ex) P4
    - 스토리지 최적화 ex) D2
    
    > **인스턴스 표기법**
    > - **FGa.S** 형태로 표기
    >     - **F**: Family
    >     - **G**: Generation (높을 수록 성능 좋음)
    >     - **a**: attributes
    >     - **S**: Size
    > 
    > **ex) c3n.xlarge**
    > - c: 컴퓨팅 최적화
    > - 3: 3세대
    > - n: 네트워크에 최적화
    > - xlarge: 큰 사이즈

- 인스턴스 수명 주기
![image4.png](./post3/image4.png)    
    - 보류 중 / 중지 중 / 중지됨 / 종료 중 / 종료됨 상태 → 비용 지불 안됨
- 스팟 인스턴스
    - 비어있는 인스턴스에 대해 최대 90프로까지 싸게 경매를 붙임
    - 대신 AWS가 서버가 모자라면 갑자기 뺏어감 (뺏어가기 2분 전에 알림옴)
    - 따라서 계속 돌아가야하는 서비스는 사용하면 안됨
    - 블프같은 행사같이 서버 확 늘려야될 때 (스팟+오토 스케일링) 조합으로 사용 추천
- 전용 호스트
    - 서버 하나를 전체로 소유하는 개념
    - 나중에 배울 전용 인스턴스랑 약간 다른 개념
- 인스턴스 테넌시? >>>> 다시 봐보기
  ![image5.png](./post3/image5.png)    
    - 전용 테넌시 / 공용 테넌시로 나뉘고
        - 전용 테넌시는 한 데이터 센터의 공간을 예약하는 것
        - 공용은 공간을 나눠서 사용
    - 전용 테넌시는 다시 전용 인스턴스 / 전용 호스트 로 나뉨
        - 전용 인스턴스는 하나의 인스턴스를 그냥 예약해서 혼자만 씀
            - 하나의 데이터 센터에, 본인의 인스턴스만 띄울 수 있음 (타인꺼 불가능)

### 컨테이너

- VM vs. Container
    - Container는 OS를 일일이 부팅할 필요가 없기 때문에 더 빠름
    - 컨테이너는 운영 체제 커널을 공유
- 컨테이너 운영 환경
    - Orchestration
        - 여러 개의 컨테이너를 관리
        - ECS / CKS
    - Hosting (Container engine)
        - 컨테이너 너 여기서 떠 등의 위치 지정 등의 호스팅을 함
        - EC2 / Fargate
    - Register
        - 컨테이너를 보관
        - ECR
- ECS / EKS
    - EKS
        - 사람들이 자꾸 EC2 위에 k8s 소프트웨어 깔아서 컨테이너 사용하니까 AWS에서 자체적으로 k8s를 사용할 수 있도록 만드는 서비스
    - ECS는 훨씬 심플
    - EKS는 조금 더 복잡하지만 k8s 쓰던 사람들은 그대로 포팅가능해서 편리

### 서버리스 컴퓨팅

**이점**
![image6.png](./post3/image6.png)        
  - 얼마만큼만 쓰겠다고 지정만 해주면 알아서 보안패치도 하고 관리도 해줌
  - 이벤트가 발생하면 알아서 처리하고 종료됨

**Lambda**
  - 컴퓨팅에서 사용되는 서버리스 서비스
  - 람다에 코드를 올려놓고 핸들러를 통해 작업을 처리함

- 왜 Lambda를 안쓰고 EC2를 쓰냐?
    - Lambda는 딱 15분만 동작하기 때문에 그 이상 동작하는 작업이면 EC2를 사용해야함
    - 15분 이상 작동이 되면 다 리셋됨
    - 따라서 16분 작동을 위해 15분 + 1분(앞 내용 다 리셋)으로 2번 호출 → 불가능
    - 15분 이하 작업을 100번 1000번 부를 때는 적합
    - 서로 다른 사람들이 작업을 할 때는 모듈별로 각자 모듈들을 람다로 돌리기도 함

**Fargate**
  - ECS / EKS에서만 사용할 수 있음
  - 컨테이너에서만 사용할 수 있는 서버리스 서비스

# 3 AWS 네트워킹

> 다루는 개념:
> 
> - Amazon Virtual Private Cloud (Amazon VPC)
> - 서브넷
> - 라우팅 테이블
> - 네트워크 엑세스 제어 목록( 네트워크 ACL)
> - 보안 그룹
> - 호스트 기반 방화벽
> - Amazon VPC 흐름 로그

![image7-1.png](./post3/image7-1.png)    
위 그림이 Cloud에서의 가장 기본적인 네트워크 구조이다. 가장 큰 단위인 Region 안에 VPC가 포함되고, VPC 안에 AZ가 포함된다. 
각 AZ는 최소 1개에서 최대 200개의 Subnet으로 구성되어 있으며, Public과 Private으로 나뉜다.

![image7-2.png](./post3/image7-2.png)    
위와 동일한 구조이지만, 이렇게 AZ가 VPC 밖으로 나오게 그릴 수도 있다. 이 경우는 하나의 VPC만 그렸지만, 하나의 AZ가 여러 VPC를 가지고 있을 수 있다. 
(즉, 여러 개의 VPC가 하나의 AZ 안에서 Subnet을 공유 혹은 나눠가지는 형태가 되는 것)

### VPC

- <u>**인터넷으로 부터 나의 네트워크를 격리**</u>
- 하나의 집이라고 생각
- 지정되어 있는 특정 ip의 범위를 사용한다고 지정
- 하나의 VPC 안에 최소 2개 이상의 AZ 배치 > 재해 복구
- 여러 Region에 걸쳐있을 수 없음 > 무조건 하나의 Region에 온전히 있어야함
    - <u>**Region당 최대 5개 VPC 생성 가능**</u>
- VPC 생성 시 필요한 요소는 아래와 같음
    - Region
    - VPC Name
    - IP Range

### Subnet

- VPC안에서 지정되어 있는 ip를 나눠서 관리하는 단위
    - **<u>하나의 VPC에 최대 200개 생성 가능**</u>
- public subnet
    - 인터넷과 facing 되어 있음
- private subnet
    - 인터넷과 facing 되어 있지 있음
- 각각을 따로 만드는 게 아니라 그냥 서브넷 하나를 만들고 그 안에서 설정을 통해 프라이빗이 되고, 퍼블릭이 되는 것
    - 처음부터 프라이빗/퍼블릭 구분해서 서브넷 만드는 거 아님!
- **<u>서브넷은 하나의 AZ 안에서만 있을 수 있음 > 여러 개 걸치는 거 불가능**</u>

### Gateway

- 격리된 공간을 인터넷과 연결하는 것
- **IGW (Internet Gateway)**
    - 일반적으로 클라이언트가 요청하는 요청들이 이 게이트웨이를 통해서 vpc에 들어올 수 있음
    - 고객들과 인터넷으로 통신
    - VPC 생성 시 자동으로 생성? 자동으로 VPC당 <u>**1개 생성.**</u> 만약에 gateway ip를 내가 바꾸고 싶으면? 바꿀 순 있으나 굳이 할 이유는 없음. 매우 복잡하고 생성되는 거 쓰는 게 일반적.
- **NAT gateway**
    - 프라이빗 서브넷에 있는 인스턴스가 인터넷이랑 facing을 하게하기 위해 거쳐가는 게이트웨이
    - 이걸 거쳐서 인터넷 게이트웨이로 이동
    - 퍼블릭 서브넷에 위치해있음
- **VGW(Virtual Gateway)**
    - 기존에 있는 on-premise와 vpc와의 연결을 위해 사용하는 게이트웨이
    - VPN으로 on-premise와 vpc를 암호화해서 인터넷 연결하고
        - vpc에서는 vgw가 입구
        - on-premise에서는 고객 게이트웨이가 입구가 됨
- **on-premise <> vpc 연결 방식**
    - **Side-to-Side VPN**
        - VPN니까 암호화됨
        - 다만 VPN 자체 제약도 있음
    - **AWS Direct Connect**
        - 물리적 연결
            - 전용선은 LG가 깔아줌 (AWS와 협력)
        - 암호화안됨
        - 대신 대역폭이 증가할 순 있음

### VPC Routing

- **Route Table**
    - <u>**각각 서브넷에 연결**</u>
    - 여러 서브넷에 연결될 수 있음 (하나의 서브넷이 여러 라우팅 테이블 가질 수는 없음)
    - 서브넷에서 나오는 트래픽들이 어디로 갈 지 경로를 안내해줌
    - local 경로
        - 항상 라우팅 테이블에 포함되어야 함
        - vpc local range 내에 있는 ip는 다 vpc로 감
    - 그 이 외에 ip는 게이트웨이를 통해 인터넷과 연결됨
- vpc 생성하면 자동으로 aws에서 기본 라우팅 테이블 생성해줘서 서브넷과 연결됨
- 이 외의 네트워크 트래픽은 사용자가 사용자 지정 라우팅 테이블에 경로를 추가해서 연결

### NACL & 보안 그룹

- **NACL**
    - <u>**서브넷 단위로 보안**
    - **처음에 생성하면 전부 허용**</u>
    - 규칙을 따로 설정
        - 인바운드 규칙
        - 아웃바운드 규칙
        
        <aside>

        💡 **왜 인바운드 & 아웃바운드 둘 다 검사하나?**
        
        - 답변이 나갈 때도 나가는 게 맞는 지 확인하는 것이 아웃바운드

        - <u>**상태 비저장**</u>
            - 아웃바인드에서 검증해도 저장해두지 않고 나가는 것도 다시 검사
        </aside>
        
        - 규칙번호
            - 순서를 잘 정하는 것이 중요
            - 따라서 100/200/300 이런 식으로 텀을 두고 만드는 것을 추천
            - 그래야지 중간에 삽입해야할 때, 101 이런 식으로 규칙 순서를 정할 수 있음
            - 100번 규칙에 포함되면 그 밑 규칙은 보지 않고 넘어감
            - *은 규칙번호 최하단을 의미
        - 명시적 Deny vs. 암묵적 Deny vs. 명시적 Allow
            - 거부를 우선시함 > Deny랑 Allow가 만나면 Deny
    - 개인이 사용할 때는 영향 범위가 크기 때문에 잘 사용안하고 <u>**보안 그룹 사용**</u>
    - 기업 단위로 할 때 많이 사용
- **보안 그룹**
    - <u>**서브넷 안에 있는 리소스(인스턴스) 하나하나 단위로 보안**
    - **상태 저장** </u> > 들어온 애는 상태 저장 안함
        - 들어온 애는 믿고 넣어줬으니 믿고 보내준다
    - <u>**일반적인 아웃바운드는 체크 / 인바운드로 들어온 애는 아웃바운드 체크 안함**
    - **보안 그룹을 만들면 아웃바운드는 기본적으로 다 허용되어 있고, 인바운드는 기본적으로 다 막혀있음**</u>
        - 따라서 인바운드 열어주는 것만 하면됨 > 몇 번 규칙이든 걸리기만 하면 들어올 수 있음
- ACL + 보안 그룹인 경우,<u> **ACL이 1차적으로 걸러지고 그 다음에 보안 그룹에 의해 걸러짐**.</u>
    - 즉, <u>**인바운드에서 우선 순위는 acl**</u>이다.
- 반대로 <u>**아웃바운드를 생각해보면, 역순으로 적용**됨.</u>
    - 즉, 보안 그룹에서 1차로 걸러지고, ACL에 의해 나갈 수 있음
    - 하지만 보안 그룹은 보통 아웃바운드 룰이 없기 때문에 신경을 안써도 될 듯?
- 보안 모범 사례
![image8.png](./post3/image8.png)     
    - 흐름 로그
        - 어떤 보안 그룹을 통해서 인바운드됐고, 몇 시에 트래픽이 발생했는 지, 어떤 보안 그룹에서 거절됐는 지 등이 기록됨

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
![image9.png](./post3/image9.png) 
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

![image10.png](./post3/image10.png) 
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

![image12.png](./post3/image12.png) 
![image13.png](./post3/image13.png) 

- 리전 서비스
    - vpc 내부에 있는 서비스가 아니라 Region 단위 서비스
    - 따라서 vig를 이용해서 vpc로 나가야함 > 따라서 endpoint를 뚫어서 private하게 경로 설정해두기도함
    - 또 다른 리전 서비스 예시) kms, dynamoDB

- 보안
![image14.png](./post3/image14.png)     
    - 서버 측에서 kms이용해서 암호화해주거나
    - 클라이언트 측에서 이 키로 암호화해줘하거나
    - 뭐가 됐든 일단 클라이언트가 선택해야함

- 스토리지 클래스   
![image15.png](./post3/image15.png)     
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
  ![image17.png](./post3/image17.png)     
    - EC2위에 DB를 올려서 사용하기도 함
    - 그래서 그냥 AWS에서 자체적인 완전관리형 DB를 만들어버림
- AWS는 **완전관리형** 데이터베이스
  ![image18.png](./post3/image18.png)     
    - 하드웨어 종류, 저장 공간 용량 등과 같은 부분들 설정하면 AWS에서 알아서 해줌

![image18.png](./post3/image18.png) 
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
    ![image19.png](./post3/image19.png)     
    - DB에 맞는 클래스를 선택해주면 됨
    - 부스트 가능: 특정 기간 동안 사용하지 않았던 cpu를 모아서 한 번에 사용?
- 인스턴스 스토리지 > 저장용
    ![image20.png](./post3/image20.png)     
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
![image21.png](./post3/image21.png) 
- RDS 암호화 꼭 하기!

### 백업 

- 스냅샷 이용해서 백업 - 자동
    - <u>**35일동안 보관**
    - **EBS를 사용하기 때문에 스냅샷 사용**</u>
- 수동 백업
    - 35일 이후에 더 필요하면 수동백업을 이용해서 백업해야함

### DB 이중화

![image22.png](./post3/image22.png) 
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

![image24.png](./post3/image24.png) 
- 데이터에 기반한 의사 결정
    - 모니터링 데이터를 가지고 객관적인 의사 결정할 수 있음

### CloudWatch

![image25.png](./post3/image25.png) 
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

![image27.png](./post3/image27.png) 
- 고가용성
    - 트래픽이 많아지면 내부적으로 ELB안에서 로드밸런싱을 처리하는 애를 늘려줌

- ELB 구성 요소
    
    ![image28.png](./post3/image28.png)     
    - 리스너
        - 본인이 처리할 특정 범위를 정의해서 그것만 가져감
        - 리스너가 알아서 로드밸런싱해줌
    - 대상 그룹 (Target group)
        - 리스너에 뒤에 묶여서 리스너가 작업을 수행하는 대상
        - ec2, eks 등 될 수 있음
    - 규칙
        - 리스너가 처리할 범위를 정하는 Rule

![image29.png](./post3/image29.png) 
- Classic Load Balancer
    - 더이상 사용하는 것이 권장되지 않는 레거시
- Gateway Load Balancer
    - <u>**들어온 트래픽을 써드파티에 먼저 보내고 싶을 때 사용**
        - **예를 들어 보안적 이유 - 대다수가 트래픽 분석**</u>
        - AWS marketplace에서 가져다가 사용할 수 있음
    - 즉, <u>**로드밸런싱하기 전에 써드파티에 보내고 다시 받음**</u>
- ALB
    
    ![image30.png](./post3/image30.png)     
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
    
  ![image31.png](./post3/image31.png)     
    - <u>**ALB에 비해서 빠름**</u>
    - field에서 가장 많이 씀
        - <u>**고정 ip를 사용할 수 있기 때문**</u>
    - <u>**소스 IP 주소 유지**</u>
        - 내 어플리케이션에 어느 나라 사람이 많이 들어왔는지 보고싶을 때 유용
    - <u>**탄력적 IP 주소 지원**</u>
        - 비용을 내고 ip를 살 수 있음
    
- GLB
    
  ![image32.png](./post3/image32.png)     

### AutoScaling

![image33.png](./post3/image33.png) 

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

const Post3 = {
  id: 3,
  slug: SlugGenerator(title),
  title: title,
  date: 'June, 2024',
  tags: ['AWS', 'Technical Essentials'],
  excerpt: '이 포스팅은 클라우드 컴퓨팅의 기초적인 요소와 AWS 서비스를 훑어본다. 특히, 서비스를 설계하기 위해 필요한 기초적인 서비스를..',
  headings: HeadingExtractor(postContent),
  content: <MarkdownRenderer markdownText={postContent} /> // Render markdown using the MarkdownRenderer
};

export default Post3;

