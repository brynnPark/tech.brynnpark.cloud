이 글에선 AWS에서 Bastion Host와 Load Balancer를 이용하여 여러 private subnet에 배포된 웹 서버 EC2 인스턴스에 접근하고 보안된 네트워크를 구성하는 방법을 설명한다. 외부 접근에 대한 보안과 네트워크 설정에 대해서 공부하고, 로드밸런싱에 대해서 알아본다.
<br/>

( 보안 상의 이유로 모든 리소스는 실습 후 다 삭제했다. 실제로 리소스에 나온 모든 주소나 IP는 현재 접근이 불가하다.)

<br/>

#  1. 요구사항
다음과 같은 요구사항을 만족하는 안정적인 웹 서비스 환경을 구축해볼 예정이다. 
> 1. Seoul Region AZ-b, AZ-c 에 분산 배포되는 로드밸런싱 환경 구성 (Web 1,2)
> 2. Web 1, 2 은 Private Subnet 에 배포 및 NAT 를 통한 외부 통신 가능하도록 구성
> 3. Web 1, 2 은 Bastion server 를 통해서만 ssh 접속 가능하도록 구성
> <br/> (즉, 외부 접근 불가능)
> 4. LB (LoadBalancer) 를 통하여 Web 서버 접근 시, 각 서버 별로 다른 웹페이지 출력


<br/>
일반적으로 웹 서비스를 구축할 때, 보안으로 인해 웹 서버에 대한 직접 접근을 금지한다. 따라서 Bastion Host을 두고, 모든 통신을 Bastion을 통해서만 가능하게 하며, 이로 인해 <b><ins> 웹 서버들은 Private Subnet, Bastion은 Public Sunbet에 배치한다. </ins></b>

<br/>
참고로 웹 서버는 Cloud9으로 구축해도 되긴하지만, EC2가 더 일반적으로 사용되는 컴퓨팅 자원(Computing Resource)이기 때문에 EC2로 웹 서버를 구현했다.

<br/>
<br/>

# 2. 구조 설계
### 네트워크 구조
![architecture]({{imgBaseUrl}}/post16/image-1.png)
<br/>
위와 같은 구조로 아키텍처를 설계했다.

> **일반적인 유저 트래픽** <br/>
> 사용자가 브라우저나 앱에서 서버로 요청을 보내는 것
> 1. HTTP를 통해 유저의 요청을 받는다.
> 2. 인터넷 게이트웨이(IGW)를 통해서 유저의 요청이 VPC내 ALB로 간다.
> 3. ALB의 정의해둔 Forwading Rule에 의해 지정해둔 Target Group으로 요청이 보내진다.
> 4. Target Group 내에 등록되어 있는 웹 서버에 로드밸런싱 규칙에 의해 트래픽이 분산된다.
> 5. 요청이 들어온 경로와 동일한 경로로 유저에게 Response가 반환된다. (다시 ALB -> IGW 를 통해 유저에게 도달)

<br/>

> **SSH 연결** <br/>
> 보통 Admin이나 개발자 트래픽
> 1. SSH를 통해서 Bastion Host에 연결한다. (`Port 22`으로 연결)
> 2. Bastion Host에서 Private subnet에 있는 Web Server로 접속한다. <br/>
> **(같은 VPC 내에서는 프라이빗 IP를 통해 EC2 간 통신이 가능)** <br/>
> **즉, Bastion Host는 Web Server의 프라이빗 IP로 직접 SSH 접속 !!** <br/> 
> <br/>
> **[주의할 점]** <br/>
> Web Server의 Security Group(보안 그룹)이 `Port 22`에 대해 Bastion Host의 Security Group or Private IP 대역을 허용해야 함 (Inbound Rule 추가해야 함)

<br/>

> **외부 API 호출 (보통 서버 내부에서 외부 API를 호출)** <br/>
> 웹 서버(또는 백엔드)가 다른 외부 서비스의 API를 호출하는 것
> 1. 웹 서버 내부에서 외부로 트래픽을 내보낼 때, NAT 게이트웨이를 통해서 트래픽이 나가게 된다.
> 2. 이때, Private Route Table에 NAT Gateway가 등록되어 있어야 한다. 이 RT를 통해 서버의 트래픽이 NAT GW를 통해서 외부로 나가게 된다.
> 3. 외부 응답이 있다면, 그대로 NAT GW를 통해 다시 들어오게 된다. (동일 경로)

<br/>

### 고려 사항 
1. 유저의 트래픽과 Admin의 트래픽, 웹 서버내 외부 API 호출 트래픽을 분리했다.
2. Bastion Host를 독립적인 AZ에 배포해야할지, 웹 서버가 존재하는 AZ 중 하나에 배포해야할지 고민했다.
3. NAT 게이트웨이를 독립적인 AZ에 배포해야할지, 웹 서버가 존재하는 AZ 중 하나에 배포해야할지 고민했다.


