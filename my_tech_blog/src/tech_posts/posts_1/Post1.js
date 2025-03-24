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

const title = 'Architecting on AWS (1)';

const postContent = `

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
    

`;


const Post1 = {
  id: 1,
  slug: SlugGenerator(title),
  title: title,
  date: 'June, 2024',
  tags: ['AWS', 'Architecting', 'Cloud Computing', 'Architecting on AWS'],
  excerpt: '이 포스팅은 AWS 서비스를 이용해 아키텍처를 설계하는 방법론에 대해 알아본다. 서비스를 설계를 위한 AWS 서비스를 자세하게 알아볼 것이며, 5편에 걸쳐서 작성할 예정이다. (1)편에서는 아키텍팅의 기본 사항, 계정 보안에 대해서 다룬다.',
  headings: HeadingExtractor(postContent),
  content: <MarkdownRenderer markdownText={postContent} /> // Render markdown using the MarkdownRenderer
};

export default Post1;
