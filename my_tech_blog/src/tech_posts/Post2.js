// src/tech_posts/Post2.js
import React from 'react';

const Post2 = {
  id: 2,
  slug: 'codebuild-container-deployment',
  title: 'CodeBuild and Container Deployment',
  date: 'October, 2024',
  tags: ['AWS', 'CodeBuild', 'Kubernetes', 'Containers'],
  excerpt: 'In this post, we explore how to configure AWS CodeBuild and deploy containers using Kubernetes...',
  headings: [
    { id: "CodeBuild", title: "CodeBuild", level: 1 },
    { id: "컨테이너-배포-방법", title: "컨테이너 배포 방법", level: 1 },
    { id: "컨테이너-이미지-빌드", title: "1. 컨테이너 이미지 빌드", level: 2 },
    { id: "쿠버네티스-세팅", title: "2. 쿠버네티스 세팅", level: 2 },
    { id: "registry에-image-넣기", title: "3/4. Registry에 image 넣기 / 쿠버네티스에 최종 배포", level: 2 },
    { id: "CodeBuild-Local-Build-Testing", title: "CodeBuild Local Build Testing (CodeBuild Agent)", level: 1 },
    { id: "환경-설정", title: "1 환경 설정", level: 2 },
    { id: "Docker-image-준비", title: "2. Docker image 준비", level: 2 },
    { id: "파이프라인-구축-과정", title: "파이프라인 구축 과정 (CodeBuild, CodePipeline)", level: 1 },
    { id: "Buildspec-File-생성", title: "1. Buildspec File 생성", level: 2 },
    { id: "Codepipeline-생성", title: "2. CodePipeline 생성", level: 2 }
  ],
  content: (
    <div>
  <h1 id="CodeBuild">CodeBuild</h1>
  <ul>
    <li><strong>Project Configuration</strong>: 빌드 프로젝트 이름, 상세 설명, 태그</li>
    <li><strong>Source</strong>: 프로젝트 소스 저장소</li>
    <li><strong>Environment</strong>: 실행 환경</li>
    <li><strong>Buildspec</strong>: 빌드 실행 파일 설정 (빌드 진행 시 참조되는 .yml 타입의 설정 파일)</li>
    <li><strong>Artifacts</strong>: 빌드 파일 저장 및 캐싱 파일 관리</li>
    <li><strong>Logs</strong>: 빌드 로그</li>
  </ul>

  <h1 id="컨테이너-배포-방법">컨테이너 배포 방법</h1>

  <h2 id="컨테이너-이미지-빌드">1. 컨테이너 이미지 빌드</h2>
  <ul>
    <li>Docker image 빌드 (DockerFile 필수)</li>
  </ul>

  <pre>
    <code>docker build -t &lt;container image name&gt; .</code>
  </pre>

  <ul>
    <li>로컬에서 컨테이너 돌아가는지 확인</li>
  </ul>

  <pre>
    <code>docker run -p 8080:8080 &lt;container image name&gt;</code>
  </pre>

  <ul>
    <li>성공적이라면 <a href="http://localhost:8080" target="_blank" rel="noopener noreferrer">http://localhost:8080</a>에 접속되어야 함</li>
  </ul>

  <h2 id="쿠버네티스-세팅">2. 쿠버네티스 세팅</h2>

  <h3>쿠버네티스 구조</h3>
  <ul>
    <li><strong>Namespace</strong>: <inline-code>web-application</inline-code> - Groups all the resources related to this application.</li>
    <li><strong>Frontend Service</strong> (<inline-code>frontend-service</inline-code>) - SPA</li>
    <ul>
      <li><strong>Pods</strong>: <inline-code>frontend-container</inline-code></li>
      <li><strong>Deployment</strong>: <inline-code>frontend-deployment</inline-code></li>
    </ul>
    <li><strong>Backend Services</strong>:</li>
    <ul>
      <li><strong>MainPage Service</strong> (<inline-code>main-page-service</inline-code>)</li>
      <ul>
        <li><strong>Folder Structure</strong></li>
        <pre>
          <code>{`
📦main-page-service
 ┣ 📂k8s              # Kubernetes configuration files
 ┃ ┣ 📜main-service-deployment.yaml
 ┃ ┣ 📜main-service.yaml
 ┣ 📂src
 ┃ ┣ 📂main
 ┃ ┗ 📂test
 ┣ 📜build.gradle
 ┣ 📜Dockerfile
 ┣ 📜buildspec.yml
 ┗ 📜settings.gradle
          `}</code>
        </pre>
        <li><strong>Deployment</strong></li>
        <pre>
          <code>{`apiVersion: apps/v1
kind: Deployment
metadata:
  name: mainpage-service-deployment
  namespace: mainpage-service
  labels:
    app: mainpage-service
spec:
  replicas: 2  # Two pods running the service
  selector:
    matchLabels:
      app: mainpage-service
  template:
    metadata:
      labels:
        app: mainpage-service
    spec:
      containers:
      - name: mainpage-service
        image: <aws_account_id>.dkr.ecr.<region>.amazonaws.com/mainpage-service:latest # Use ECR
        ports:
        - containerPort: 8080  # Check container's exposed port 
      nodeSelector:
        kubernetes.io/arch: amd64  # Need to check Fargate compatibility
      tolerations:
      - key: "fargate.amazonaws.com"
        operator: "Exists"
        effect: "NoSchedule"
          `}</code>
        </pre>

        <li><strong>Main Service</strong></li>
        <pre>
          <code>{`apiVersion: v1
kind: Service
metadata:
  name: mainpage-service
  namespace: default
spec:
  selector:
    app: mainpage-service
  ports:
    - protocol: TCP
      port: 80               # Public-facing port/Service port
      targetPort: 8080       # Container port
      nodePort: 30007        # Node port in the range 30000-32767
  type: NodePort             # Exposes the service on a node port
          `}</code>
        </pre>
        <blockquote>
          <p><strong>type: NodePort</strong> 인 이유</p>
          <p>
            ClusterIP는 기본적으로 pods 사이의 소통을 위한 것이기 때문에 기본으로 많이 사용하지만, 우리 프로젝트의 경우, Frontend는 Pod로 배포하지 않고 S3를 이용하기 때문에 외부 소통이 필요한 상황임. 외부소통을 할 수 있는 나머지 타입 중 1) 가장 최소한의 외부 소통과 2) 서버리스 운영이 가능한 옵션은 NodePort라고 생각함. 다만 특정 노드의 포트를 지정해서 매핑해줘야할 거 같아서 설정이 복잡할 수도.
          </p>
        </blockquote>
      </ul>
    </ul>
  </ul>
  <ul>
    <li><strong>Containers</strong>
      <ul>
        <li>{`main-page-service`}</li>
      </ul>
    </li>
  </ul>
  <ol>
    <li><strong>FeedPage Service</strong> {`feed-page-service`}
      <ul>
        <li><strong>Deployment</strong>
          <ul>
            <li>{`feed-service-deployment.yml`}
              <pre>{`
                추가 예정
              `}</pre>
            </li>
            <li>{`feed-service.yml`}
              <pre>{`
    
                추가 예정
              `}</pre>
            </li>
          </ul>
        </li>
        <li><strong>Containers</strong>
          <ul>
            <li>{`feed-page-service`}</li>
          </ul>
        </li>
      </ul>
    </li>
  </ol>
  <h2>3/4. Registry에 image 넣기 / 쿠버네티스에 최종 배포</h2>
  <p>
    본 프로젝트에서는 자동화할 예정이라서 CodeBuild에 push하면 위 build, image push to ECR, apply to EKS가 파이프라인(CodePipeline 사용)으로 묶여서 처리되게 된다. 그러기 위해서 프로젝트 디렉토리에 {`buildspec.yml`} 추가해야 한다.
  </p>
  <h1 id="CodeBuild-Local-Build-Testing">CodeBuild Local Build Testing (CodeBuild Agent)</h1>
  <p>
    CodeBuild는 빌드가 시작되는 순간부터 러닝타임이 시작되기 때문에 비용을 절약하기 위해 로컬에서 모든 테스팅을 먼저 진행할 예정이다. CodeBuild를 사용해 로컬에서 {`buildspec.yml`}을 테스팅할 수 있는 CodeBuild Agent를 사용할 것이다. 사용하기 위한 단계는 아래와 같다.
  </p>
  <h2 id="환경-설정">1 환경 설정</h2>
  <p>먼저 환경 설정을 한다.</p>
  <ul>
    <li>Docker 설치</li>
    <li>AWS CLI 설치</li>
  </ul>
  <p>위 두가지 설치는 필수이다. 환경 설정을 확인하며 마주친 버그는 아래에 정리해두었다.</p>
  <p><strong>Bugfix</strong></p>
  <pre><code>{
  `pbh7080@Bohyeons-MacBook-Air openjdk-11 % docker build -t aws/codebuild/openjdk-11 .
DEPRECATED: The legacy builder is deprecated and will be removed in a future release.
            Install the buildx component to build images with BuildKit:
            https://docs.docker.com/go/buildx/

Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?
  `}</code></pre>
  <p>
    위와 같은 원인이 발생한 이유는 보통 Docker가 제대로 실행되고 있지 않기 때문이다. 즉, Docker 미설치를 의심해볼 수 있다. (실제로 본인의 경우, Docker 설치가 제대로 되어 있지 않아 위와 같은 오류가 났고, 설치하고 다시 실행하니 오류가 해결되었음)
  </p>
  <pre><code>{
  `pbh7080@Bohyeons-MacBook-Air openjdk-11 % docker build -t aws/codebuild/openjdk-11
  DEPRECATED: The legacy builder is deprecated and will be re moved in a future release.
              Install the buildx component to build images with BuildKit:
              https://docs.docker.com/go/buildx/

  "docker build" requires exactly 1 argument.
  See 'docker build --help'.

  Usage:  docker build [OPTIONS] PATH | URL | -

  Build an image from a Dockerfile
  `}</code></pre>
  <p>Docker image를 빌드하기 위해선 디렉토리 내에 Dockerfile이 </p>

  <h2 id="Docker-image-준비">2. Docker image 준비</h2>
  <p>
    로컬에서 CodeBuild를 실행하기 위해 두 개의 이미지가 필요합니다. 두 가지 이미지 모두 본인 환경에 맞는 걸로 사용해야 합니다. Docker image는 x86 또는 ARM 계열을 사용할 수 있으며, 아래는 모두 x86을 기준으로 설명합니다.
  </p>

  <ol>
    <li>
      <strong>build Docker image</strong>
      <p>
        빌드할 도커 이미지는 직접 Build할 수도 있고, 그냥 가져와서 사용할 수도 있습니다. 처음에는 <code>aws-codebuild-docker-images</code>를 clone해 직접 빌드할 예정이었으나, macOS m2 기준으로 계속 오류가 발생해 그냥 pull해와서 사용했습니다.
      </p>
      <pre>
        <code>
          {`
ERROR: failed to solve: process "/bin/sh -c wget -nv https://github.com/aws/aws-sam-cli/releases/latest/download/aws-sam-cli-linux-x86_64.zip -O /tmp/samcli.zip && unzip -q /tmp/samcli.zip -d /opt && /opt/install --update -i /usr/local/sam-cli -b /usr/local/bin && rm /tmp/samcli.zip /opt/install && rm -rf /opt/aws-sam-cli-src && sam --version" did not complete successfully: exit code: 133
          `}
        </code>
      </pre>
      <p>
        <strong>아래 명령어로 pull을 실행합니다:</strong>
      </p>
      <p>(<a href="https://gallery.ecr.aws/codebuild/amazonlinux2-x86_64-standard">이미지 선택 링크</a>)</p>
      <pre>
        <code>
          docker pull public.ecr.aws/codebuild/amazonlinux2-x86_64-standard:5.0
        </code>
      </pre>
      <p>pull이 성공하면 아래와 같은 메시지가 출력됩니다:</p>
      {/* Image placeholder */}
      <p>추가로 도커에서도 아래와 같이 출력됩니다:</p>
      {/* Image placeholder */}

      <blockquote>
        <p><strong>왜 AWS CodeBuild Standard Image가 필요한지?</strong></p>
        <p>
          이 이미지는 CodeBuild를 사용하기 위해 필요한 도구들(Docker, AWS CLI, Node.js, Java 등)이 미리 설치되어 있는 환경을 제공합니다. 따라서 build process를 간결하게 할 수 있으며, 이 이미지를 사용하지 않으면 수동으로 모든 도구를 설치해야 합니다. 커스텀 이미지를 사용하고 싶다면 이 이미지를 사용하지 않아도 되지만, 실행해보니 이 이미지를 사용하는 것이 간편했습니다.
        </p>
      </blockquote>
    </li>

    <li>
      <strong>Agent Docker image</strong>
      <p>
        다음으로 Agent를 사용하기 위해 아래 명령어를 실행하여 이미지를 pull합니다.
      </p>
      <pre>
        <code>
          docker pull public.ecr.aws/codebuild/local-builds:latest
        </code>
      </pre>
      <p>
        위 명령어가 성공하면 터미널에 비슷한 메시지가 출력되며, 도커에서도 이미지를 확인할 수 있습니다.
      </p>
      {/* Image placeholder */}
    </li>
  </ol>

  <blockquote>
    <p><strong>왜 Agent Docker image (local-builds image)가 필요한가?</strong></p>
    <p>
      local-builds 이미지는 AWS CodeBuild 실행 환경과 동일한 환경을 제공합니다. CodeBuild 환경에서 <code>buildspec.yml</code> 코드가 정상적으로 실행되는지 확인하려면, 로컬에서 동일한 환경을 유지해야 하기 때문입니다.
    </p>
  </blockquote>

  <p>
    마지막으로, 터미널에서 <code>docker images</code> 명령어를 실행하여 두 이미지가 동일하게 표시되면 성공한 것입니다.
  </p>

  <pre>
    <code>
      pbh7080@Bohyeons-MacBook-Air 7.0 % docker images
      REPOSITORY                                              TAG            IMAGE ID       CREATED         SIZE
      public.ecr.aws/codebuild/local-builds                   latest         ccb19bdd7af9   4 months ago    3.57GB
      public.ecr.aws/codebuild/amazonlinux2-x86_64-standard   5.0   674acb59f106   15 months ago   9.89GB
    </code>
  </pre>

  <p>참고로, 아래 GitHub 링크를 참고했습니다:</p>
  <a href="https://github.com/aws/aws-codebuild-docker-images">aws-codebuild-docker-images GitHub</a>

  <h2>3. codebuild_build 실행</h2>
  <p>
    비교적 복잡한 실제 <code>buildspec.yml</code> 코드를 실행하기에 앞서, 로컬 테스팅 자체가 제대로 되는지를 확인하기 위해 간단히 각 단계에 터미널 출력만 하는 코드를 먼저 실행해봅니다.
  </p>

  <pre>
    <code>
      {`
      # buildspec.yml (simple.ver)
      # simple testing
      version: 0.2

      env:
        variables:
          var_1: value_1

      phases:
        install:
          commands:
            - echo "install command"
        pre_build:
          commands:
            - echo "prebuild command"
        build:
          commands:
            - echo "build command"
        post_build:
          commands:
            - echo "post-build command"
      `}
    </code>
  </pre>

  <p>
    먼저 <code>codebuild_build.sh</code> 파일이 있는 디렉토리로 이동한 후, 실행 권한을 업데이트합니다.
  </p>

  <pre>
    <code>
      {`
      pbh7080@Bohyeons-MacBook-Air local_builds % ls
      LICENSE.txt   README.md    codebuild_build.sh
      NOTICE.txt    THIRD-PARTY.txt
      pbh7080@Bohyeons-MacBook-Air local_builds % chmod +x codebuild_build.sh
      `}
    </code>
  </pre>

  <p>
    이후, local codebuild agent를 실행합니다. 참고로 build container image의 이름은 <code>docker images</code> 명령어 실행 또는 도커 화면을 통해 알 수 있습니다.
  </p>

  <pre>
    <code>
      pbh7080@Bohyeons-MacBook-Air local_builds % ./codebuild_build.sh -i public.ecr.aws/codebuild/amazonlinux2-x86_64-standard:5.0 -a ./artifact -s /Users/pbh7080/Desktop/project/ITeaMoa/test-codebuild/aws-codebuild-docker-images
    </code>
  </pre>

  <p>
    <code>codebuild_build.sh</code>를 실행하기 위한 파라미터는 아래와 같습니다.
  </p>

  <blockquote>
    <p><strong>Required:</strong></p>
    <ul>
      <li><code>i</code>: Used to specify the customer build container image.</li>
      <li><code>a</code>: Used to specify an artifact output directory.</li>
    </ul>

    <p><strong>Optional:</strong></p>
    <ul>
      <li><code>l</code>: Used to override the default local agent image. Default is "public.ecr.aws/codebuild/local-builds:latest".</li>
      <li><code>r</code>: Used to specify a report output directory.</li>
      <li><code>c</code>: Use the AWS configuration and credentials from your local host.</li>
      <li><code>p</code>: Used to specify the AWS CLI Profile.</li>
      <li><code>b</code>: Used to specify a buildspec override file.</li>
      <li><code>e</code>: Used to specify a file containing environment variables.</li>
      <li><code>m</code>: Used to mount the source directory to the customer build container directly.</li>
      <li><code>d</code>: Used to run the build container in docker privileged mode.</li>
      <li><code>s</code>: Used to specify a source directory. Defaults to the current working directory.</li>
    </ul>
  </blockquote>

  <p>
    이번 프로젝트에서 필요한 파라미터는 아래와 같습니다. 빌드에는 이상이 없습니다.
  </p>

  <pre>
    <code>
      {`
  ./codebuild_build.sh 
    -i <Build-container-image-name> 
    -a <artifact-output-directory>
    -l <Agent-container-image-name>
    -c <credentials>
      `}
    </code>
  </pre>

  <p>
    명령어가 성공하면 터미널은 아래와 같이 출력되며, 도커 화면에서도 <code>Status</code>가 <em>In use</em>로 바뀐 것을 확인할 수 있습니다.
  </p>

  <p>
    본격적으로 Docker image를 빌드하고, ECR에 push하는 <code>buildspec.yml</code>을 실행해보겠습니다.
  </p>
  <pre>
    <code>
      {`
      version: 0.2

      phases:
        install:
          commands:
            # Ensure AWS CLI is installed
            - aws --version
            - echo "install step check..."

        pre_build:
          commands:
            # Login to ECR Registry for docker to push the image to ECR Repository
            - echo "Logging in to Amazon ECR..."
            - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.ap-northeast-2.amazonaws.com
            - IMAGE_REPO_NAME=$AWS_ACCOUNT_ID.dkr.ecr.ap-northeast-2.amazonaws.com/iteamoa
            - IMAGE_TAG=latest

        build:
          commands:
            # Build Docker Image
            - echo Build started on \`date\`
            - echo Building the Docker image...
            - docker build --t $IMAGE_REPO_NAME:$IMAGE_TAG .

        post_build:
          commands:
            # Push Docker Image to ECR Repository
            - echo Build completed on \`date\`
            - echo Pushing the Docker image...
            - docker push $IMAGE_REPO_NAME:$IMAGE_TAG
      `}
    </code>
  </pre>

  <p>
    실행 중 <code>aws ecr get-login-password</code> 부분에서 다음과 같은 오류가 발생했습니다. 문제를 해결하기 위해 몇 시간 동안 시도했으나, 원인은 권한 문제였습니다.
  </p>

  <pre>
    <code>
      agent-1  | [Container] 2024/10/17 07:22:15.611825 Running command aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.ap-northeast-2.amazonaws.com
      agent-1  |
      agent-1  | Unable to locate credentials. You can configure credentials by running "aws configure".
      agent-1  | Error: Cannot perform an interactive login from a non TTY device
    </code>
  </pre>

  <p>
    문제는 ECR에 로그인해 이미지를 push하기 위한 AWS 인증정보가 쉘 스크립트에서 찾을 수 없어서 발생했습니다. 해결을 위해 새 IAM Role을 생성하여 로컬 테스트에 필요한 권한을 부여하였습니다.
  </p>

  <h3>1. Trusted entity type 설정</h3>
  <p>
    로컬 테스트에서 사용할 서비스를 지정합니다. CodeBuild에 접근해야 하므로 CodeBuild로 설정합니다. 아래와 같이 새로운 Role을 생성했습니다.
  </p>
  {/* Image Placeholder */}

  <h3>2. 관련된 Permission 부여</h3>
  <p>
    CodeBuild가 ECR에 접근해 이미지를 push할 수 있도록 <code>AmazonElasticContainerRegistryPublicFullAccess</code> 권한을 부여했습니다. 다만 실제로는 필요한 최소한의 권한만 부여하는 것을 권장합니다.
  </p>
  {/* Image Placeholder */}

  <h3>3. Trusted Policy 수정</h3>
  <p>
    원래는 CodeBuild만 사용할 수 있는 역할이지만, 로컬에서도 사용할 수 있게 Trusted Entity를 추가했습니다. 아래와 같이 추가했습니다.
  </p>

  <pre>
    <code>
      {
      `     {
        "Effect": "Allow",
        "Principal": {
          "AWS": "arn:aws:iam::<AWS Account ID>:root"
        },
        "Action": "sts:AssumeRole"
      }`}
    </code>
  </pre>
  {/* Image Placeholder */}

  <h3>4. 쉘 스크립트에 인증정보 업데이트</h3>
  <p>
    현재 인증정보가 어떻게 설정되어 있는지 확인할 수 있습니다.
  </p>

  <pre>
    <code>
      cat ~/.aws/config
    </code>
  </pre>

  <p>
    인증정보에 <code>role_arn</code>이 포함되어 있지 않으면 아래와 같은 오류가 발생합니다. 이를 해결하기 위해 인증정보에 업데이트를 추가합니다.
  </p>

  <pre>
    <code>
      vim ~/.aws/config
    </code>
  </pre>

  <pre>
    <code>
      {
      `[default]
region = ap-northeast-2
output = yaml
source_profile = default
role_arn = arn:aws:iam::<AWS Account ID>:user/CodeBuild-local
      `}
    </code>
  </pre>

  <p>
    이후, <code>codebuild_build.sh</code>를 실행할 때 <code>-c</code> 옵션을 포함해 인증정보를 사용해야 합니다.
  </p>

  <pre>
    <code>
      ./codebuild_build.sh -i public.ecr.aws/codebuild/amazonlinux2-x86_64-standard:5.0 -l public.ecr.aws/codebuild/local-builds:latest -a ./artifacts -c
    </code>
  </pre>

  <p>
    실행 결과 성공적이면, ECR에도 이미지가 push된 것을 확인할 수 있습니다.
  </p>

  <h1 id="파이프라인-구축-과정">파이프라인 구축 과정 (CodeBuild, CodePipeline)</h1>
  <p>
    CodeBuild를 이용해 성공적으로 Build되는 것을 확인했으니, 이를 이용해 CodePipeline을 본격적으로 구축합니다.
  </p>

  <h2 id="Buildspec-File-생성">1. Buildspec File 생성</h2>
  <p>
    GitHub Repository의 Root Directory에 <code>buildspec.yml</code> 파일을 생성합니다.
  </p>

  <blockquote>
    <p><strong>buildspec.yml</strong> 의 역할</p>
    <p>
      A <em>buildspec</em> is a collection of build commands and related settings, in YAML format, that CodeBuild uses to run a build. <br />
      빌드할 과정을 정의해두는 파일로, 본 프로젝트에서는 빌드 과정에서 Docker 이미지 생성 및 ECR에 push, EKS에 배포하는 과정이 필요합니다.
    </p>
  </blockquote>

  <pre>
    <code>
      {
      `version: 0.2

  phases:
    install:
      commands:
        # Ensure AWS CLI is installed
        - aws --version
        # Install app dependencies
        - echo "Installing app dependencies..."
        - curl -LO https://dl.k8s.io/release/v1.27.2/bin/linux/amd64/kubectl   
        - chmod +x ./kubectl
        - mkdir -p $HOME/bin && cp ./kubectl $HOME/bin/kubectl && export PATH=$PATH:$HOME/bin
        - echo 'export PATH=$PATH:$HOME/bin' >> ~/.bashrc
        - source ~/.bashrc
        - echo 'Check kubectl version'
        - kubectl version --short --client

    pre_build:
      commands:
        # Login to ECR Registry for docker to push the image to ECR Repository
        - echo "Logging in to Amazon ECR..."
        - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.ap-northeast-2.amazonaws.com

    build:
      commands:
        # Build Docker Image
        - IMAGE_REPO_NAME=$AWS_ACCOUNT_ID.dkr.ecr.ap-northeast-2.amazonaws.com/iteamoa
        - IMAGE_TAG=latest
        - echo Build started on \`date\`
        - echo Building the Docker image...          
        - docker build -t $IMAGE_REPO_NAME:$IMAGE_TAG .

    post_build:
      commands:
        # Push Docker Image to ECR Repository
        - echo Build completed on \`date\`
        - echo Pushing the Docker image...
        - docker push $IMAGE_REPO_NAME:$IMAGE_TAG

        # Setup kubectl with our EKS Cluster
        - echo "Setting up kubectl for EKS Cluster iteamoa..."
        - aws eks update-kubeconfig --name iteamoa --region ap-northeast-2

        # Deploy the latest image to the EKS cluster using Kubernetes manifests
        - echo "Applying deployment and service files to the cluster..."
        - kubectl apply -f k8s/main-service-deployment.yaml
        - kubectl apply -f k8s/main-service.yaml

        # Optionally, confirm that the deployment was successful
        - echo "Deployment applied. Verifying pods..."
        - kubectl get pods
      `}
    </code>
  </pre>

  <p>
    비용 이슈로 아직 EKS 클러스터를 생성하지 않았기 때문에 <code>eks</code> 명령어는 실행하지 못했습니다. <br />
    <code>buildspec.yml</code> 파일은 프로젝트 소스코드가 있는 레포지토리에 위치해야 하며, 일반적으로는 Root Directory에 위치합니다.
  </p>
  <h2 id="Codepipeline-생성">2. CodePipeline 생성</h2>
  <p>
    CodePipeline은 CI/CD를 하나의 파이프라인으로 묶어 자동화해주는 툴입니다. 각 단계를 취사선택할 수 있으며, AWS의 CodeCommit, CodeBuild, CodeDeploy 혹은 써드파티 앱과 연동해서 사용할 수 있습니다.
  </p>

  <h3>Step 1</h3>
  <p>
    먼저 파이프라인 생성을 선택하고, <strong>custom pipeline</strong>을 선택합니다. 
    Template 옵션은 쉽게 생성할 수 있지만, 원하는 소스나 써드파티 앱을 사용하기에는 제한적이므로, 
    본 프로젝트에 맞춰 <strong>custom option</strong>으로 설정했습니다.
  </p>

  <h3>Step 3</h3>
  <p>
    Source Stage에서 <strong>GitHub (Version 2)</strong>를 소스로 연결합니다. 중요한 점은 Connection name만 입력하고 끝내는 것이 아닌, 
    <strong>App installation</strong>에서 <strong>Install a new app</strong>을 통해 <strong>AWS Connector for GitHub</strong>을 다운받아야 한다는 것입니다.
    설치하지 않으면 CodePipeline이 소스로 GitHub을 인식할 수 없습니다. 아래와 같이 설치합니다.
  </p>
  {/* Placeholder for Image */}
  <p>
    성공적으로 앱을 설치한 후 연결되면, Repository와 Branch 이름이 불러와집니다. 여기서 소스로 연결할 Repo와 Branch를 선택합니다.
  </p>

  <h3>Step 4</h3>
  <p>
    Build 단계에서는 기존에 생성해둔 <strong>CodeBuild</strong>를 연결합니다.
  </p>

  <h3>Step 5</h3>
  <p>
    Deploy 단계는 Skip하고 넘어갑니다. Deploy를 위한 별도의 서비스를 사용하지 않았으며, 
    CodeBuild에서 배포까지 모두 해결했습니다.
  </p>
  </div>
  ),
};

export default Post2;