### 구성 요소
**🔹 ALB (Application Load Balancer)** <br/>
트래픽이 하나의 서버로 가지 않게 하고, incoming 트래픽을 여러 서버에 분산해주기 위한 서비스이다. 
- 로드 밸런싱을 원하는 서버들을 Target Group에 등록한다.
- 로드밸런싱 Rule에 따라 트래픽 분산 가능하다. (거리 기반, 지연 기반 등)
- 나의 경우, 두 개의 서버에 기본으로 로드 밸런싱했다.
- SG을 사용해, 외부 인터넷에서 들어오는 트래픽을 허용했다.
- 추가적으로, 웹 서버에 ALB 요청을 받을 수 있도록 Inbound rule을 추가한다.
- ALB는 Region과 AZ를 선택해서 배포할 수 있는데, 서버가 존재하는 AZ에 걸쳐서 두었다. 
<br/>
**(타겟 그룹이 있는 AZ는 ALB subnet에 무조건 포함되어 있어야 함. 그렇지 않으면 제대로 로드밸런싱되지 않음 !! )**
- **ALB는 무조건 Public subnet에 위치해야 함!!!**

<br/>

**유저 요청 트래픽 경로**
```
[User's Browser or App]
       ↓ HTTP/HTTPS
   [CloudFront]
       ↓
     [ALB]
       ↓
[Private Web Server] ← 응답 반환도 이 경로로 되돌아감
```
<br/>

**🔹 Internet Gateway (IGW)** <br/>
퍼블릭 서브넷의 리소스가 인터넷과 직접 통신할 수 있도록 연결해주는 AWS VPC 컴포넌트이다.

- Public Subnet에 있는 ALB, Bastion Host 등은 IGW를 통해 외부와 통신한다.
- IGW는 VPC 단위로 생성되고, VPC 라우팅 테이블에 연결되어야 작동한다.
- IGW는 외부에서 들어오는 요청(예: 사용자 → ALB), 퍼블릭 리소스의 응답 등을 처리한다.

<br/>

**🔹 NAT Gateway (Network Address Trasition)** <br/>
Private Subnet에 있는 Web Server가 인터넷에 나갈 수 있게 해주는 게이트웨이이다.
- Web Server가 외부 API 호출이나 OS 업데이트 등 아웃바운드 트래픽이 필요한 경우 사용한다. 
    - 	apt/yum update, 외부 API 호출, 외부 webhook 요청, 패키지 설치 등야 하는 경우
    - 내부 서버가 ECR, GitHub 등 퍼블릭 리소스에 접근해야 하는 경우 (예: Docker image pull, 인증 서버 통신 등)
    - 사실상 웹 서버를 운영하기에 필수인듯 ,, 
- Public Subnet에 배포되고, Private Subnet에서 나가는 트래픽은 NAT Gateway를 거쳐 IGW로 전달된다.
- 외부에서 NAT Gateway를 통해 내부 서버에 직접 접근할 수는 없다.
- AZ마다 하나씩 배포하는 것이 권장된다 (고가용성 + 비용 최적화) <br/>
( 다만, 필수는 아님. 서비스가 크지 않다면 한 개만 두기도 함 ) 


**API 호출 (외부에 나가는 트래픽) 경로**
```
[Private Web Server] (Private Subnet)
       ↓
[NAT Gateway] (Public Subnet)
       ↓
[Internet Gateway (IGW)]
       ↓
[External API Provider (예: Google, Kakao, OpenWeatherMap)]
```

**🔹 Bastion Host** <br/>
Private Subnet에 있는 서버에 접근하기 위한 운영자 전용 SSH 중계 서버이다.
- Public Subnet에 배치되며, 운영자는 SSH로 Bastion에 접속한 후, 내부의 Web Server로 접근한다.
- Web Server에는 Public IP가 없기 때문에 직접 접근이 불가능하고, Bastion Host를 통해서만 접근 가능하다.
- 보안 그룹 설정을 통해 Bastion → Web Server SSH 접속을 허용해야 한다. (웹 서버 Inbound rules에 설정)
- Bastion Host에는 운영자의 IP만 접속 가능하도록 제한하는 것이 보안상 안전하다.
- 나는 AWS Console에서 CloudShell을 통해서 간편하게 접속하거나 그냥 로컬 터미널에서 ssh해서 접속했지만, putty를 통해서도 접속 가능하다.
- <ins>**Bastion은 보안 목적으로 Public subnet에 1대만 배치하는 것이 일반적이나, 대규모 운영이나 지리적으로 분리된 관리 대상 혹은 고가용성의 경우에 AZ별로 두기도 한다.**</ins>
- 다만, Bastion이 2개 이상이면 관리할 게 많아지고 복잡해질 수 있다.

