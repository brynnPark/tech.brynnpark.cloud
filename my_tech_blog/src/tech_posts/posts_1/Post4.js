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

const title = 'Architecting on AWS (4)';

const postContent = `


# 9 Container

## Bare metal vs. VM vs. Container
![image123](${imgUrl}/53.png)  

- bare metal
    - 기존에 쓰는 서버 시스템
    - 하드웨어를 하나 구매해서 그 위에 서비스 구현
    - 앱 A에서의 시스템 다운이 운영 체제를 다운시키면 다른 앱들도 영향 받음 > 종속적
- VM
    - <u>**하이퍼바이저를 이용해 앱들을 격리함 > 독립적**</u>
    - 각 앱마다 필요한 운영체제 올리고 운영환경 알맞게 구성
    - 게스트 OS도 다 가상화
    - <u>**하지만 OS를 올리는 것이기 때문에 시간이 오래 걸린다는 단점이 있음**
    - **운영 체제 커널을 공유하지 않음**</u>
- Container
    - <u>**VM의 복잡성과 느린 속도를 보완함**
    - **host VM의 운영체제 커널을 공유함**
    - **컨테이너 형태로 각 앱을 묶어서 격리함 > 독립적**</u>

## 컨테이너 개요
![image54](${imgUrl}/54.png)  

- AWS에서 컨테이너를 사용하면 EC2 위에 올린다는 기준에서 위와 같은 구조를 지님
![image52](${imgUrl}/52.png)  

- <u>**이미지(Container image)를 저장소(ECR)에 저장을 하고, 실행하기 위해 host라는 것을 지정함**
    - **호스트는 EC2 혹은 Fargate (serverless)가 될 수 있음**</u>
- 굉장히 많은 이미지를 만들고 실행하려고 하면 복잡해짐
    - 따라서 나온 관리툴이 k8s
    - aws에서 k8s를 완전관리형으로 만든 것 > EKS
    - 근데 AWS도 쫀심있으니까 자체적으로 완전관리형 k8s같은 서비스 만들고 싶음 > ECS

![image156](${imgUrl}/156.png)  

- <u>**MSA에서 각 마이크로 서비스를 배포할 때, 컨테이너 단위로 배포하는 것이 일반적**</u>
    - 혹은 서버리스, VM 등

## AWS Container Services
![image55](${imgUrl}/55.png)  

- <u>**컨테이너 호스팅 == 실행 환경**</u>

### ECR
![image157](${imgUrl}/157.png)  

- 컨테이너 이미지 저장소
- ECR 안에서도 레포지토리를 파서 그 안에 **각 주제에 맞는 이미지 저장 및 버저닝 가능**
- **EC2는 AMI를 S3에 보관했는데 컨테이너 이미지는 ECR에 보관**
- 상용화돼서 사용되고 있는 서비스 **도커 허브랑 비슷함**

### ECS
![image158](${imgUrl}/158.png)

- **완전관리형 컨테이너 오케스트레이션**
- **AWS 서비스들과 통합되어 있어서 유연하고 편함**
- AWS의 쿠버네티스 버전
    - k8s만 지원해주는 것보다 자체 서비스 있으면 좋으니까 만듦
- 들어온 요청에 대해서 클러스터에 어떻게 호스팅할지 용량에 맞춰서 알아서 분배해줌
- 호스트로 EC2를 선택할 시
    - 미리 용량 선택해야 함
    - 오토스케일링 > 따로 설정해줘야 함
- 호스트로 Fargate 선택할 시
    - 용량 조절 따로 할 필요없음
    - 서버리스라서 자기가 알아서 함

### EKS
![image56](${imgUrl}/56.png)  

- 완전관리형 쿠버네티스 서비스
    - 외부의 k8s를 aws에서 사용할 수 있도록 그대로 구현해둔 서비스
- <u>**Pod 단위로 서비스를 묶어서 관리**</u>
- Fargate, EC2로 호스팅
- <u>**ECS보다 훨씬 더 많은 기능 제공**</u>

### Fargate
![image56](${imgUrl}/56.png)

- 서버리스 호스팅 컴퓨팅
- 따로 용량 조절할 필요 없음 > 오토스케일링
- <u>**요청이 있을 때만 환경이 자동으로 올라와서 요청이 있을 때만 서비스가 작동함**
- **ECS나 EKS와 붙여서만 사용할 수 있음 (Lambda처럼 단독으로 사용 불가능)**</u>
    - 단독 사용 불가

### 컨테이너 서비스 정리
![image57](${imgUrl}/57.png)


# 10 Networking 2
![image77](${imgUrl}/77.png)
![image78](${imgUrl}/78.png)

- <u>**S3는 VPC 밖 Region에 존재하는 서비스**</u>
    - EC2에서 S3로 갈 때, IGW를 통해서 나가게 되는데 이렇게 되면 인터넷망을 통해서 움직이기 때문에 불안정
    - 따라서 <u>**Endpoint를 생성해서 AWS 전용망을 이용해 통신할 수 있게 함**</u>

## VPC Endpoint

- Endpoint 하나 만들면 따로 관리할 필요 없는 완전관리형 서비스
    - <u>**자동으로 크기 조정**
    - **중복 처리도 내부에서 알아서 해줌**</u>
- 2가지 종류
    ![image125](${imgUrl}/125.png)    
    

### 게이트웨이 엔드포인트 (Gateway Endpoint)
![image79](${imgUrl}/79.png)

- <u>**RT에 경로 반드시 추가해줘야 함**
- **S3, DynamoDB만 가능**</u>
- 온프레미스에서 게이트웨이를 통해 연결된 S3를 사용하려고 할 때, 연결할 수가 없음 ..? 따라서 나온게 인터페이스 엔드포인트

### 인터페이스 엔드포인트 (Interface Endpoint)
![image80](${imgUrl}/80.png)

- <u>**ip 주소를 사용하기 때문에 라우팅 테이블에 경로를 넣어주지 않아도 됨**
- **모든 서비스 사용 가능 (원래는 S3, DynamoDB는 안됐음)**
- **인터페이스 엔드포인트를 사용한다는 거는 ENI를 내부적으로 하나 넣어준다는 것**</u>

## VPC Peering

- (참고) 아키텍처 화이트보딩
![image124](${imgUrl}/124.png)    
    
- VPC 간 연결 방법
    - <u>**단, 두 VPC 간에는 한 개의 피어링 연결만 생성 가능**
- **리전 내 및 리전 간 모두 지원**</u>
- RT에 {pcx-xxxx}와 같은 형태로 기록됨
- VPC간의 ip 주소는 중복이 없어야하기 때문에 ip range가 같으면 안됨 (RT에 주소 명시적으로 넣어야하기 때문에 겹치면 안되는 것)
- <u>**전이적 peering 관계가 없음**</u> (A <> B <> C라고 A <> C 안됨)
- 인터넷 망으로 연결되는 것이 아니라서 병목 현상 방지되고, 단일 네트워크를 이용해
- 여러 계정에 걸친 연결도 가능함

- <u>**VPC peering 이점**
    - **서비스하고 있는 다른 vpc로 igw/vgw를 이용한 인터넷망 연결이 아닌 프라이빗 네트워크를 통해 단일 네트워크를 사용하는 것처럼 접근 가능**</u>

- 그냥 VPC를 아래와 같이 피어링하면 피어링 대상도 많아질 뿐더러 너무 복잡해짐
    ![image81](${imgUrl}/81.png)    

    - <u>**따라서 레거시에서는 shared VPC를 사용하기도 했지만, Transit gateway를 통해서 이를 해결**함</u>

## Hybrid connection (networking)

- <u>**온프레미스와 클라우드 환경을 같이 사용하기 위해 연결**</u>
- VGW(Virtual Gateway)를 만들어줘야지 온프레미스 트래픽을 받을 수 있음
- 방법은 2가지 존재
    - Site-to-Site VPN
    - Direct Connect

### Site-to-Site VPN
![image82](${imgUrl}/82.png)

- <u>**암호화 지원하지만 인터넷 망을 통해 퍼블릭하게 전송**</u>

- 연결된 기간에 대한 비용만 지불 (먼가 왔다갔다 할 때만)
    - 안쓰면 비용 없음
- 따로 준비할 사항이 없음 (케이블 등)
- <u>**최대 속도 자체는 1.25Gbps로 제한적**</u>
    - 따라서 더 빠른 걸 사용하고자 하면 site-to-site 사용할 수 없음

### Direct Connect
![image83](${imgUrl}/83.png)

- <u>**중간에 direct connect location(DX Location) 존재** </u>
    ![image123](${imgUrl}/123.png)    
    
    - LG U+랑 KINX > 2개의 회사를 통해 광케이블 연결
- AWS 케이지부터는 전용케이블 사용
- 고객 케이지까지만 연결하면 됨
- 지원 대역폭 외의 대역폭을 사용하려면 AWS와 상의 필요
- <u>**광 케이블이 깔아지는 순간부터 비용**</u>
- 광 케이블이 깔아지는 데 시간 소요
- <u>**암호화되진 않고 그냥 전용 프라이빗 연결을 통해 송수신**</u>

## Gateway

### VGW

- 하이브리드 아키텍처를 만들기 위해 꼭 필요한 게이트웨이
- On-premise와 Cloud를 연결해줌
- vgw 하나만 파면 온프레미스 애들이 다 이용할 수 있음

### TransitGateway
![image126](${imgUrl}/126.png)

- VPC간의 연결 뿐만 아니라 온프레미스 연결까지 담당하는 게이트웨이
- <u>**VPC Peering의 전이적 피어링이 되지 않는 문제점을 해결, 일종의 허브**</u>
- 부분 연결 가능 (Blackhole)
- 글로벌 네트워크를 관리하는 데 필요한 라우팅 테이블 수를 줄일 수 있는 서비스
- 내부적으로 리스트 형태로 RT를 엄청 많이 정의해놨다고 생각하면 됨
    ![image127](${imgUrl}/127.png)    
    
    - **Transit Gateway는 기본적으로 region 서비스**
    - 다른 region에 있는 vpc와 연결하기 위해선 해당 region에 transit gateway를 생성하고 transit gateway끼리 피어링해야함 > **Transit Gateway Peering**
- 부분연결 가능
    ![image128](${imgUrl}/128.png)    
    
    - <u>**블랙홀을 생성해서 특정 VPC로 못가게 막을 수 있음**
    - **VPC끼리는 소통못하지만, VPN 이용해서 서로 엑세스할 수 있음**</u>
        ![image129](${imgUrl}/129.png)        

`;

const Post4 = {
  id: 4,
  slug: SlugGenerator(title),
  title: title,
  date: 'June, 2024',
  tags: ['AWS', 'Architecting', 'Cloud Computing', 'Architecting on AWS'],
  excerpt: '이 포스팅은 AWS 서비스를 이용해 아키텍처를 설계하는 방법론에 대해 알아본다. 서비스를 설계를 위한 AWS 서비스를 자세하게 알아볼 것이며, 5편에 걸쳐서 작성할 예정이다. (4)편에서는 컨테이너와 네트워킹에 대해서 다룬다.',  
  headings: HeadingExtractor(postContent),
  content: <MarkdownRenderer markdownText={postContent} allowImages /> // Render markdown using the MarkdownRenderer
};

export default Post4;

