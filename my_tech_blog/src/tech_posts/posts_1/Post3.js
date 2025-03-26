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

const title = 'Architecting on AWS (3)';

const postContent = `
이 포스팅은 AWS 서비스를 이용해 아키텍처를 설계하는 방법론에 대해 알아본다. (3)편에서는 AWS의 모니터링 및 자동화 도구에 대해 다룬다. CloudWatch의 지표 및 로그 관리, EventBridge를 통한 이벤트 기반 작업 자동화, Auto Scaling의 작동 방식과 비용 최적화 전략, 그리고 IaC 도구인 CloudFormation과 AWS CDK, Beanstalk, Systems Manager를 활용한 인프라 자동화와 운영 방안을 설명한다.  

# 7 Monitoring and Autoscaling

## Monitoring

### CloudWatch

![image107](${imgUrl}/107.png)

- <u>**기본적으로 지표는 5분 간격으로 기록**</u>되어 볼 수 있음
    - 텀을 줄일 수 있으나 비용 발생
- **로그 유형**
    ![image108](${imgUrl}/108.png)    
    
    - **흐름 로그**
        ![image109](${imgUrl}/110.png)        
        
        - <u>**트래픽이 들어오고 나가고 하는 부분에 대한 내용을 저장**</u>
        - 어떤 security group을 통과했고, 소스는 어디고 등등
        - ENI(elastic network interface/랜카드) 단위로 기록 남음
            - <u>**즉, ENI를 기준으로 트래픽이 어떻게 왔다갔다했나 볼 수 있음**</u>
        - 아래와 같은 레코드 형태로 포함
            ![image111](${imgUrl}/111.png)              
            
    - **사용자 지정 로그**
        - 어플리케이션 소스 안에 사용자가 지정해둔 거
        - ex) if 문 안에 들어가면 print(”!”) 등
    - **CloudTrail**
        ![image109](${imgUrl}/109.png)          
        
        - <u>**사용자의 활동에 대한 기록**</u>
        - stop/terminate API를 누가 불렀는지, 어떤 사용자가 어떤 IAM role을 받았는지 등
        - <u>**리전 단위로 활성화해서 사용**
        - **S3 bucket에 저장**</u>
    - **CloudWatch**
        - <u>**on-premise agent 깔면 온프레미스 지표까지 한 눈에 볼 수 있음**</u>
        - 위 종류를 제외하곤 거의 대부분 클라우드 왓치에 기록되는 로그

- Log event
    - event 단위로 끊어서 로그로 기록됨
- Log Stream
    - 동일한 Log event들이 쌓여서 모음이 되면 Stream
- Log group
    - <u>**Lambda의 모든 event가 다 기록되어 있는 것이 group**</u>
    - 즉, stream이 모이면 group
- Log Trail
    - 어떤 사용자가 어떤 행동을 했는지 볼 수 있음
    - Watch에서 모아서 볼 수 있음

## Alarm & Event

- 경보 상태
    - OK : 임계값 초과하지 않은 정상
    - ALARM : 임계값 초과
    - INSUFFICIENT DATA : 정보 부족 (충분한 지표가 모이지 않음) > 이 경우 알람 다시 체크해봐라
- 경보 구성 요소
    ![image140](${imgUrl}/140.png)      
    
    - 데이터 요소 \`2/2\`
        - 2개 중에 2개가 다 연속으로 넘으면 알람을 울려라
        - 따라서 \`2/3\`이면 3번 중에 2번 연속으로 넘으면 울림

### Event Bridge

- <u>**특정 이벤트가 발생했을 때 작업 수행**</u>
    ![image141](${imgUrl}/141.png)      
    
- 완전관리형 서비스
- 서버리스
- CloudWatch 경보를 통해 처리할 수 없는 애들을 처리할 수 있음
- 써드파티 이용 등

## Load Balancing

- 타겟 그룹 설정해서 그룹을 대상으로 트래픽 보냄
- 상태 확인을 지속적으로 해서 Unhealthy 상태면 트래픽을 보내지 않음
- 구성 요소
    ![image143](${imgUrl}/143.png)      
    
- 로드 밸런서 유형
    ![image142](${imgUrl}/142.png)      
    
    - GLB
        - 외부의 다른 어플리케이션(써드파티 가상 어플라이언스)와 연결하기 위해 사용
        - 보안 문제 및 크기 확장/축소
    - <u>**ALB**
        - **RR 방식으로 라우팅**
    - **NLB**
        - **hash 방식으로 라우팅**
        - **고정 ip 제공**
        - **ALB에 비해서 조금 더 빠름**</u>
- 기능 비교
    ![image144](${imgUrl}/144.png)      
    

## Autoscaling

- EC2 Auto Scaling
    ![image145](${imgUrl}/145.png)      
    
    - 지정해준 조정정책을 기준으로 scale in/out
    - load balancer에 auto scaling group을 target group으로 넣을 수 있음
- auto scaling의 장점
    - 탄력성 : 확장 및 축소
        ![image146](${imgUrl}/146.png)      
        ![image147](${imgUrl}/147.png)  

- EC2 Auto Scaling 구성 요소
    ![image148](${imgUrl}/148.png)      
    
    - 시작 템플릿 : 기본 정보의 모음
        ![image149](${imgUrl}/149.png)          
        
    - 그룹 용량
        ![image150](${imgUrl}/150.png)          
        
    - 호출 방식
        ![image151](${imgUrl}/151.png)          
        
    - 비용 최적화
        ![image152](${imgUrl}/152.png)      

        - 예약 인스턴스나 savings plan이 없으면 스팟 인스턴스 써도 좋음

### [캡스톤 아키텍처 참고]
![image109](${imgUrl}/153.png)  
![image154](${imgUrl}/154.png)  

# 8 Automation

## IaC (Infrastructure as a Code)

- 인프라를 프로비저닝할 수 있게 템플릿이라고 불리는 코드의 형태로 작성
- <u>**AWS에서는 JSON, YAML의 형태로 템플릿 정의**</u>
- 복제, 재배포, 용도 변경 가능
- <u>**인프라와 어플리케이션의 버전 관리 가능**
    - **오류 발생 경우, 이전 버전으로 롤백 가능**
- **드리프트 탐지**
    - **템플릿과 실제 인프라의 차이점(변경사항)에 대해 확인 가능**
- **유효성 검사**
    - **템플릿에서 코드 검토 수행**</u>
- 빠른 속도와 높은 안전성
    - 프로그래밍 방식의 인프라 구축이기 때문에 수동 배포보다 속도 빠르고 오류 발생 가능성 낮음
- <u>**템플릿 업데이트 시, 변경된 부분만 업데이트해줌**</u>

## AWS CloudFormation

- **Terraform(써드파티)과 동일한 서비스지만 AWS 자체 서비스**
![image113](${imgUrl}/113.png)  

- **스택이라는 단위로 묶임** → 안에 있는 거 하나 삭제시, 디펜던시있는 것들 다 같이 삭제되는 이점
    - 스택이란? CloudFormation 템플릿에 정의되어 있는 모든 프로비저닝 리소스
        ![image112](${imgUrl}/112.png)  

    - <u>**각각의 영역별로 스택을 나눠서, 먼저 실행할 것들을 참조해서 다음 스택을 실행할 수 있음**</u>
        - 한 스택의 출력을 다르 스택과 공유 : <u>**교차 스택 참조 생성**</u>
            ![image114](${imgUrl}/114.png)              
            
        - ex) VPC만들어야지만 EC2 생성 가능하니까 VPC 관련 스택 먼저
        - 각각을 다른 스택으로 관리
- <u>**되도록이면 템플릿을 한 번에 다 쓰지 말고, 영역별로 나눠서 사용해라!**</u>

### CloudFormation Designer

![image115](${imgUrl}/115.png) 
- 드래그 앤 드랍으로 그래프 형태의 구조 만들면 자동으로 템플릿 만들어주는 도구

## Infrastructure management
![image116](${imgUrl}/116.png)  

### Beanstalk
![image117](${imgUrl}/117.png)  

- 기본적인 웹 환경을 만들 수 있는 기본적인 구성을 자동으로 프로비저닝
    ![image118](${imgUrl}/118.png)      
    
- 대신 커스텀은 못함
- 작업자 환경과 웹 서버 환경 두 개로 나뉨
    ![image119](${imgUrl}/119.png)      
    
    - 작업자 환경(개발을 위한 환경)은 잘 쓰진 않음

### AWS 솔루션 라이브러리
![image121](${imgUrl}/121.png)  

- 아키텍트가 검증한 솔루션들을 많이 올라와있음
    - CloudFormation 템플릿 포함
    - 템플릿 받아서 살짝 수정해서 올리면 편함

### AWS CDK
![image120](${imgUrl}/120.png)  

- Python, JavaScript, TypeScript, Java, C# 등의 일반 프로그래밍 언어 중 본인이 편한 언어로 코딩을 하면, 템플릿의 형태로 바꿔주는 어플리케이션 서비스

### AWS Systems Manager

- <u>**프로비저닝 및 권한 부여**</u>
- 구성 관리
- <u>**운영 및 규정 준수 관리**
    - **리소스 그룹 단위로 관리**
- **모니터링**</u>
- 어플리케이션 관리
- parameter store 관리

## Amazon CodeWhisperer

- 코드 자동 완성 서비스 (코딩 도우미)
- 코파일럿 같은 거인듯?
- <u>**두 가지 서비스 : 코딩 도우미 & 보안 스캐너**</u>
    ![image122](${imgUrl}/122.png)      

`;

const Post3 = {
  id: 3,
  slug: SlugGenerator(title),
  title: title,
  date: 'July, 2024',
  tags: ['AWS', 'Architecting', 'Cloud Computing', 'Architecting on AWS', 'Monitoring', 'Auto Scaling'],
  excerpt: '이 포스팅은 AWS 서비스를 이용해 아키텍처를 설계하는 방법론에 대해 알아본다. (3)편에서는 AWS의 모니터링 및 자동화 도구에 대해 다룬다. CloudWatch의 지표 및 로그 관리, EventBridge를 통한 이벤트 기반 작업 자동화, Auto Scaling의 작동 방식과 비용 최적화 전략, 그리고 IaC 도구인 CloudFormation과 AWS CDK, Beanstalk, Systems Manager를 활용한 인프라 자동화와 운영 방안을 설명한다.',  
  headings: HeadingExtractor(postContent),
  content: <MarkdownRenderer markdownText={postContent} allowImages /> // Render markdown using the MarkdownRenderer
};

export default Post3;