**운영자 SSH 접속 경로**
```
[Operator's Laptop]
       ⇢ SSH (Port 22)
[Bastion Host - Public Subnet]
       ⇢ SSH (Port 22)
[Web Server - Private Subnet]
```

<br/>

**통합 트래픽 경로**

```
🌍 User
   │
   │ (1) HTTP Request: /weather
   ▼
📦 CloudFront
   │
   ▼
🟢 ALB (Public Subnet)
   │
   ▼
🖥️ Web Server (Private Subnet)
   │
   ├─── (2) Process user data
   │
   ├─── (3) HTTP Request → External API
   │         ▼
   │     🌐 NAT Gateway (AZ-local)
   │         ▼
   │     🚪 Internet Gateway
   │         ▼
   │     ☁️ External Weather API (e.g., OpenWeatherMap)
   │         ▼
   │     (4) Response: Weather data
   │
   └─── (5) Merge data & create response
   │
   ▼
(6) Response → ALB → CloudFront → User
```

<br/>

#  3. 구현
### 생성된 리소스 
![Instances]({{imgBaseUrl}}/post16/image-2.png)  
<br/>

[Bastion 인스턴스의 Security Group 구성] <br/>
![BastoinSG]({{imgBaseUrl}}/post16/image-2-1.png)  
<br/>
- 모든 SSH 통신이 가능하도록 설정했다. (좋은 방법은 아님) 정석대로라면 Admin의 IP로 한정해 허용하는 것이 맞다.
- HTTP도 필요하지 않다면 허용하지 않는 것이 좋다. (그치만 나는 혹시몰라 설정했다.)

<br/>

[웹 서버 인스턴스의 Security Group 구성] <br/>
![ServerSG]({{imgBaseUrl}}/post16/image-2-2.png)  
<br/>
- 서버의 경우, 중요한 것은 ALB에 부착한 SG로부터 들어오는 트래픽을 허용하는 것이다.
- 3번째 항목에 Source가 sg-09 로 시작하는 것이 있는데, 이 sg 그룹이 ALB가 사용하는 SG이다.
- 또한 bastion 의 접근을 허용하기 위해, 현재 VPC의 IP 대역 안에 있는 모든 트래픽에 대한 inbound를 허용했다. (좋은 방식아라고 생각하지 않는다.)

![LoadBalancer]({{imgBaseUrl}}/post16/image-3.png)  
<br/>

### ALB 구성 
![ALBRule]({{imgBaseUrl}}/post16/image-4.png)  
<br/>

![ALBRrcMap]({{imgBaseUrl}}/post16/image-5.png)  
<br/>

![TargetGroup]({{imgBaseUrl}}/post16/image-6.png)  
<br/>

[ALB 인스턴스의 Security Group 구성]
![ALBSG]({{imgBaseUrl}}/post16/image-5-1.png)  
<br/>

### 웹 서버 직접 접근 및 Bastion 접근에 따른 응답 확인
![TerminalCurl]({{imgBaseUrl}}/post16/image-7.png) 
<br/>

- 로컬 터미널(외부)에서 서버에 직접 접근할 때는 timeout error가 발생
- SSH 접근을 통해 Bastion Host에 접속해 웹 서버에 접근하면 정상 응답 반환

<br/>

![ChromeTest]({{imgBaseUrl}}/post16/image-7-1.png) 
<br/>
- 단순히 외부 접근의 경우, 그냥 chrome 같은 브라우저에서도 가능 

<br/>

![CloudShell]({{imgBaseUrl}}/post16/image-8.png)  
<br/>

- Cloud Shell을 통해서 접속했을 때도 동일한 결과를 얻었다. ( Cloud Shell에 연결했다는 거 자체가 Bastion host에 접속했다는 것이기에 정상 응답하는 것이 맞는 것 )

<br/>

### ALB를 통한 로드밸런싱 확인
![LBTerminalTest]({{imgBaseUrl}}/post16/image-9.png) 
<br/>

- 생성한 ALB의 DNS를 통해서 터미널에서 접근해봤을 때, 몇 번씩 트래픽을 보내면 각각 Web 1과 Web 2이 번갈아서 요청을 받는 것을 확인할 수 있다.

![LBWebTest1]({{imgBaseUrl}}/post16/image-10.png) 
<br/>

![LBWebTest2]({{imgBaseUrl}}/post16/image-11.png) 
<br/>

- 생성한 ALB의 DNS를 통해서 터미널에서 접근해봤을 때, 몇 번씩 트래픽을 보내면 각각 Web 1과 Web 2이 번갈아서 요청을 받는 것을 확인할 수 있다.

<br/>



