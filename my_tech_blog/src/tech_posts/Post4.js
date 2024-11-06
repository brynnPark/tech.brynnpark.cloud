// src/tech_posts/Post2.js
import React from 'react';
import MarkdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import MarkdownRenderer from './utils/MarkdownRenderer';
import SlugGenerator from './utils/SlugGenerator';
import HeadingExtractor from './utils/HeadingExtractor';
import './post.css'

const imgUrl = `${process.env.REACT_APP_S3_IMG_URL}/post4`;

// Initialize markdown-it
const mdParser = new MarkdownIt({ html: true });
mdParser.use(markdownItAttrs);

const title = 'Architecting on AWS (1)';

const postContent = `
# Architecting on AWS

# 1 아키텍팅 기본 사항

- AWS 서비스를 사용하면 어떤 이점이 있습니까?
    - 민첩성 UP
        - 출시 시간 단축
        - 혁신 확대
        - 원활한 크기 조정
    - 복잡성 및 위험 DOWN
        - 비용 최적화
        - 보안 취약성 최소화
        - 복잡한 관리 작업 감소
- AWS Global Infrastructure는 어떻게 구성되어 있습니까?

## AWS Service

## AWS Infra

### Local Zones

- Edge Location이 있지만 이건 총 5개의 서비스—Route53, CloudFront, WAF/Sheild, Global Accelerator—밖에 지원하지 않음
- 따라서 고객의 불만이 쇄도함
- 이를 해결하고자 나온 게 Local Zone
- **주요서비스를 포함한 많은 서비스를 local zone 안에 하나의 AZ를 만들어서 사용가능**
- 이것도 AWS 전용 네트워크(이중화되어 있는 고속네트워크임)로 연결됨
- 기존에 있는 VPC가 확대돼서 local zone에 있는 az도 해당 vpc에 들어감 > **vpc로 묶이게 되는 것** (그렇다고 같은 리전인거는 아님. 그게 안되니까 로컬로 뺀거잖아)
    - “**AWS 리전의 서비스에 연결되었다.**” 라고 표현
- 리전에 들어갈 수 있는 서비스의 일부를 로컬존을 만들어서 가까이서 사용할 수 있도록 함
- Region이랑 연결되어 있는 local zone이 없거나 연결되어 있어도 사용가능한 local zone이 없으면 사용할 수 없음

### Edge Location

- 고객은 S3가 있는 먼 곳까지 인터넷망을 타고 갈 필요가 없이 Edge Location까지만 인터넷망을 타고 가고, 지연시간을 줄일 수 있음

### AWS Local Zones vs. Edge Location
![image1](${imgUrl}/1.png)

## AWS Well-Architected Framework

![image2](${imgUrl}/2.png)

- 아키텍트마다 우선순위가 다름 → 각자의 우선순위에 맞게 아키텍트함
- 성능 효율성과 운영 우수성은 같이 묶어서 이야기할 수 있음

- AWS Well Architected Tool
    - 아래 사항들을 다 지정해서 workload를 만들면 알아서 risk를 분석 등을 제공해서 아키텍처를 설계할 때 매우 도움을 주고, 재설계할 부분도 도와줌
        - Workload를 만들고
        - Profile
        - Lens: 어떤 포인트—DevOps, Serverless 등—에 더 초점을 맞춘 건지 선택
    - 기본적으로 비용이 들진 않으나, 사람한테 추가적으로 컨설팅을 받고 싶으면 그 부분은 추가 비용이 듦

# 2 계정 보안

> AWS계정과 리소스에 대한 액세스를 관리하는 모범사례는 무엇입니까? IAM
> 
> 
> 사용자에게 필요한 리소스만 액세스 권한을 부여하려면 어떻게 해야합니까? IAM, Role
> 
> 다중계정을 관리하는 가장 좋은 방법은 무엇입니까? Organizations
> 

## 보안 주체 및 자격 증명

- 보안 주체
    - 특정 작업에 작업을 할 수 있는 것들(IAM 사용자/리소스/역할/페더레이션 사용자 모두 될 수 있음)

### IAM

- Root Account
    - 무려 credit card 정보(billing)까지 있는 super user
    - **Email/Pw**
    - 사용하는 데 권장되지 않음
    - **MFA 항상 같이 쓰기**
    - **IAM user를 생성할 수 있는 admin iam user를 생성해서 대신 그걸 사용하기**
- **IAM 서비스는 크게 2가지 일을 함**
    - **인증 > 로그인을 한다는 게 인증하는 거**
    - **권한 부여 > policy/role을 통해 부여**
- IAM User
    - AWS 사용 방법 2가지
        - **Id/Pw** 이용해서 console에 접속할 수 있음
        - AKID/SAK 이용해서 CLI/SDK 사용
            - **AKID(Access Key ID)/SAK(Secret Access Key)** → **credential** 이라고 칭함
            - **이건 환경변수에 등록할 수 있음.** AWS가 config 관리 따로 해주기도 함
            - 소스코드에 등록하면 안됨!!
    - MFA 항상 같이 쓰기
    - 로그인을 해서 올바른 사람이라는 증명을 함
        - 각 사용자는 고유한 자격 증명을 소유
- **Federation User**
    - 신뢰하는 사이트에 로그인이 된 사람을 연동해서 자동으로 연결해서 AWS에 로그인할 수 있게 함
        - 신뢰 사이트 : Google, Amazon, Facebook
- IAM Group
    - User들의 집합
    - **그룹 밑에 그룹이 들어갈 수 없음**
- Policy (정책)
    - **JSON 형태로 만들어져 있음**
    - **Managed Key**
        - **1:N 매핑**
        - 미리 만들어진 템플릿 정책이라고 생각하면 됨
        - 기존에 만들어져 있는 이 정책을 사용자 혹은 그룹 혹은 리소스에 붙일 수 있음 (연결)
        - 사용자가 사라져도 정책은 나눠져있음
        - Managed는 크게 2가지로 나뉨
            - AWS에서 관리 : 굉장히 많은 사람들이 사용하는 걸 AWS에서 미리 만들어놓음
            - 고객 생성 관리 : 직접 사용자가 생성
    - **Inline Key**
        - **1:1 매핑**
        - 콘솔에 보관해뒀다가 떼었다 붙이고 이런 거 불가능
        - **하나를 만들면 붙인 사용자한테만 사용할 수 있고, 사용자가 사라지면 정책도 같이 사라짐**
        
        <aside>
        💡 **Managed vs. Inline Key : 어떤 걸 사용하는 게 더 좋을까?**
        
        - 강사님마다 다르지만 다수의 강사님의 의견
        - 직접 만들어서 쓰는 게 더 좋음
        - AWS에서 만든 거는 갑자기 변할 수 있음 (물론 미리 고지해주긴 함)
            - 이러한 상황에 갑자기 서비스가 오작동할 수 있음
        </aside>
        
- IAM Role
    - **임시자격증명**
    - **역할이 부여되는 순간 원래 user policy는 사라짐**
    - 자격을 주려면 아래 두 가지가 선행되어야함
        - What: 어떤 특정 업무를 요구하고 있나
        - Who: 역할을 주려는 대상이 신뢰할 수 있는 대상인가
    - 역할은 내 계정(IAM user) 아래에 있는 사용자들에게만 주는 것이 아니라 다른 계정에게도 줄 수 있음
    - STS에 Role 요청
        - **최소 15분에서 최대 12시간까지의 타임스탬프 넣어서 요청 가능**
        - 그러다가 **타임스탬프가 끝나면 역할 끝남**
        - 그래서 **타임스탬프가 자동으로 갱신되기도 함**
        - 갱신 때 새로운 Key가 만들어지기 때문에 기존 Key는 못 씀 > 보안
        - **Cloud Trail log** 로그로 다 남김
            - 언제 역할을 받았고
            - 타임스탬프가 언제 갱신됐고 등
            - 따라서 추적이 훨씬 쉬어짐
            - User는 처음에 배정된 뒤에 빼고는 로그를 발생하지 않음
    - STS에 AsusmeRole api를 호출해서 특정 기간동안 특정 서비스를 이용할 수 있는 역할을 수임받음
        ![image44](${imgUrl}/44.png)
        - 임시보안자격 > AKID+SAK+Timestamp

- 최상위에는 Account가 있음
    - Account - Group - user

### 보안정책

- 보안 정책은 2가지로 나뉨
    
![image4](${imgUrl}/4.png)    
    - 최대 권한 설정
    - 권한 부여
    

### 권한 부여

- 권한 부여는 2가지로 나뉨
    - IAM 자격 증명 기반 정책 ([**Identity-based policies**](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html#policies_id-based)) : control what actions an identity (users, groups of users, and roles) can perform, on which resources, and under what conditions.
    - IAM 리소스 기반 정책 ([**Resource-based policies**](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html#policies_resource-based)) : attach to a resource such as an Amazon S3 bucket. These policies grant the specified principal permission to perform specific actions on that resource and defines under what conditions this applies. Resource-based policies are inline policies.
- Managed 자격 증명 기반 정책
    
    ![image5](${imgUrl}/5.png)    
    - 크게 두 가지로 나뉨
        - AWS 관리형
        - 고객 관리형

![image6](${imgUrl}/6.png)
- managed이든, inline이든 위와 같은 포맷을 지님
    - inline은 principal(주체)만 추가됨
- 정책에 아래 3가지는 무조건 포함되어야함
    - Effect
    - Action
    - Resource
- arn은 리소스가 가지고 있는 주민번호같은 것 > 고유값

![image8](${imgUrl}/8.png)>>>>>여기 이미지 다시
- 명시적 허용, 명시적 거부, 암시적 거부 이렇게 3가지가 존재
    - AWS는 아래와 같이 명시적 거부가 우선됨
        
        ![image8](${imgUrl}/8.png)        
    - 명시적 허용을 하지 않는다면 암시적 거부가 되는 것.
    - 사용자가 모르고 거부를 하지 않을 경우를 보안적 판단으로 인해 암시적 거부를 하나, 명시적 거부하는 것이 권장됨
    
- 리소스 기반 정책
    
    ![image9](${imgUrl}/9.png)    
- Principal이라는 주체를 추가함 (사용할 계정주인 명시)

![image10](${imgUrl}/10.png)

### 다중 계정

- 팀이 커지고 그룹이 많아져서 나눠서 관리해야 할 필요가 있을 때
- 계정 별로 규제 준수 프로세스가 다를 수 있음
- 계정 별로 billing하고 싶을 때

- **AWS Organizations**
    
    ![image11](${imgUrl}/11.png)    
    - 관리 계정에서 통합결제 가능
        - 특히 많은 양을 사용하면 할인해주기 때문에 통합하면 할인받을 수 있음 (sustained billing인듯?)
    - OU - Organization unit
    - ou밑에 ou들어갈 수 있음
    - SCP를 조직단위로 사용해서 권한 제어할 수 있음
        
         ![image12](${imgUrl}/12.png)           
        - SCP - Service Control Principle

- 계층형 방어 적용
    ![image13](${imgUrl}/13.png)       

# 3 Networking 1

> 워크로드를 지원하기에 충분한 IP 주소가 네트워크에 있는지를 확인하려면 어떻게 해야 합니까?
> 
> 
> AWS 계정에 안전한 동적 네트워크 인프라를 구축하는 방법은 무엇입니까?
> 
> 네트워크를 리소스를 보호하기 위해 인바운드 및 아웃바운드 트래픽을 필터링하는 방법은 무엇입니까?
> 

**Overview**

![image14](${imgUrl}/14.png)   

- 처음에 subnet 생성은 무조건 다 private으로 생성됨
    - 이후 설정을 통해 public으로 바꾸는 것
    - public으로 바꾸기 위해 3가지가 필요함
    

**IP 주소**

- IP 주소는 네트워크 내의 로케이션을 식별
    - 네트워크와 호스트를 식별함으로써 로케이션 식별
    ![image15](${imgUrl}/15.png)   

- 주소 유형은 두 가지
    - IPv4
    - IPv6

**CIDR**

![image16](${imgUrl}/16.png)   

- IP의 낭비를 줄이기 위해 Prefix를 설정해두고 사용범위를 지정하는 것
- 다만, VPC ip를 지정할 때 부족하게 생성하는 건 권장되지 않고 넉넉하게 생성해야 함

**Public Subnet**
![image18](${imgUrl}/18.png)

- 원래는 비용안내고 사용할 수 있었지만, 갑자기 2주 전(24년 7월)부터 유료로 바뀜
- private → public subnet으로 만들기 위해 필요한 3가지 추가 설정
    - 퍼블릭 ip 주소 설정
    - internet gateway (igw) 만들기
    - routing table을 반드시 attach 해주기

  

- 인터넷 게이트웨이
    ![image17](${imgUrl}/17.png)     
    - 인터넷 게이트웨이는 자동으로 NAT를 수행하여 내부에서는 프라이빗 ip로, 외부에서는 퍼블릭 ip로 소통
        - 프라이빗 ip를 보호
        - 인터넷에 퍼블릭 ip를 알려줄 수 있음

- 라우팅 테이블
![image19](${imgUrl}/19.png)

    - 라우팅 테이블에서는 자동으로 local 테이블이 생성됨
    - 따라서 퍼블릭 라우팅 테이블은 igw를 따로 추가해야함
    - 만약에 프라이빗 서브넷에서 인터넷에 접근하고 싶다면 라우팅 테이블에 NAT를 따로 추가해야함
    - local 주소는 둘 다 절대로 삭제할 수 없음

- 계정 생성 시에 기본적으로 VPC가 생성되어 있음
    
    ![image20](${imgUrl}/20.png)    
    - 기본적으로 VPC 생성했을 때 AZ 2개와 라우팅 테이블이 생성됨
    - 그냥 사용해도 문제없으나 권장되진 않음

- 탄력적 IP 주소 (elastic ip address)
    
    ![image21](${imgUrl}/21.png)      
    - ip 하나를 사는 것으로 다 비용 추가됨
    - 퍼블릭 ip 주소는 원래 인스턴스가 새로 생성될 때마다 변경됨
    - 변경될 때마다 고객에게 알려줘야 한다거나 하는 번거로움을 해결하고자 해당 퍼블릭 ip를 구매함
        - DNS 사용해서 사실 크게 문제가 되진 않음
    - 인스턴스 상태 — 보류 중, 중지 중, 종료 중—등의 상태를 생각해보면
        - 중지 했다가 다시 시작해도 Ip가 바뀜
        - 중지 했다가 다시 시작하면 휘발성 정보도 다 날라감
- 탄력적 네트워크 인터페이스 (ENI/Elastic Network Interface)  
    ![image22](${imgUrl}/22.png)      
    - elastic ip랑 거의 흡사한데, eni는 논리적 lan카드로 모든 게 다 똑같이 유지됨
        - private ip
        - public ip
        - MAC address

- NAT gateway
    ![image23](${imgUrl}/23.png)      
    - NAT는 AWS에서 완전관리형 서비스로 만든 것
    - NAT 사용 이유
        - private을 보호하기 위함
        - nat가 없으면 각각 리소스마다 elastic ip 써야함
    - 사람들이 EC2를 하나 띄우고, 그 위에 NAT 인스턴스를 띄어서 여러 인스턴스들 묶어서 NAT gateway처럼 사용하기도 함
        - 내가 직접 nat gateway를 수동으로 설치한 느낌
        - 이거는 nat에 대한 완전관리는 해주지 않으나, ec2에 대한 관리는 됨
        
        <aside>
        💡 그럼 굳이 왜 사용하지?
        
        - <u>**NAT Gateway를 사용하면 탄력적 ip가 무조건 하나 필요함**</u> → 비용이 비쌈 
        - 완전 관리형보다 직접 관리하는 것을 선호
        - NAT Gateway의 대역폭은 최대 100Gbps까지밖에 확장안됨
            - 따라서 더 넓은 대역폭을 사용해야하면 직접 인스턴스 설치해야함
        </aside>
        
    - 참고 : [NAT 게이트웨이 및 NAT 인스턴스 비교 - Amazon Virtual Private Cloud](https://docs.aws.amazon.com/ko_kr/vpc/latest/userguide/vpc-nat-comparison.html)

- VPC 배포
    ![image24](${imgUrl}/24.png)      
    - 권장 사항
        - <u>**NAT 게이트웨이는 꼭 2개를 따로따로 두기**
        - **라우팅 테이블도 서브넷 2개에 한 번에 둘 수 있지만, 각각의 서브넷에서 분리해서 가지고 있는 것을 권장**
        - **왜? 고가용성을 위해**</u>
    

## VPC 트래픽 보안

### 네트워크 엑세스 제어 목록 (NACL)

- **서브넷 단위로 방화벽 역할**
- 인바운드 및 아웃바운드 트래픽 모두 허용
- **상태 비저장 (ex. 출입국 규정)**
- 번호가 가장 낮은 규칙부터 차례로 평가

### 보안 그룹

- <u>**(인스턴스) AWS 리소스 단위로 트래픽 제어**
- **상태 저장 규칙 사용**</u>
    ![image25](${imgUrl}/25.png)      
    - 들어오는 애가 허용되면, 나가는 애도 무조건 허용
- <u>**기본적으로 인바운드 거부로 설정됨**
    - **따라서 허용만 설정해주면 됨**
- **보안 그룹 내 여러 개의 인스턴스를 하나로 보는 보안 그룹**</u>
    ![image26](${imgUrl}/26.png)      
    - 여러 개의 인스턴스에 똑같은 보안 그룹 규칙을 적용하면, 보안 그룹 입장에서 하나의 보안 그룹으로 생각함
    - 이런 경우, 위 그림처럼 인스턴스 아이디 하나가 아니라 전체 보안 그룹을 소스를 지정할 수 있음
    - 이런 구조를 <u>*“**보안 그룹 체인**”*</u> 이라고 함

- 보안 그룹 vs. NACL
    ![image27](${imgUrl}/27.png)      
    

# 4 Computing

> 어떤 AWS 컴퓨팅 서비스를 사용할 수 있습니까?
> 
> 
> Amazon EC2에 신규 및 기존 서버를 배포할 때 팀이 고려해야 하는 사항은 무엇입니까?
> 
> EC2 인스턴스에 연결할 볼륨 유형을 어떻게 알 수 있습니까?
> 
> 컴퓨팅 리소스의 비용을 최적화하는 방법은 무엇입니까?
> 
> 서버리스 컴퓨팅 옵션은 어디서부터 시작할 수 있습니까?
> 

## 컴퓨팅 서비스

![image28](${imgUrl}/28.png)
- Fargate는 container에서 사용하는 서버리스

### EC2 인스턴스

![image29](${imgUrl}/29.png) 
- **태그를 이용해서 비슷한 애들끼리 카테고리화할 수 있음**
- 키 페어를 이용해서 안전하게 접속할 수 있도록 함
    - 키를 가지고 있어야만 접속할 수 있음
- 인스턴스에 스크립트를 넣을 수 있음
- 인스턴스 메타데이터를 이용하기도 함

### EC2 태그

- 태그로 각 그룹을 한 번에 관리할 수 있음
- 특히 팀별로 나눌 때 편함
    ![image30](${imgUrl}/30.png)      
    

### AMI
![image31](${imgUrl}/31.png)

- AMI는 사용자 커뮤니티 혹은 마켓 플레이스에서 받을 수 있음
- 혹은 사용자가 직접 생성할 수 있음
- 인스턴스 이름 유형과 패밀리
    ![image32](${imgUrl}/32.png)
    ![image33](${imgUrl}/33.png)
    

### Amazon EC2 key pair

![image34](${imgUrl}/34.png)

- 내가 컴퓨팅 리소스를 효율적으로 잘 사용하고 있나를 확인할 수 있는 툴
- 퍼블릭 키는 EC2에 저장되고 프라이빗 키는 사용자가 저장

### Tenancy

- 공유 테넌시
    - 하드웨어를 공유함
    - 나는 EC2 하나를 띄었지만 서버에 다른 EC2도 같이 띄우기 때문에 하드웨어를 공유하는 개념
- 전용 인스턴스
    - 다른 애들이랑 내 인스턴스를 분리해줘
    - 서버에 내 인스턴스만 들어가게 됨
    - 하지만 전용 호스트와 다른 점은 서버를 소유한 것이 아니기 때문에 서버의 위치는 리부팅 시 다를 수 있음
- 전용 호스트
    - 서버 자체를 소유
    - 리부팅해도 똑같은 서버로 국한됨
    - 서버에 국한된 정보를 이용해서 작업을 하는 경우에 사용함

![image35](${imgUrl}/35.png)

- 파티션
    - 파티션 단위로 업무 처리

![image36](${imgUrl}/36.png)

- 생성 시 딱 한 번만 실행됨
- 인스턴스를 띄우기 위해서 필요한 조건들을 미리 충족하기 위함

![image37](${imgUrl}/37.png)

- 외부에서 API 이용해서 가져올 수 없고 인스턴스 내부에서 확인할 수 있음
- 실행 중인 인스턴스 내부에서 명령어 날리면 조회가능함

## EC2 인스턴스 스토리지

### EBS (Amazon Elastic Block Store)

- 데이터를 영구적으로 보관할 수 있음
- 인스턴스에는 하나 이상의 볼륨을 부착할 수 있음 (꼭 1개만 부착하는 건 아님)
- 하지만 EBS에는 무조건 한 개의 인스턴스만 부착 가능(여러 개 안됨)
- Snapshot 기능이 있음 - 차이만 저장하는 증분형 저장
- EBS 볼륨 유형
    - SSD
        
        ![image38](${imgUrl}/38.png)

        - 워크로드에 초점을 맞춤
        - io는 입출력에 조금 더 초점
        - gp(general purpose)는 범용에 초점
            - gp2는 credit이 쌓였다가 나중에 부스트할 수 있음 (gp3는 안됨)
        - 뭘 부착할지 모르겠으면 일반적으로 gp 많이 붙임
    - HDD
        
        ![image39](${imgUrl}/39.png)
        - 스토리지
        - 백업용으로 주로 사용
        - 많이 사용하지는 않음

### Instance Store Volume

- instance가 실행 중에는 데이터가 그대로 유지가 되나, 중지/종료가 되는 순간 모든 데이터 손실
- EBS보다 조금 더 저렴
- 비영구적 - 휘발성
- 스냅샷 미지원
- 빠른 처리 가능

![image40](${imgUrl}/40.png)

- 온디맨드
    - 어떤 어플리케이션이 어떻게 서비스될지 아직 잘 모를 때 사용
- Saving Plans
    ![image41](${imgUrl}/41.png)
    
    - 길게 사용할거다 하면 좋음
    - 서비스가 어떻게 사용될지 알고 워크로드가 예상이 되면 savings plan으로 약정걸기
    - 제약사항이 적을 수록 비쌈
    - Compute는 Fargate랑 Lambda도 사용 가능하기 때문에 하나로 묶어서 결제 할인
    - EC2는 Ec2만 사용 가능
- 예약 인스턴스 (1년/3년) (reserved instance)
    - 이것도 savings plan하고 비슷한 거

### EC2 스팟 인스턴스

- 90% 할인 받을 수 있는 EC2 인스턴스
- 언제든지 작동 중단될 수 있음
    - 따라서 fault-tolerant 인 애들만 사용 가능
- 작동 중지 최대 2분전에 안내해줌
- 사용 사례
    ![image42](${imgUrl}/42.png)

    

- 무엇을 사용해야 할까?
    ![image43](${imgUrl}/43.png)

    - saving plan + spot instance + on-demand로 섞어서 사용해라
        - 기본적으로 saving plan을 사용하고 (워크로드 예상 가능하다는 전제)
        - workload가 급증할 때 spot instance를 사용하고
        - on-demand로 필요한 부분들만 사용해라
    

# 5 Storage

![image45](${imgUrl}/45.png)

## 블록 스토리지

- 하드디스크같은 애들

- 동일한 AZ 내에서만 이용할 수 있음

- AWS 블록 스토리지 종류
    - Instance Store
        - 휘발성
    - EBS
        - 영구저장

## 파일 스토리지

- <u>**기본적으로 3개의 AZ에 파일을 복제해서 저장함 > 고가용성**
- **EC2뿐만 아니라 on-premise에도 붙여서 사용할 수 있음** </u>
- 동일한 AZ아니어도 여러 AZ에 부착해서 사용가능함
- 공유 파일 같은 걸 관리하기에 좋음
- <u>**폴더 형태로 관리**</u>
    - indexer가 관리
- AWS 파일 스토리지 종류
    - EFS
        - 완전 관리형 서비스
        - 리눅스용
        - 유료 서비스로 부스트 기능 있음 (EBS와 유사)
    - FSX For Window
        - 윈도우용

## 객체 스토리지

> 파일을 저장하기 전에 객체를 만들어서 저장
> 
> - (파일 + 메타데이터 + 키) 형태로 저장

> 플랫한 형태로 관리
> 
> - 하지만 user-friendly한 키 형태로 인해 파일구조로 오해 가능 \`image/a/sdg\` 같은 구조
> - 이때  <u> **bucket name은 전세계 유일해야 함 > Dns로 사용되기 때문에** </u>

> 암호화 가능
> 
> - 서버 or 클라어인트측에서 할 수 있음 > 선택 가능

> <u>**Lifecycle policy 설정 가능**</u>
> 

### S3
![image46](${imgUrl}/46.png)
- 백업용
- <u>**기본적으로 3개의 AZ에 파일을 복제해서 저장함 > 고가용성**
- **용량 무제한(비용 무제한이 아니라 사이즈가 무제한)**
- **한 번에 올리는 파일 사이즈에는 제한이 있음 : 5TB**
    - **multipart uploader같은 거를 이용해 쪼개서 올림** </u>
- 데이터웨어하우스로 사용
- S3 Glacier
    - 아카이브용
- 정적 웹 사이트
    - 로그인해서 DB랑 붙고 고객에 따라 화면이 동적으로 변해야되는 것이 아닌 (리전에 따라 언어 다르게 지원 등)
    - 이미지 하나만 매일 보여주는 웹사이트 같은 웹 사이트 (고객에 따라 변할 필요 없음)
    - S3로 호스팅하기 위해선 S3 bucket은 퍼블릭으로 열어야함
    - 따라서 중요한 데이터 같이 넣어놓으면 안됨 !
    - 굉장히 좋은 기능. 아파치 안띄어놔도 된다~
- 객체 보호 (크게 2가지가 있을 수 있음)
    - <u>**S3 액세스 제어**</u>
        - 버킷 생성 시 자동으로 프라이빗으로 열림
        - 퍼블릭으로 열기 위해 생성 과정에서 체크박스를 체크하는 과정이 있음
        - 제어된 엑세스(리소스 기반 정책)으로 커스텀하게 관리하라 수 있음
            - 버킷을 클리해서 들어가면 permission section이 따로 있어서 여기에 JSON 넣어주면 됨
- IAM이 나오기 예전에는 ACL을 이용해서 액세스 관리를 했으나 현재는 권장되진 않음
- 액세스 포인트
    ![image47](${imgUrl}/47.png)    
    
    - 액세스 포인트가 없으면
        - 많은 접근 제어를 관리하기가 힘듦 > 인라인 정책을 하나씩 만들어야됨
        - <u>**inline 정책에는 글자제한이 있음**(표현은 20kb넘었다고 오류뜸)</u> > 인라인 정책을 쓰는 데 한계 있음
    - <u>**따라서 인라인 정책을 하나하나 만들지 않고 액세스 포인트을 이용해 제어 권한을 해결하고자 함** </u>
    - 팀별로 전부 액세스 포인트 따로 만들 수 있음
        - 따라서 세분화해서 정책을 쪼개는 개념

- 암호화 키
    - 서버에서 암호화해달라고 encrypt 버튼을 누를 수 있음
    - 이 때 사용할 수 있는 방법은 아래와 같음
        - Amazon S3 관리형 키 - Defualt
            - S3에서 암호화하면 기본적으로 이 옵션이 선택됨
            - 비용 청구 되지 않음
        - AWS KMS 키 - 키 관리형 서비스
            - 시간이 지나면 키를 자동으로 변경해줌
            - 키-값도 다시 암호화해줌
            - 비용 유료
        - 이중 계층 서버 측 암호화
        - 고객 제공 키
            - 고객이 제공한 키로 암호화
            - 고객이 제공한 키는 KMS에 저장됨
- 버전관리
    - <u>**콘솔에서 삭제를 눌러도 삭제 tag만 달아놓고 따로 보관하고 있음**
- **수명 주기 정책**
    - **intelligent-tiering이랑은 다르게 원하게 설정할 수 있음**</u>
- S3 객체 복제
    - 다른 계정으로 소유권 변경할 수 있음
    - 복제는
- <u>**S3 멀티파트 업로드**</u>
    - 조각으로 나눠서 일부분씩 업로드를 할 수 있게 함
        - 수동 사이즈 조정해서 업로드할 수는 없음
    - 한 3TB 올라가고 에러 생기면 첨부터 다시 올려야하는 번거로움을 없애줌
    - **큰 파일 올릴 때 적극적 활용 추천**
- <u>**Amazon S3 Transfer Acceleration (S3 TA)**
    - **edge location에서 사용할 수 있는 서비스**</u>
    - 데이터 장거리 이동을 위해 사용하는 서비스로 CloudFront랑 굉장히 비슷함
- 알람 설정 가능
    - 버킷에 파일 저장되면 알림 발생 후 수신 등
- 비용 관련 요인
    - <u>**비용에는 스토리지 클래스가 가장 큰 영향 미침**</u>

## 데이터 마이그레이션 도구

- 온프레미스의 데이터를 AWS로 옮기기 위한 서비스
    ![image104](${imgUrl}/104.png)    
    
    - 온라인은 기본적으로 인터넷망을 통해 옮기는 것
    - 오프라인은 aws로부터 하드웨어를 받아서 옮기는 것

### **Storage Gateway**

- <u>**온프레미스 환경과 aws 스토리지 간 연결을 해줌**
- **하이브리드 환경을 구축하기 위함으로 보임**</u>
    - 온프레미스와 클라우드 서비스를 같이 사용하고자 할 때 훨씬 많이 사용
- 이 방법을 사용하려면 <u>**온프레미스에 Storage gateway appliance를 설치**</u>해야함
    ![image105](${imgUrl}/105.png)    
    
- 종류
    ![image106](${imgUrl}/106.png)    
    
    - Tape Gateway
        - 예전에는 많이 씀
        - 현재는 큰 기업 몇 개가 장기 보관하고 싶을 때만 사용
        - S3로 보낼 수 있음
    - <u>**Volume Gateway (아래는 블록데이터일 때 해당)**
        - **Stored Gateway**</u>
            - 기본적으로 로컬에 메인으로 저장하고 백업으로 EBS를 이용
            - 원본데이터는 모두 온프레이스에 있음
        - <u>**Cached Gateway**</u>
            - aws에 모든 걸 다 백업 > 원본데이터는 aws에 있다고 생각
            - 아주 자주 사용하는 것만 온프레미스에 옮겨둠

### DataSync

- 온프레미스에서 aws로 옮길 때 사용
- aws 내부 서비스들끼리도 사용
- 최대 throughput 10GB
- 이동속도도 datasync가 훨씬 빠름
- 데이터 전송을 위한 서비스
- 데이터에 필터를 걸어서 이동할 수도 있음
    - 특정 데이터만 이동 가능
- 스케쥴링 가능
- 오류 시 재시도 가능
- Tape 기반 데이터도 이동 가능

### Snow Family

- 두 가지 종류 존재
    - AWS Snowcone : 하드디스크만한 것
    - AWS Snowball Edge : 컴퓨터만한 것

# 6 Database

- 어떤 데이터베이스가 더 좋다라고 말할 수 없고, 본인이 구축하려고 하는 시스템에 따라 필요한 거 사용하면 됨
    ![image88](${imgUrl}/88.png)    
    
    - SQL 데이터베이스
        - 읽기 쓰기를 과도하게 요구하지 않고, 규격에 맞춰서 관리하기 편함
        - 중복된 데이터 처리하기 편함
        - Amazon RDS, Amazon Aurora
    - NoSQL 데이터베이스
        - 관계형 데이터베이스보다 읽고 쓰는 처리속도가 빠름
        - 규격이 없기 때문에 유연한 데이터 형태 저장 가능
        - Amazon DynamoDB, Amazon ElastiCache

## RDB (SQL) service

### Amazon RDS

- MySQL, PostgreSQL, Intel.. DB2, MariaDB, Oracle 호환
- 완전 관리형 서비스
    - 로그 자동으로 CloudWatch에 기록됨
- 기본적으로 Amazon RDS를 띄운다는 것은 EC2+Storage를 올리는 것으로 생각하면 됨
    - <u>**(EC2+Storage) 하나가 DB cluster 구성** </u>
    - 처음 생성 시 목적에 따라 <u>**EC2 유형과 스토리지 용량을 각각 지정**</u>해서 선택해야함
        ![image86](${imgUrl}/86.png)        
        
- <u>**Read replica 최대 5개 가능**</u> > 성능과 확장성을 위해 사용
    - <u>**비동기식 복제**</u>하면서 유지됨 > 사용자 입장에서는 거의 동시에 복제된다고 느낌
    - 읽기 작업만 수행
    - 읽기 프로세스가 많을 때 사용하면 프라이머리의 부하를 줄일 수 있음
    - <u>**리전 상관없이 만들 수 있음 (같은 리전 혹은 다른 리전)**
    - **수동으로 승격됨 (장애 발생 시, 알아서 승격 요청 해야됨)**
- **다중 AZ 배포 방식 존재 (Multi-AZ)**</u> > 고가용성을 위해 사용
    - 한 쪽에는 프라이머리, 한 쪽에는 스탠바이 두고 동기식 백업
    - Primary DB가 읽기, 쓰기 모두 처리
    - Standby DB는 프라이머리를 통해 데이터 동기화만 받고 아무런 일도 처리하지 않음 (오직 백업용)
- 다중 AZ 장애 조치
    - 프라이머리가 다운되면 스탠바이가 <u>**자동으로 바로 프라이머리로 승격**</u>되면서
    - 프라이머리가 있던 AZ에 새로운 인스턴스 생성되고 동기화되면서 스탠바이됨
- <u>**자동 백업 가능 (수동 백업도 가능)**
    - **자동 백업은 35일이 지나면 사라짐 (혹은 35일 내에서 보관 기간 설정 가능)**</u>
    - 수동 백업은 삭제 설정 안 할 수도 있음
    - 스냅샷(EBS,EC2의 블록 스토리지)의 형태로 백업하기 때문에 아예 새로운 인스턴스/스토리지에 데이터 복구 > 따라서 장애 발생 복구 시, 약간의 시간 소요

**데이터 암호화**
![image89](${imgUrl}/89.png)

- AWS KMS(Key Management System)을 통해서 키를 생성한 후, 생성된 키를 Root key를 통해서 암호화해서 데이터 암호화

### Amazon Aurora

- AWS에서 작정하고 만든 RDS
- <u>**MySQL, PostgreSQL과 호환**
    - **위 두개보다 3-5배 정도 빨라 성능적인 측면에서 우수, 확장성 좋음** </u>
    - 가용성 및 내구성도 좋음 > <u>**저장영역이 3개의 AZ에 나눠서 6개 DB에 저장**</u>
- (EC2+Storage) 하나가 DB cluster 구성하는 것은 비슷
    - <u>**EC2 인스턴스만 지정해서 선택해줌**
    - **인스턴스랑 스토리지 영역이 분리되어 있음**</u>
        ![image87](${imgUrl}/87.png)        
        
        - <u>**3개의 AZ가 있고 각 AZ에 최소 2개의 저장공간 포함**
        - **저장공간 위에 읽기/쓰기를 처리하는 인스턴스 영역 따로 둠**</u>
        - 따라서 primary instance에 요청이 들어오면 6개의 저장공간을 다 처리해줌
        - 만약 read replica를 생성하면, 저장공간도 같이 생기는 것이 아니라 위에 처리되는 애만 생성되고 인접한 스토리지의 데이터 가져옴
    - <u>**용량 지정은 따로 하지 않고 기본적으로 10GB에서 시작해서** 이용할 수록 **자동적으로 증가**</u>되는 완전 관리형 서비스 (128TB까지 확장되는 걸로 앎)
- 구조
    ![image90](${imgUrl}/90.png)    
    
    - <u>**처음에 셋업하면 자동으로 3개의 AZ에 클러스터 불륨이 생성됨**
    - **처음에는 프라이머리 인스턴스만 있고 나머지는 없음**</u>
    - 이후 Read Replica(RR) 생성 > 읽기 작업 처리하는 애만 생성 (밑에 스토리지는 안생김)
- <u>**Read replica 최대 15개 가능**
    - **즉, 프라이머리까지 합해서 16개로 작업 가능**
    - **동일 리전에만 가능**</u>
    - 만약에 다른 리전에서 사용하고 싶으면 **Cross-Region RR 과 Global instance**라는 기능 따로 있음
- **오로라 서버리스 (Aurora Serverless) 서비스**
    ![image91](${imgUrl}/91.png)    
    
    - 클러스터 볼륨은 가용 영역 어딘가에 살아있고, 인스턴스들이 아예 프로비저닝 되지 않은 상태
    - AWS 자체에서 인스턴스 풀을 가지고 있다가 요청이 들어오면 인스턴스 하나 떼서 붙여주는 서비스
    - 처리가 끝나면 다시 내려가는 형태이고 미리 프로비저닝할 필요가 없음
    - 상시적으로 떠있는 오로라보다는 조금 느림 (풀링 타임 있어야하니까)
    - **RDS는 서버리스 지원이 안되는데 오로라는 됨**
    - 이용하는 만큼 돈을 냄
    - 크기 조정 가능 - 서버리스의 특징

## NoSQL service

### Amazon DynamoDB

- <u>**완전관리형 서비스**</u>
- 엔터프라이즈 지원
    - 암호화
    - 글로벌 리전
    - 세분화된 엑세스 지원 등
- <u>**키-값 데이터**</u>
    ![image92](${imgUrl}/92.png)    
    
    - 기본적으로 테이블의 형태를 가지고 있음
    - 기본 키 존재 > 이걸로 데이터를 분할해서 저장
    - 속성값 존재하지 않아도됨 (빈 형태)
- 유즈케이스
![image93](${imgUrl}/93.png)
- <u>**빠른 속도의 처리량**</u>
    - 게임회사에서 진짜 많이 씀
    - 1 ms 안에 처리가 오게 되어 있음
    

![image94](${imgUrl}/94.png)
- 어떤 제품이냐에 따라 속성이 다를 수 있음
    - 예를 들어, 신발의 경우 발 사이즈가 있지만 옷의 경우 없음
    - <u>**RDB에 모두 저장하는 거는 무리이기 때문에 동일한 스키마로 모든 상품 처리하지 않아도 되는 경우 사용**</u>
    - 전자 상거래의 경우, 빠르게 결제 처리가 되어야하므로 속도도 중요
- 테이블
    ![image95](${imgUrl}/95.png)    
    
    - 파티션키(Partition key) : 원래 기본 키로 사용

    - 파티션 단위로 나눠서 데이터 저장
        - 파티션 키를 해시 돌려서 각 파티션이 해시값에 대한 데이터를 담당하여 저장하게 됨
        - 즉, 파티션키로는 파티션만 찾아낼 수 있음 (그 안에 특정 데이터를 찾을 순 없음)
    - 정렬키: 파티션 안에서 특정 데이터를 찾고 싶을 때, 해당 정렬키로 찾음
        - ex) “PuzzleGame”에 대한 키는 TopScore가 483,610이네
    - 따라서 파티션키와 정렬키를 합친 키는 중복되면 안됨
- <u>**온디맨드 요금제**
- **프로비저닝됨 옵션**</u>
    - 미리 얼마 정도의 용량을 사용한다고 프로비저닝해두고 오토스케일링 할 수 있음
    - 설정해둔 용량을 초과하면 제어 요청됨
    - 애플리케이션 트래픽이 예측 가능한 경우 사용하기 좋음
- <u>**읽기/쓰기 용량 단위**
    - **1 RCU = 4KB를 읽을 때마다 1RCU 사용**
    - **1 WCU = 1KB를 쓸 때마다 1WCU 사용**</u>
- 일관성 옵션
    ![image96](${imgUrl}/96.png)    
    
    - 두 가지 읽기 옵션 존재 > 알아서 선택하면 됨
        - 최종적으로 일관된 읽기 (Eventually Consistent Reads)
            - 데이터의 쓰기 작업이 완벽하게 동기화되지 않아도 읽기 가능
            - 비용이나 용량 측면에서 유리
        - 강력한 읽기 일관성 (Strongly Consistent Reads)
            - 무조건 모든 이전 쓰기 작업이 동기화되어야 읽기 가능
            - 은행 업무 같은 거는 다 강력한 읽기 일관성 필요
- 글로벌 테이블 기능 (Global tables read consistency)
    - 리전 간 복제를 자동화함 (교차 리전)

## Database Caching

- <u>**성능을 최대한 높이기 위해 데이터베이스를 캐시하는 것**</u>
- 캐시해야 하는 항목
    - <u>**쿼리 속도가 느리고 비용이 많이 드는 데이터**
    - **자주 액세스하는 데이터**
    - **비교적 정적 상태로 유지되는 정보** </u>
- 캐싱 아키텍처
    ![image97](${imgUrl}/97.png)    
    (위 그림은 ElastiCache의 아키텍처)
    
    - 앞서 살펴봤던 CloudFront와 같은 캐시 아키텍처와 조금 다름
    - 서버가 캐시 클러스터에 데이터를 요청함
    - 데이터가 없으면 캐시 클러스터 <> DB가 아니라 서버 본인이 직접 DB로 가서 데이터 받아옴
    - 따라서 어떻게 DB에서 캐시 클러스터로 데이터를 가져올까에 대한 전략을 생각함
- 일반적인 캐싱 전략
    - Lazy Loading
        ![image98](${imgUrl}/98.png)        
        
    - Light Through
        ![image99](${imgUrl}/99.png)        
        
- 캐시 관리
    ![image100](${imgUrl}/100.png)    
    
    - <u>**캐시에 TTL 값을 같이 추가해서, 해당 시간이 만료되면 데이터를 읽지 못함 혹은 삭제되게 함**
    - **용량이 어느 정도 차면, 정책에 따라 삭제 가능**</u>
        - 가장 오래되거나
        - 가장 접근 빈도가 낮거나
        - TTL이 유효하지 않음
        - 위 정책 여러개를 조합할 수 있음

### Amazon ElastiCache

- <u>**aws에서 제공하고 있는 캐싱 서비스**
- **RDS 전용 캐싱서비스**</u>
- 완전관리형 서비스로 아래 두 가지 엔진 지원
    - **Redis**
    - **Memcached**
- 원래 오픈소스의 차이점 그대로 적용
    ![image101](${imgUrl}/101.png)    
    
    - 사용 목적에 맞춰서 선택하면 됨

### Amazon DynamoDB Accelerator (DAX)

- <u>**DynamoDB에 사용할 수 있는 캐싱 서비스**</u>
![image102](${imgUrl}/102.png)

## Database Migration Tool
![image103](${imgUrl}/103.png)

[https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html](https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html) 

`;

const Post4 = {
  id: 4,
  slug: SlugGenerator(title),
  title: title,
  date: 'June, 2024',
  tags: ['AWS', 'Architecting', 'Cloud Computing', 'Architecting on AWS'],
  excerpt: '이 포스팅은 AWS 서비스를 이용해 아키텍처를 설계하는 방법론에 대해 알아본다. 서비스를 설계를 위한 AWS 서비스를 자세하게 알아볼 것이며, (1)편과 (2)편에 걸쳐서 작성할 예정이다. (1)편에서는 아키텍팅의 기본 사항, 계정 보안, Networking, Computing, Storage, Database에 대해서 알아본다.',
  headings: HeadingExtractor(postContent),
  content: <MarkdownRenderer markdownText={postContent} allowImages /> // Render markdown using the MarkdownRenderer
};

export default Post4;

