
const Post1 = {
  id: 1,
  slug: 'aws-technical-essentials',
  title: 'AWS: Technical Essentials',
  date: 'June, 2024',
  tags: ['AWS', 'Cloud Computing', 'Infrastructure', 'AI', 'blockchain', 'dsdfsf', 'dfsdddd'],
  excerpt: 'In this post, we explore the basics of AWS cloud computing...',
  headings: [
    { id: 'aws-introduction', title: '1 AWS 소개', level: 1 },
    { id: 'cloud-computing', title: 'Cloud Computing', level: 2 },
    { id: 'global-infrastructure', title: 'Global Infrastructure', level: 2 },
    // Add more headings here...
  ],
  content: (
    <>
      <article>
        <p>
          In this post, we explore the basics of cloud-native architecture, including its core components like containers, microservices, and orchestration. Cloud-native is an approach to building and running applications that exploit the advantages of the cloud computing delivery model.
        </p>
        <h1 id="aws-introduction">1 AWS 소개</h1>

        <h2 id="cloud-computing">Cloud Computing</h2>
        <p>클라우드 컴퓨팅을 세 단어로 표현하면:</p>
        <ul>
            <li>인터넷을 통해 연결</li>
            <li>온디맨드</li>
            <li>종량제 요금제</li>
        </ul>
        <h3>클라우드 컴퓨팅의 주요 이점</h3>
        <img src="https://prod-files-secure.s3.us-west-2.amazonaws.com/39c7af8e-3fc8-409e-bfc1-4c1dbdbf49f9/b5a6707f-407a-4b3c-b69d-d13ad217f696/Screenshot_2024-06-27_at_9.50.38_AM.png" alt="Cloud Computing Benefits" />
        <ul>
            <li>
                <strong>속도 및 민첩성 향상:</strong>
                <ul>
                    <li>Q) 클라우드도 결국 어딘가에서 서버를 운영하고 있는데, 서버에서 데이터를 빼서 오는 데 시간이 소요되는 거는 똑같은 거 아닌가?</li>
                    <li>A) 엣지 로케이션을 두기도 하고, 아무래도 글로벌 스케일로 봤을 때 유리한 거 같음</li>
                </ul>
            </li>
            <li>
                <strong>몇 분 만에 전 세계에 배포:</strong> 모든 클라우드 서비스는 전세계에 서버를 가지고 있음
            </li>
        </ul>

        <h2 id="global-infrastructure">Global Infrastructure</h2>
        <h3>AZ(가용 영역)</h3>
        <ul>
            <li>하나 이상의 데이터 센터들의 집합</li>
            <li>데이터 센터는 수천에서 수만 대의 서버의 집합</li>
            <li>오피셜로 모든 AWS 직원은 가용영역이 어디있는지 모름</li>
            <li>가용영역들은 물리적으로 떨어져있음</li>
        </ul>
        <div>
            <p><strong>Why?</strong></p>
            <ul>
                <li>재해복구를 위함</li>
                <li><strong>서비스를 만들 때 절대로 하나의 AZ에만 배포하지 말고 복제를 해서 꼭 최소 2개의 AZ에 배포할 것</strong></li>
            </ul>
        </div>

        <h3>Region</h3>
        <ul>
            <li>AZ가 3개 이상(최소조건) 모여있는 범위</li>
            <li>현재 전세계에 33개 Region이 존재</li>
        </ul>

        <h3>Edge Location</h3>
        <ul>
            <li>굉장히 땅이 큰 나라는 내 위치와 Region의 위치가 매우 멀어서 latency 발생</li>
            <li>이를 해결하기 위해 Edge location을 만듦</li>
            <li>400개 이상의 Edge location 존재</li>
        </ul>
        <img src="https://prod-files-secure.s3.us-west-2.amazonaws.com/39c7af8e-3fc8-409e-bfc1-4c1dbdbf49f9/55ee0c6c-c53d-40d8-b6e8-c75e66f23c53/Screenshot_2024-06-27_at_10.07.27_AM.png" alt="Where to Deploy Services" />

        <h3>어떤 리젼에 서비스를 배포해야 하나?</h3>
        <ul>
            <li><strong>지연 시간:</strong> 본인이 서비스를 운영할 나라/지역에서 가장 가까운 곳에 둠으로써 지연 시간을 줄임</li>
            <li><strong>요금:</strong> 지역마다 택스가 다르기 때문에 요금도 다름</li>
            <li><strong>서비스 가용성:</strong> 원하는 서비스가 지원하지 않는 리전이 있을 수도 있음</li>
            <li><strong>데이터 규정 준수:</strong> 나라의 법이 어떤 지에 따라 데이터 규정이 달라짐</li>
        </ul>

        <h2 id="security">보안 : AWS 공동 책임 모델</h2>
        <img src="https://prod-files-secure.s3.us-west-2.amazonaws.com/39c7af8e-3fc8-409e-bfc1-4c1dbdbf49f9/501c0136-0734-48d2-a1db-a3fcdd3dc9bd/Screenshot_2024-06-27_at_10.15.40_AM.png" alt="AWS Shared Responsibility Model" />

        <h2 id="iam">IAM</h2>
        <h3>AWS Root Account</h3>
        <ul>
            <li>Super User이기 때문에 모든 권한을 다 가지고 있음</li>
            <li>처음에 계정 만들 때나 빌링에 의한 문제 등 외에는 사용하지 말아라</li>
            <li>Email/pw로 로그인</li>
        </ul>

        <h3>IAM User</h3>
        <ul>
            <li>영구 자격 증명</li>
            <li>ID/PW로 로그인</li>
            <li>
                <strong>Federation User:</strong> 해당 사이트에 반드시 로그인할 필요없이, 본인이 신뢰하는 그룹과는 ip연동을 통해 로그인을 제공
                <ul>
                    <li>AWS는 Google, Facebook과 연동</li>
                </ul>
            </li>
        </ul>

        <h3>IAM Group</h3>
        <ul>
            <li>유저 집합으로 정책을 상속하게 됨</li>
            <li>그룹 하위에 그룹이 들어갈 수는 없음</li>
        </ul>

        <h3>Policy</h3>
        <ul>
            <li>User 혹은 Group에게 policy를 통해 권한을 부여</li>
            <li>권한:</li>
            <ul>
                <li>Identity: 특정 사용자에게 S3에 대한 접근 권한을 부여</li>
                <li>Resource: S3에게 특정 사용자의 요청만 허용</li>
            </ul>
        </ul>

        <h3>IAM Role</h3>
        <ul>
            <li>임시 자격 증명</li>
            <li>잠시 역할을 수행할 수 있게 AssumeRole API를 사용</li>
        </ul>
      </article>
    </>
  ),
};

export default Post1;
