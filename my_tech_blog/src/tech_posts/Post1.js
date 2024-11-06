// src/tech_posts/Post1.js
import React from 'react';

const Post1 = {
  id: 1,
  slug: 'SignUp-implementation-with-AWS-Cognito',
  title: 'SignUp implementation with AWS Cognito',
  date: 'October, 2024',
  tags: ['AWS', 'Cloud Computing', 'Cognito', 'Django', 'Python'],
  excerpt: 'Cognito를 이용하여 회원가입을 구현하는 방법을 알아보고자 한다...',
  headings: [
    { id: '환경-설정', title: '1 환경 설정', level: 1 },
    { id: 'python-설치', title: '1) python 설치', level: 2 },
    { id: '가상환경-구성-및-적용', title: '2) 가상환경 구성 및 적용', level: 2 },
    { id: 'django-설치', title: '3) django 설치', level: 2 },
    { id: '파일-구조', title: '2 파일 구조', level: 1 },
    { id: 'django-프로젝트-생성', title: '1) django 프로젝트 생성', level: 2 },
    { id: 'boto3-설치', title: '2) boto3 설치', level: 2 },
    { id: '디렉토리-구조', title: '3) 디렉토리 구조', level: 2 },
    { id: '개발', title: '3 개발', level: 1 },
    { id: 'cognito-userpool-생성', title: '1) Cognito Userpool 생성', level: 2 },
    { id: 'django-code', title: '2) django code', level: 2 },
    { id: '코드-실행', title: '3) 코드 실행', level: 2 },
    { id: '결과물', title: '4 결과물', level: 1 },
    { id: 'future-works', title: '5 Future works', level: 1 },
  ],
  content: (
<div><article>
    <h1 id="환경-설정">1 환경 설정</h1>
    <p>django를 이용해 프로젝트를 개발하기 위해서 필요한 3가지를 통해 환경 설정을 선행한다.</p>

    <h2 id="python-설치">1) python 설치</h2>
    <p>python이 설치되어 있는지 확인한다. <inline-code>python3 --version</inline-code> 명령어를 통해서 확인할 수 있으며, 설치되어 있다면 아래와 같이 현재 버전이 출력된다. 버전이 출력되지 않으면 설치하면 된다.</p>
    
    <pre><code>{
    `pbh7080@Bohyeons-MacBook-Air login-service % python3 --version
Python 3.12.6`
    }</code></pre>

    <h2 id="가상환경-구성-및-적용">2) 가상환경 구성 및 적용</h2>
    <p>{`파이썬은 프로젝트를 진행할 때 가상환경을 사용하는데, 그 이유는 파이썬의 패키지 관리하는 방식때문이다. 
    파이썬은 같은 인터프러터 버전끼리 같은 패키지를 공유하기 때문에 가상환경을 사용하지 않으면 여러 프로젝트에서 
    다른 버전의 패키지를 사용할 수 없게 된다. 따라서 일반적으로 프로젝트마다 가상환경을 생성해준다.`}</p>
    <p>{`
    본 프로젝트의 이름을 빌려 venviteamoa라는 가상환경을 만들었고, 이를 활성화했다. 
    참고로 venv은 virtual environment의 줄임말이다.`}</p>
    <p>
    <inline-code>{`python3 -m venv {virtual env name}`}</inline-code> 을 통해 가상환경을 구성하고,
    <inline-code> {`source {virtual env name}/bin/activate`}</inline-code> 을 통해 활성화한다.
    </p>

    
    <pre><code>{
    `pbh7080@Bohyeons-MacBook-Air login-service % python3 -m venv venviteamoa
pbh7080@Bohyeons-MacBook-Air login-service % source venviteamoa/bin/activate`}
    </code></pre>

    성공적으로 생성되어 활성화했다면, 터미널에서 아래와 같이 맨 앞에 가상환경의 이름이 보인다.
    <pre><code>{
    `(venviteamoa) pbh7080@Bohyeons-MacBook-Air`}
    </code></pre>

    <h2 id="django-설치">3) django 설치</h2>
    <p>아래 <code>pip3 install</code> 명령어를 통해 django를 설치한다.</p>
    
    <pre><code>{
    `(venviteamoa) pbh7080@Bohyeons-MacBook-Air login-service % pip3 install django`
    }</code></pre>

    성공적으로 설치됐다면 아래와 같이 Successfully installed가 출력된다.
    <pre><code>{
`Collecting django
Downloading Django-5.1.2-py3-none-any.whl.metadata (4.2 kB)
Collecting asgiref<4,>=3.8.1 (from django)
Downloading asgiref-3.8.1-py3-none-any.whl.metadata (9.3 kB)
Collecting sqlparse>=0.3.1 (from django)
Downloading sqlparse-0.5.1-py3-none-any.whl.metadata (3.9 kB)
Downloading Django-5.1.2-py3-none-any.whl (8.3 MB)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 8.3/8.3 MB 8.6 MB/s eta 0:00:00
Downloading asgiref-3.8.1-py3-none-any.whl (23 kB)
Downloading sqlparse-0.5.1-py3-none-any.whl (44 kB)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 44.2/44.2 kB 4.6 MB/s eta 0:00:00
Installing collected packages: sqlparse, asgiref, django
Successfully installed asgiref-3.8.1 django-5.1.2 sqlparse-0.5.1

[notice] A new release of pip is available: 24.0 -> 24.2
[notice] To update, run: pip install --upgrade pip`
    }</code></pre>

    혹은  <inline-code>python3 -m django --version </inline-code> 명령어를 통해 버전확인을 할 수 있는데, 정상적으로 버전이 출력된다면 성공이다.
    <br/>
    출력 예시는  <inline-code>5.1.2</inline-code> 이런 소수점을 포함한 숫자가 출력된다.


    <h1 id="파일-구조">2 파일 구조</h1>
    본격적으로 프로젝트 파일을 만들고, 디렉토리 구조를 짜본다.
    <h2 id="django-프로젝트-생성">1) django 프로젝트 생성</h2>
    <p>django는 큰 프로젝트 하위에 여러가지 app(기능군)이 있는 구조로 처음 프로젝트를 시작하기 위해 프로젝트를 먼저 생성해야 한다.</p>
    <inline-code>{`django-admin startproject <project-name> . `}</inline-code>명령어로 실행할 수 있으며,<strong> 주의할 점은 프로젝트 이름은 오직 영어와 _(언더바)로만 이루어질 수 있다.</strong> 그렇지 않으면 아래와 같은 오류가 발생한다.
    <pre><code>{
    `(venviteamoa) pbh7080@Bohyeons-MacBook-Air login-service % django-admin startproject login-project .
CommandError: 'login-service' is not a valid project name. Please make sure the name is a valid identifier.     `}</code></pre>
    
    최종적으로 다음과 같이 <inline-code>login</inline-code>이라는 프로젝트를 생성했다. 프로젝트를 생성하면 기본적인 파일 구조가 같이 생성된다.
    <pre><code>{`django-admin startproject login_project .`}</code></pre>


    <h2 id="boto3-설치">2) boto3 설치</h2>
    <p>
        aws cognito를 사용하여 로그인 및 회원가입을 구현할 것이기에 관련 SDK를 설치해야 한다. 
        개발 언어마다 지원하는 SDK가 상이하며, python의 경우 cognito를 사용하기 위한 AWS SDK로 boto3를 지원한다. 
        boto3가 설치되어야만 conginto를 사용할 수 있다. (즉, 필수!) 
    </p>

    django와 마찬가지로 <inline-code>pip3 install</inline-code>을 이용해서 다운할 수 있으면 성공적으로 다운하면 아래와 같이 출력된다.

    <pre><code>{`pip3 install boto3
> Successfully installed boto3-1.35.42 botocore-1.35.42 jmespath-1.0.1 python-dateutil-2.9.0.post0 s3transfer-0.10.3 six-1.16.0 urllib3-2.2.3`}</code></pre>

    추가로 dependency를 체크하기 위해 requirements라는 텍스트 파일을 하나 생성한다.
    이 파일에는 사용하는 라이브러리 혹은 SDK의 버전을 명시해두기 때문에 만들어두는 것이 권장된다.
    아래 명령어를 실행한다.
    <pre><code>pip3 freeze > requirements.txt</code></pre>


    <h2 id="디렉토리-구조">3) 디렉토리 구조</h2>
    <p>프로젝트의 디렉토리 구조는 아래와 같다.</p>

    <pre><code>{
    `📦login-service (프로젝트 위치, 그냥 폴더)
 ┣ 📂.git
 ┣ 📂authentication (App1)
 ┃ ┣ 📂__pycache__
 ┃ ┣ 📂templates
 ┃ ┃ ┣ 📜homepage.html
 ┃ ┃ ┣ 📜signin.html
 ┃ ┃ ┣ 📜signup.html
 ┃ ┃ ┗ 📜verification.html
 ┃ ┣ 📜__init__.py
 ┃ ┣ 📜cognito_helper.py
 ┃ ┣ 📜forms.py
 ┃ ┣ 📜urls.py
 ┃ ┗ 📜views.py
 ┣ 📂login_project (처음 생성한 프로젝트)
 ┃ ┣ 📂__pycache__
 ┃ ┣ 📜__init__.py
 ┃ ┣ 📜asgi.py
 ┃ ┣ 📜settings.py
 ┃ ┣ 📜urls.py
 ┃ ┗ 📜wsgi.py
 ┣ 📂venviteamoa   (프로젝트의 가상환경)`}
    </code></pre>

    <ul>
        <li><inline-code>login_project(project)</inline-code>에는 <inline-code>settings.py</inline-code>, <inline-code>urls.py</inline-code>, <inline-code>wsgi.py</inline-code> 같은 프로젝트의 main configuration file이 포함된다. </li>
        <li><inline-code>authentication(app)</inline-code>에는 실제 로그인 기능을 구현하기 위해 필요한 로직이 포함된다.</li>
        <li><inline-code>templates</inline-code>는 간단하게 코드를 로컬 웹으로 테스트 하기 위한 용도로 만든 것이다. (필수 요소는 아님)</li>
        <li><inline-code>urls.py</inline-code> 파일은 클라이언트의 요청인 URL을 보고 알맞은 로직을 제공하기 위해 계층적으로 구성된다. 모든 URL에 대한 분기가 끝나면 알맞은 view를 호출하여 로직 처리한다. (일종의 URL Router 역할)</li>
        <li><inline-code>views.py</inline-code> 파일은 비즈니스 로직을 담당한다. View는 애플리케이션의 데이터와 사용자 인터페이스를 연결하는 역할로, 각 View 함수는 웹 요청을 받아 처리하고 웹 응답을 반환한다.</li>
        <li>나머지 파일들은 설명 생략</li>
    </ul>


    <h1 id="개발">3 개발</h1>
    <h2 id="cognito-userpool-생성">1) Cognito Userpool 생성</h2>
    <p>Cognito를 사용하기 위해서는 UserPool을 생성해야 한다. 지금부터 순서대로 생성하는 방법과 본 프로젝트에서는 어떤 옵션을 선택했는지 보여준다.</p>
    
    <img
        src={`${process.env.PUBLIC_URL}/post1/image1.png`}
        alt="1"
    />

    제공해주는 Cognito userpool을 사용할 경우, MAU 50,000명까지 매달 무료로 사용할 수 있기에 Cognito userpool을 사용한다. 
    회원가입 시에 이름과 Email만을 받을 것이기 때문에 옵션을 두 가지 선택하고, 아래에 있는 preferred user name과 case sensitive 옵션도 체크해준다.

    <div className="image-container">
        <img
            src={`${process.env.PUBLIC_URL}/post1/image2.png`}
            alt="2"
        />
        <img
            src={`${process.env.PUBLIC_URL}/post1/image3.png`}
            alt="3"
        />
    </div>

    <p>(왼쪽) 비밀번호의 경우, Custom mode를 선택하여 대문자 미포함을 선택한다. 
        defaults를 선택하면 대문자까지 포함해야 한다. 
        보안을 조금 더 신경쓰는 경우는 대문자 포함을 권장하나 본 프로젝트에서 개인 정보 유출의 위험이 없다고 판단해서 본인은 안했다. 
    </p>
    <p>
    (오른쪽) 추가적으로 MFA 옵션도 선택안했으며, Seoul Region은 SMS 서비스를 지원하지 않기 때문에 오직 Email만으로 리커버리가 가능하도록 했다.
    </p>

    <img
        src={`${process.env.PUBLIC_URL}/post1/image4.png`}
        alt="4"
    />
    <p>다음 페이지에서 나머지 설정은 기본 그대로 두고, 마지막에 Required attributes에서 추가하고 싶은 값(사용자에게 필수로 받고자 하는 값)만 추가했다.</p>
    
    <img
        src={`${process.env.PUBLIC_URL}/post1/image5.png`}
        alt="5"
    />
    Send email with Cognito를 선택하면 cognito에서 알아서 이메일을 보내주고 관리해주기 때문에 편하다. 
    이메일 인증을 할 것이기 때문에 편한 방법을 선택했다.

    <img
        src={`${process.env.PUBLIC_URL}/post1/image6.png`}
        alt="6"
    />
    다음 장에서 위의 설정은 모두 그대로 뒀으며, 로그인 페이지의 디자인을 따로 Frontend에서 구현할 것이기 때문에 Hosted UI도 사용하지 않는다. 

    app client 종류 설명 추가하기

    <div className="image-container">
        <img
            src={`${process.env.PUBLIC_URL}/post1/image7.png`}
            alt="7"
        />
        <img
            src={`${process.env.PUBLIC_URL}/post1/image8.png`}
            alt="8"
        />
    </div>
    <p>닫혀 있는 Advanced app client setting을 열어서 Authentication Flows를 추가한다. 이 부분은 App client를 생성할 때 중요한 부분이다. 
        특히, <inline-code>ALLOW_USER_PASSWORD_AUTH</inline-code>는 비밀번호의 유효성을 검증하는 Flow로 초기에 생성할 때만 추가 가능하며, 수정으로는 추가할 수 없으니 꼭 확인한다.
    </p>
    
    <img
        src={`${process.env.PUBLIC_URL}/post1/image9.png`}
        alt="9"
    />
    모든 과정을 완료하여 성공적으로 user pool이 생성되었다면, 위와 같이 목록에 뜨는 것을 확인할 수 있다.

    <img
        src={`${process.env.PUBLIC_URL}/post1/image10.png`}
        alt="10"
    />
    <p>
        App client로 제대로 생성되어 있는지 확인하기 위해 본 프로젝트를 클릭하여 상세페이지에 들어간다. 
        위와 같은 화면이 뜨는데 이때, App Integration을 클릭하고 가장 아래로 스크롤하면 App client에 대한 정보를 확인할 수 있다.
    </p>

    <div className="image-container">
        <img
            src={`${process.env.PUBLIC_URL}/post1/image11.png`}
            alt="11"
        />
        <img
            src={`${process.env.PUBLIC_URL}/post1/image12.png`}
            alt="12"
        />
    </div>

    <p>
    위와 같이 생성 시에 만든 App client가 목록에서 확인되면 성공적이다. 
    App client를 클릭해서 상세화면에서 Authentication Flows가 제대로 선택되었는지도 확인한다. 
    App client ID는 추후 코드에서 사용해야하니 미리 복사해두는 것을 권장한다.
    </p>

    <strong>모든 게 완료되었으면 Cognito User Pool 생성은 성공적 !</strong>


    <h2 id="django-code">2) django code</h2>
    <p>
    Cognito를 사용하는 핵심 부분인 <inline-code>cognito_helper.py</inline-code>와 <inline-code>views.py</inline-code>는 아래와 같이 구현했다. 
    Cognito를 사용하기 위해 User Pool의 생성한 App client ID가 필요한데 이는 [User pool]-[App Integration]-[App clinents and analytics]에서 확인할 수 있다. 
    또한 이 id는 노출되지 않는 것이 보안상 안정하기 때문에 <inline-code>dotenv</inline-code>를 이용해 관리했다.
    </p>
    <li><strong><inline-code>cognito_helper.py</inline-code></strong></li>
    <pre><code>
    {`#login-service/authentication/cognito_helper.py
import boto3
import logging   # 원래 logging을 하려했지만 귀찮아서 print로 변경(추후 변경할 수 있으면 할 예정)
import os

# Load environment variables from the .env file
load_dotenv()

# Now you can access the environment variables
AWS_CLIENT_ID = os.getenv('AWS_CLIENT_ID')
AWS_REGION = os.getenv('AWS_REGION')

def signup_user(username, password, email,nickname, full_name):
    client = boto3.client('cognito-idp', region_name='AWS_REGION')
    try:
        response = client.sign_up(
            ClientId='AWS_CLIENT_ID',
            Username=username,
            Password=password,
            UserAttributes=[
	             # Include required attributes
                {'Name': 'email', 'Value': email},
                {'Name': 'nickname', 'Value': nickname}, 
                {'Name': 'name', 'Value': full_name},
            ]
        )
        return response
    except client.exceptions.UsernameExistsException:
        return 'User already exists'

def signin_user(username, password):
    client = boto3.client('cognito-idp', region_name='AWS_REGION')
    try:
        response = client.initiate_auth(
            ClientId='AWS_CLIENT_ID',
            AuthFlow='USER_PASSWORD_AUTH',
            AuthParameters={'USERNAME': username, 'PASSWORD': password}
        )
        return response
    except client.exceptions.NotAuthorizedException:
        return 'Invalid credentials'
    except client.exceptions.NotAuthorizedException:
        print("Invalid credentials provided.")  # 원래 logging을 하고자 했지만 귀찮아서 print로 변경
        return {'error': 'Invalid credentials'}
    except client.exceptions.UserNotConfirmedException:
        print("User is not confirmed.")
        return {'error': 'User not confirmed. Please check your email for verification.'}
    except client.exceptions.PasswordResetRequiredException:
        print("Password reset required for this user.")
        return {'error': 'Password reset required. Please reset your password.'}
    except client.exceptions.UserNotFoundException:
        print("User not found.")
        return {'error': 'User not found.'}
    except Exception as e:
        print(f"An unexpected error occurred: {str(e)}")
        return {'error': 'An unexpected error occurred.'}`}    
    </code></pre>
    각각 Cognito를 이용한 회원가입(signup)과 로그인(signin)의 로직이다. 
    <br/><br/>
    <inline-code>signup_user</inline-code>
    <p>
    회원가입 시, 동일한 유저가 있으면 예외 처리를 통해 'User already exists'를 반환하도록 했다. 
    email 중복의 경우, Cognito에서 중복 검사를 해준다.
    </p>

    <inline-code>signin_user</inline-code>
    <p>
    로그인의 경우, 로그인 실패가 일어날 수 있는 경우가 다양하기 때문에 각각 예외 처리를 통해 json 형태로 Return하도록 구현했다. 
    추후 Views에서 사용될 예정이다. 
    </p>

    <li><strong><inline-code>views.py</inline-code></strong></li>
