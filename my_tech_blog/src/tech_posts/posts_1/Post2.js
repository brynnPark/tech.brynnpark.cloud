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

const title = 'Architecting on AWS (2)';

const postContent = `

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

const Post2 = {
  id: 4,
  slug: SlugGenerator(title),
  title: title,
  date: 'June, 2024',
  tags: ['AWS', 'Architecting', 'Cloud Computing', 'Architecting on AWS'],
  excerpt: '이 포스팅은 AWS 서비스를 이용해 아키텍처를 설계하는 방법론에 대해 알아본다. 서비스를 설계를 위한 AWS 서비스를 자세하게 알아볼 것이며, (1)편과 (2)편에 걸쳐서 작성할 예정이다. (1)편에서는 아키텍팅의 기본 사항, 계정 보안, Networking, Computing, Storage, Database에 대해서 알아본다.',
  headings: HeadingExtractor(postContent),
  content: <MarkdownRenderer markdownText={postContent} allowImages /> // Render markdown using the MarkdownRenderer
};

export default Post2;

