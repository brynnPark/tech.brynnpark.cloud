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

const title = 'AWS Technical Essentials (1)';

const postContent = `
이 글은 AWS의 전반적인 구조와 컴퓨팅, 네트워킹, 보안 구성에 대해 설명한다. 클라우드 컴퓨팅의 개념과 이점, 글로벌 인프라 구성요소(AZ, Region, Edge Location), EC2 및 서버리스 컴퓨팅(Lambda, Fargate), 컨테이너 관리(ECS, EKS), VPC와 서브넷 구조, 라우팅 테이블, 보안 그룹과 NACL의 차이 등을 체계적으로 정리한다.

# 1 AWS 소개

## Cloud Computing

- 클라우드 컴퓨팅을 세 단어로 표현하면
    - 인터넷을 통해 연결
    - 온디맨드
    - 종량제 요금제
- 클라우드 컴퓨팅의 주요 이점
    
    ![image1.png](./images/post3/image1.png)
    
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
    
    ![image2.png](./images/post3/image2.png)
    
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
![image3.png](./images/post3/image3.png)

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
![image4.png](./images/post3/image4.png)    
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
  ![image5.png](./images/post3/image5.png)    
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
![image6.png](./images/post3/image6.png)        
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

![image7-1.png](./images/post3/image7-1.png)    
위 그림이 Cloud에서의 가장 기본적인 네트워크 구조이다. 가장 큰 단위인 Region 안에 VPC가 포함되고, VPC 안에 AZ가 포함된다. 
각 AZ는 최소 1개에서 최대 200개의 Subnet으로 구성되어 있으며, Public과 Private으로 나뉜다.

![image7-2.png](./images/post3/image7-2.png)    
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
![image8.png](./images/post3/image8.png)     
    - 흐름 로그
        - 어떤 보안 그룹을 통해서 인바운드됐고, 몇 시에 트래픽이 발생했는 지, 어떤 보안 그룹에서 거절됐는 지 등이 기록됨

`;

const Post6 = {
  id: 6,
  slug: SlugGenerator(title),
  title: title,
  date: 'June, 2024',
  tags: ['AWS', 'Technical Essentials', 'EC2', 'VPC', 'IAM', 'Cloud Computing'],
  excerpt: '이 글은 AWS의 전반적인 구조와 컴퓨팅, 네트워킹, 보안 구성에 대해 설명한다. 클라우드 컴퓨팅의 개념과 이점, 글로벌 인프라 구성요소(AZ, Region, Edge Location), EC2 및 서버리스 컴퓨팅(Lambda, Fargate), 컨테이너 관리(ECS, EKS), VPC와 서브넷 구조, 라우팅 테이블, 보안 그룹과 NACL의 차이 등을 체계적으로 정리한다.',
  headings: HeadingExtractor(postContent),
  content: <MarkdownRenderer markdownText={postContent} /> // Render markdown using the MarkdownRenderer
};

export default Post6;