<pre><code>
    {`#login-service/authentication/views.py
from django.shortcuts import render, redirect
from .cognito_helper import signup_user, signin_user
from django.http import JsonResponse
from django.urls import reverse
from dotenv import load_dotenv
import boto3
import os

# Load environment variables from the .env file
load_dotenv()

# Now you can access the environment variables
AWS_CLIENT_ID = os.getenv('AWS_CLIENT_ID')
AWS_REGION = os.getenv('AWS_REGION')

def signup_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        email = request.POST['email']
        nickname = request.POST['nickname']  # Get the nickname
        full_name = request.POST['full_name']  # Get the full name
        result = signup_user(username, password, email, nickname, full_name)
        # return redirect(reverse('authentication:signin'))
        return redirect('authentication:verify')
    return render(request, 'signup.html')

def signin_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        result = signin_user(username, password)
        if 'AuthenticationResult' in result:
            jwt_token = result['AuthenticationResult']['AccessToken']
            return JsonResponse({'token': jwt_token})
        return JsonResponse(result)
    return render(request, 'signin.html')

def homepage_view(request):
    return render(request, 'homepage.html')

def confirm_signup_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        verification_code = request.POST['verification_code']
        
        client = boto3.client('cognito-idp', region_name='AWS_REGION')  # Replace with your region
        try:
            response = client.confirm_sign_up(
                ClientId='AWS_CLIENT_ID',  # Replace with your Cognito App Client ID
                Username=username,
                ConfirmationCode=verification_code
            )
            return redirect('authentication:signin')  # Redirect to sign-in page after confirmation
        except client.exceptions.CodeMismatchException:
            return render(request, 'verification.html', {'error': 'Invalid verification code.'})
        except client.exceptions.UserNotFoundException:
            return render(request, 'verification.html', {'error': 'User not found.'})
        except client.exceptions.NotAuthorizedException:
            return render(request, 'verification.html', {'error': 'User is already confirmed.'})
    
    return render(request, 'verification.html')`}    
    </code></pre>

    <inline-code>signup_view</inline-code>
    <p>
    POST 요청을 통해 회원가입 요청이 들어오면 처리하는 함수다. 
    회원가입 정보를 받아 이상이 없다면 유저 정보를 등록하고, <inline-code>return redirect('authentication:verify')</inline-code> 을 통해 검증 페이지로 넘어가며 이메일 검증을 실시한다. 
    아래 화면과 같이 이메일 검증이 되기 전까지는 [User Pool]-[Users]의 <inline-code>Confirmation status</inline-code>가 <inline-code>Unconfirmed</inline-code>이며 로그인을 할 수 없다. 
    이메일 검증까지 완료되면 <inline-code>Confirmation status</inline-code>가 <inline-code>Confirmed</inline-code>로 설정되며, 로그인이 가능하다. 
    </p>
    (아래의 경우, 같은 이메일이 두 개인 이유는 하나는 unconfirmed이기 때문에 유효하지 않다고 판단되는 듯)
    <img
        src={`${process.env.PUBLIC_URL}/post1/image13.png`}
        alt="13"
    />

    <inline-code>signin_view</inline-code>
    <p>
    POST 요청을 통해 로그인 요청이 들어오면 처리하는 함수다. 
    정상적으로 로그인이 완료되면 JWT Token을 반환한다. 
    그렇지 않으면, 위에서 예외 처리해놨던 <inline-code>signin_view</inline-code>의 반환값으로  로그인이 되지 않은 이유를 반환한다. 
    </p>

    <div className="image-container">
        <img
            src={`${process.env.PUBLIC_URL}/post1/image14.png`}
            alt="14"
        />
        <img
            src={`${process.env.PUBLIC_URL}/post1/image15.png`}
            alt="15"
        />
    </div>
    <p>
    성공적으로 로그인하면 위와 같이 JWT Token을 json의 형태로 반환하는 것을 확인할 수 있으며, 
    이를 jwt 복호화해본 결과, 맞게 출력되는 것을 확인할 수 있었다.
    </p>

    <br/>
    <inline-code>homepage_view</inline-code>
    <p>
    기본 화면을 위해 임시로 생성해뒀다. 아무런 기능없이 홈화면 html을 리턴해준다.
    </p>
    
    <inline-code>confirm_signup_view</inline-code>
    <p>
    회원가입 후 <inline-code>authentication:verify</inline-code> 로 redirect했는데 이 부분을 나타내는 view다. 
    이메일로 보낸 인증번호와 Username을 입력한 후, 두 개다 일치한다면 인증성공이다. 
    그렇지 않은 경우는 예외 처리를 통해 어떤 에러인지 알 수 있도록 구현했다.
    </p>

    <h2 id="코드-실행">3) 코드 실행</h2>
    <pre><code>python3 manage.py runserver</code></pre>

    <h1 id="결과물">4 결과물</h1>
    <p>GitHub > <a href="https://github.com/ITeaMoa/login-service">https://github.com/ITeaMoa/login-service</a></p>

    <h2 id="회원가입">회원가입</h2>
    <div className="image-container">
        <img
            src={`${process.env.PUBLIC_URL}/post1/image16.png`}
            alt="16"
        />
        <img
            src={`${process.env.PUBLIC_URL}/post1/image17.png`}
            alt="17"
        />
    </div>
    <p>비밀번호 조건 만족 안 했을 시, 오류가 발생한다. (이메일, 이름 중복 체크 다시 한 번 확인해야 함)</p>

    <h2 id="로그인">로그인</h2>
    <div className="image-container">
        <img
            src={`${process.env.PUBLIC_URL}/post1/image18.png`}
            alt="18"
        />
        <img
            src={`${process.env.PUBLIC_URL}/post1/image14.png`}
            alt="14"
        />
    </div>
    <p>로그인이 성공적으로 되면, JWT를 반환한다.</p>

    <h2 id="이메일-인증">이메일 인증</h2>
    <div className="image-container">
        <img
            src={`${process.env.PUBLIC_URL}/post1/image19.png`}
            alt="19"
        />       <img
            src={`${process.env.PUBLIC_URL}/post1/image20.png`}
            alt="20"
        />
    </div>
    <p>위와 같이 이메일을 통해 인증 정보를 받고, 인증 정보를 입력하는 페이지를 통해 인증한다.</p>

    <h1 id="future-works">5 Future works</h1>
    <ul>
        <li>Frontend & Backend에 전달하기</li>
        <li>JWT token 사용 (backend)</li>
        <li>Client-side store (frontend)</li>
        <li>중복 체크 부분 수정</li>
        <li>Dockerfile 생성 및 CI/CD</li>
    </ul>
    </article></div>

  ),
};

export default Post1;
